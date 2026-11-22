<?php
/**
 * Remove plugin settings on uninstall.
 *
 * @package Hads
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

delete_option( 'hads_settings' );
