<?php
/**
 * Plugin Name:       HADS
 * Plugin URI:        https://hads.dev
 * Description:       Add HADS ad slots to your site: loads hads.js and provides a [hads_slot] shortcode and a block.
 * Version:           0.1.0
 * Requires at least: 6.3
 * Requires PHP:      7.4
 * Author:            HADS
 * Author URI:        https://hads.dev
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       hads
 *
 * @package Hads
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'HADS_VERSION', '0.1.0' );
define( 'HADS_OPTION', 'hads_settings' );
define( 'HADS_DEFAULT_BASE_URL', 'https://api.hads.dev' );

/**
 * Slot types the script understands.
 *
 * @return string[]
 */
function hads_slot_types() {
	return array( 'inline', 'card', 'row', 'teaser', 'rail' );
}

/**
 * Saved settings merged with defaults.
 *
 * @return array{site_key:string,base_url:string,attribution:string,auto_insert:string,auto_type:string}
 */
function hads_get_settings() {
	$saved = get_option( HADS_OPTION, array() );
	return wp_parse_args(
		is_array( $saved ) ? $saved : array(),
		array(
			'site_key'    => '',
			'base_url'    => HADS_DEFAULT_BASE_URL,
			'attribution' => '',
			'auto_insert' => '',
			'auto_type'   => 'inline',
		)
	);
}

/**
 * Sanitize the settings array.
 *
 * @param mixed $input Raw input.
 * @return array
 */
function hads_sanitize_settings( $input ) {
	$input = is_array( $input ) ? $input : array();
	$out   = array();

	$key             = isset( $input['site_key'] ) ? sanitize_text_field( wp_unslash( $input['site_key'] ) ) : '';
	$out['site_key'] = preg_replace( '/[^A-Za-z0-9_\-]/', '', $key );

	$base            = isset( $input['base_url'] ) ? esc_url_raw( trim( wp_unslash( $input['base_url'] ) ), array( 'https', 'http' ) ) : '';
	$out['base_url'] = $base ? untrailingslashit( $base ) : HADS_DEFAULT_BASE_URL;

	$out['attribution'] = isset( $input['attribution'] ) ? sanitize_text_field( wp_unslash( $input['attribution'] ) ) : '';

	$auto               = isset( $input['auto_insert'] ) ? sanitize_key( $input['auto_insert'] ) : '';
	$out['auto_insert'] = in_array( $auto, array( '', 'after_content' ), true ) ? $auto : '';

	$type             = isset( $input['auto_type'] ) ? sanitize_key( $input['auto_type'] ) : 'inline';
	$out['auto_type'] = in_array( $type, hads_slot_types(), true ) ? $type : 'inline';

	return $out;
}

/**
 * Script URL, e.g. https://api.hads.dev/v1/hads.js?site=KEY.
 *
 * @param array $settings Settings.
 * @return string
 */
function hads_script_url( $settings ) {
	$base = untrailingslashit( $settings['base_url'] ? $settings['base_url'] : HADS_DEFAULT_BASE_URL );
	return $base . '/v1/hads.js?site=' . rawurlencode( $settings['site_key'] );
}

/**
 * Enqueue hads.js (async) on the front end when a site key is set.
 */
function hads_enqueue_script() {
	$settings = hads_get_settings();
	if ( '' === $settings['site_key'] ) {
		return;
	}
	wp_enqueue_script(
		'hads',
		hads_script_url( $settings ),
		array(),
		null, // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion -- the service versions its own script.
		array(
			'strategy'  => 'async',
			'in_footer' => false,
		)
	);
}
add_action( 'wp_enqueue_scripts', 'hads_enqueue_script' );

/**
 * Render slot markup (matches the HTML snippets on hads.dev/docs).
 *
 * @param array $args type, topic, allow_self, attribution, class, skeleton.
 * @return string
 */
function hads_render_slot( $args = array() ) {
	$settings = hads_get_settings();
	$args     = wp_parse_args(
		$args,
		array(
			'type'        => 'inline',
			'topic'       => '',
			'allow_self'  => false,
			'attribution' => '',
			'class'       => '',
			'skeleton'    => true,
		)
	);

	$type = in_array( $args['type'], hads_slot_types(), true ) ? $args['type'] : 'inline';

	$attribution = '' !== (string) $args['attribution'] ? $args['attribution'] : $settings['attribution'];
	if ( '' === (string) $attribution ) {
		$attribution = __( 'Ads by HADS', 'hads' );
	}

	$classes = array( 'hads-unit', 'hads-unit--' . $type );
	foreach ( preg_split( '/\s+/', (string) $args['class'], -1, PREG_SPLIT_NO_EMPTY ) as $extra ) {
		$classes[] = sanitize_html_class( $extra );
	}

	$skeleton = filter_var( $args['skeleton'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE );
	$skeleton = null === $skeleton ? true : $skeleton;
	$title    = $skeleton ? '<span class="hads-unit-skeleton hads-unit-skeleton--title" aria-hidden="true"></span>' : '';
	$text     = $skeleton
		? '<span class="hads-unit-skeleton hads-unit-skeleton--text" aria-hidden="true"></span>'
			. '<span class="hads-unit-skeleton hads-unit-skeleton--text hads-unit-skeleton--text-short" aria-hidden="true"></span>'
		: '';

	$attr = sprintf(
		'data-hads-slot="%1$s" class="%2$s"',
		esc_attr( $type ),
		esc_attr( implode( ' ', array_filter( $classes ) ) )
	);
	if ( '' !== (string) $args['topic'] ) {
		$attr .= ' data-hads-topic="' . esc_attr( $args['topic'] ) . '"';
	}
	if ( filter_var( $args['allow_self'], FILTER_VALIDATE_BOOLEAN ) ) {
		$attr .= ' data-hads-allow-self';
	}

	$a_attr = '<a data-hads-attribution class="hads-unit-attribution">' . esc_html( $attribution ) . '</a>';
	$strong = '<strong data-hads-title>' . $title . '</strong>';
	$p      = '<p data-hads-text>' . $text . '</p>';
	$url    = '<a data-hads-url></a>';
	$img    = '<img data-hads-image alt="" />';

	switch ( $type ) {
		case 'card':
			$inner = $a_attr . $img . $strong . $p . $url;
			break;
		case 'row':
			$inner = $img . '<div class="hads-unit-body">' . $a_attr . $strong . $p . $url . '</div>';
			break;
		case 'teaser':
			$inner = $a_attr . '<a data-hads-url>' . $strong . '</a>' . $p;
			break;
		default:
			$inner = $a_attr . $strong . $p . $url;
	}

	return '<aside ' . $attr . '>' . $inner . '</aside>';
}

/**
 * [hads_slot type="inline" topic="" allow_self="false" attribution="" class=""]
 *
 * @param array|string $atts Shortcode attributes.
 * @return string
 */
function hads_shortcode( $atts ) {
	$atts = shortcode_atts(
		array(
			'type'        => 'inline',
			'topic'       => '',
			'allow_self'  => 'false',
			'attribution' => '',
			'class'       => '',
			'skeleton'    => 'true',
		),
		$atts,
		'hads_slot'
	);
	return hads_render_slot( $atts );
}
add_shortcode( 'hads_slot', 'hads_shortcode' );

/**
 * Register the "hads/slot" block (server-rendered; no build step).
 */
function hads_register_block() {
	register_block_type(
		__DIR__ . '/blocks/slot',
		array(
			'render_callback' => 'hads_render_block',
		)
	);
}
add_action( 'init', 'hads_register_block' );

/**
 * Block render callback.
 *
 * @param array $attributes Block attributes.
 * @return string
 */
function hads_render_block( $attributes ) {
	return hads_render_slot(
		array(
			'type'       => isset( $attributes['type'] ) ? (string) $attributes['type'] : 'inline',
			'topic'      => isset( $attributes['topic'] ) ? (string) $attributes['topic'] : '',
			'allow_self' => ! empty( $attributes['allowSelf'] ),
			'class'      => isset( $attributes['className'] ) ? (string) $attributes['className'] : '',
		)
	);
}

/**
 * Optionally append a slot after single post content.
 *
 * @param string $content Post content.
 * @return string
 */
function hads_auto_insert( $content ) {
	$settings = hads_get_settings();
	if ( 'after_content' !== $settings['auto_insert'] || '' === $settings['site_key'] ) {
		return $content;
	}
	if ( ! is_singular( 'post' ) || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}
	return $content . hads_render_slot( array( 'type' => $settings['auto_type'] ) );
}
add_filter( 'the_content', 'hads_auto_insert', 20 );

/*
 * ---------------------------------------------------------------------------
 * Settings page (Settings > HADS). settings_fields() outputs the nonce and
 * options.php verifies it and the manage_options capability.
 * ---------------------------------------------------------------------------
 */

/**
 * Register setting, section and fields.
 */
function hads_register_settings() {
	register_setting(
		'hads',
		HADS_OPTION,
		array(
			'type'              => 'array',
			'sanitize_callback' => 'hads_sanitize_settings',
			'default'           => array(),
			'show_in_rest'      => false,
		)
	);

	add_settings_section( 'hads_main', __( 'HADS', 'hads' ), 'hads_section_intro', 'hads' );

	add_settings_field( 'hads_site_key', __( 'Site key', 'hads' ), 'hads_field_site_key', 'hads', 'hads_main', array( 'label_for' => 'hads_site_key' ) );
	add_settings_field( 'hads_base_url', __( 'API base URL', 'hads' ), 'hads_field_base_url', 'hads', 'hads_main', array( 'label_for' => 'hads_base_url' ) );
	add_settings_field( 'hads_attribution', __( 'Attribution text', 'hads' ), 'hads_field_attribution', 'hads', 'hads_main', array( 'label_for' => 'hads_attribution' ) );
	add_settings_field( 'hads_auto_insert', __( 'Automatic slot', 'hads' ), 'hads_field_auto_insert', 'hads', 'hads_main', array( 'label_for' => 'hads_auto_insert' ) );
}
add_action( 'admin_init', 'hads_register_settings' );

/**
 * Section intro text.
 */
function hads_section_intro() {
	echo '<p>' . esc_html__( 'Paste the site key from your HADS dashboard. Place slots with the [hads_slot] shortcode or the "HADS slot" block.', 'hads' ) . '</p>';
}

/**
 * Site key field.
 */
function hads_field_site_key() {
	$s = hads_get_settings();
	printf(
		'<input type="text" id="hads_site_key" name="%1$s[site_key]" value="%2$s" class="regular-text code" autocomplete="off" />',
		esc_attr( HADS_OPTION ),
		esc_attr( $s['site_key'] )
	);
}

/**
 * Base URL field.
 */
function hads_field_base_url() {
	$s = hads_get_settings();
	printf(
		'<input type="url" id="hads_base_url" name="%1$s[base_url]" value="%2$s" class="regular-text code" placeholder="%3$s" /><p class="description">%4$s</p>',
		esc_attr( HADS_OPTION ),
		esc_attr( $s['base_url'] ),
		esc_attr( HADS_DEFAULT_BASE_URL ),
		esc_html__( 'Leave the default unless you run your own HADS engine.', 'hads' )
	);
}

/**
 * Attribution field.
 */
function hads_field_attribution() {
	$s = hads_get_settings();
	printf(
		'<input type="text" id="hads_attribution" name="%1$s[attribution]" value="%2$s" class="regular-text" placeholder="%3$s" />',
		esc_attr( HADS_OPTION ),
		esc_attr( $s['attribution'] ),
		esc_attr__( 'Ads by HADS', 'hads' )
	);
}

/**
 * Auto-insert fields.
 */
function hads_field_auto_insert() {
	$s = hads_get_settings();
	printf( '<select id="hads_auto_insert" name="%s[auto_insert]">', esc_attr( HADS_OPTION ) );
	printf( '<option value="" %s>%s</option>', selected( $s['auto_insert'], '', false ), esc_html__( 'Off', 'hads' ) );
	printf( '<option value="after_content" %s>%s</option>', selected( $s['auto_insert'], 'after_content', false ), esc_html__( 'After post content', 'hads' ) );
	echo '</select> ';
	printf( '<label class="screen-reader-text" for="hads_auto_type">%s</label>', esc_html__( 'Slot type', 'hads' ) );
	printf( '<select id="hads_auto_type" name="%s[auto_type]">', esc_attr( HADS_OPTION ) );
	foreach ( hads_slot_types() as $type ) {
		printf( '<option value="%1$s" %2$s>%1$s</option>', esc_attr( $type ), selected( $s['auto_type'], $type, false ) );
	}
	echo '</select>';
}

/**
 * Add Settings > HADS.
 */
function hads_add_settings_page() {
	add_options_page( __( 'HADS', 'hads' ), __( 'HADS', 'hads' ), 'manage_options', 'hads', 'hads_render_settings_page' );
}
add_action( 'admin_menu', 'hads_add_settings_page' );

/**
 * Settings page markup.
 */
function hads_render_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	?>
	<div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
		<form action="options.php" method="post">
			<?php
			settings_fields( 'hads' );
			do_settings_sections( 'hads' );
			submit_button();
			?>
		</form>
	</div>
	<?php
}

/**
 * "Settings" link on the Plugins screen.
 *
 * @param string[] $links Action links.
 * @return string[]
 */
function hads_action_links( $links ) {
	$url = admin_url( 'options-general.php?page=hads' );
	array_unshift( $links, '<a href="' . esc_url( $url ) . '">' . esc_html__( 'Settings', 'hads' ) . '</a>' );
	return $links;
}
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'hads_action_links' );
