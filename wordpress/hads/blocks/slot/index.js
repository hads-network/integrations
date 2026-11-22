/* HADS slot block editor UI. Plain JS (no build step). Server-rendered. */
( function ( wp ) {
	var el = wp.element.createElement;
	var __ = wp.i18n.__;
	var be = wp.blockEditor;
	var c = wp.components;
	var TYPES = [ 'inline', 'card', 'row', 'teaser', 'rail' ];

	wp.blocks.registerBlockType( 'hads/slot', {
		edit: function ( props ) {
			var a = props.attributes;
			var set = props.setAttributes;
			return el(
				'div',
				be.useBlockProps( { className: 'hads-slot-placeholder' } ),
				el(
					be.InspectorControls,
					null,
					el(
						c.PanelBody,
						{ title: __( 'Slot', 'hads' ) },
						el( c.SelectControl, {
							label: __( 'Type', 'hads' ),
							value: a.type,
							options: TYPES.map( function ( t ) {
								return { label: t, value: t };
							} ),
							onChange: function ( v ) {
								set( { type: v } );
							},
						} ),
						el( c.TextControl, {
							label: __( 'Topic (optional)', 'hads' ),
							value: a.topic,
							onChange: function ( v ) {
								set( { topic: v } );
							},
						} ),
						el( c.ToggleControl, {
							label: __( 'Allow ads from my other sites', 'hads' ),
							checked: !! a.allowSelf,
							onChange: function ( v ) {
								set( { allowSelf: v } );
							},
						} )
					)
				),
				el(
					c.Placeholder,
					{ icon: 'megaphone', label: __( 'HADS slot', 'hads' ) },
					__( 'Type:', 'hads' ) + ' ' + a.type + ( a.topic ? ' · ' + a.topic : '' )
				)
			);
		},
		save: function () {
			return null;
		},
	} );
} )( window.wp );
