<?php
// Minimal WordPress stubs to load hads.php outside WordPress and print
// rendered slots as JSON (compared with snippets.ex fixtures by check.mjs).
define( 'ABSPATH', __DIR__ );
$GLOBALS['hads_test_options'] = array();
function add_action() {}
function add_filter() {}
function add_shortcode() {}
function register_block_type() {}
function plugin_basename( $f ) { return basename( $f ); }
function get_option( $k, $d = false ) { return isset( $GLOBALS['hads_test_options'][ $k ] ) ? $GLOBALS['hads_test_options'][ $k ] : $d; }
function wp_parse_args( $a, $d ) { return array_merge( $d, (array) $a ); }
function __( $s ) { return $s; }
function esc_attr( $s ) { return htmlspecialchars( (string) $s, ENT_QUOTES, 'UTF-8' ); }
function esc_html( $s ) { return htmlspecialchars( (string) $s, ENT_QUOTES, 'UTF-8' ); }
function sanitize_html_class( $c ) { return preg_replace( '/[^A-Za-z0-9_-]/', '', $c ); }
function sanitize_text_field( $s ) { return trim( strip_tags( (string) $s ) ); }
function sanitize_key( $s ) { return preg_replace( '/[^a-z0-9_\-]/', '', strtolower( (string) $s ) ); }
function wp_unslash( $s ) { return $s; }
function esc_url_raw( $u ) { return filter_var( $u, FILTER_VALIDATE_URL ) && preg_match( '#^https?://#', $u ) ? $u : ''; }
function untrailingslashit( $s ) { return rtrim( $s, '/\\' ); }
function shortcode_atts( $pairs, $atts ) { $atts = (array) $atts; $out = array(); foreach ( $pairs as $k => $v ) { $out[ $k ] = array_key_exists( $k, $atts ) ? $atts[ $k ] : $v; } return $out; }

require dirname( __DIR__ ) . '/hads/hads.php';

$out = array();
foreach ( hads_slot_types() as $t ) {
	$out[ $t ] = hads_shortcode( array( 'type' => $t ) );
}
$out['card-topic'] = hads_shortcode( array( 'type' => 'card', 'topic' => 'wp', 'allow_self' => 'true' ) );
$out['custom']     = hads_shortcode( array( 'attribution' => '<Sponsored>', 'class' => 'mine "x' ) );
$out['bogus']      = hads_shortcode( array( 'type' => '"><script>' ) );
$out['block']      = hads_render_block( array( 'type' => 'row', 'topic' => 'b' ) );
$out['sanitized']  = hads_sanitize_settings( array( 'site_key' => 'ab<c>d"', 'base_url' => 'javascript:alert(1)', 'auto_insert' => 'evil', 'auto_type' => 'nope' ) );
$GLOBALS['hads_test_options']['hads_settings'] = array( 'site_key' => 'K 1', 'base_url' => 'https://self.example/' );
$out['script_url'] = hads_script_url( hads_get_settings() );
echo json_encode( $out );
