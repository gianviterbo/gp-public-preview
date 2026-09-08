/* GP Public Preview — block editor lifetime panel (fork add-on).
 * Renders next to the stock "public preview" toggle with:
 *   - per-post link lifetime (hours),
 *   - Save & regenerate (stamps fresh start → old links die instantly),
 *   - copy-ready preview link + expiry hint.
 * Handles are global in the editor (wp-plugins/wp-edit-post/...). No build step.
 */
( function ( wp ) {
	'use strict';

	if ( ! window.wp || ! wp.editPost || ! wp.plugins || ! wp.element || ! wp.components ) {
		return;
	}

	var el = wp.element.createElement;
	var useState = wp.element.useState;
	var __ = wp.i18n ? wp.i18n.__ : function ( t ) { return t; };
	var PanelBody = wp.components.PanelBody;
	var TextControl = wp.components.TextControl;
	var Button = wp.components.Button;
	var data = window.GP_PPP || {};

	function GPPppPanel() {
		var defaultHours = data.hours || 24;
		var [ hours, setHours ] = useState( String( defaultHours ) );
		var [ link, setLink ] = useState( data.previewUrl || '' );
		var [ enabled ] = useState( !! data.enabled );
		var [ busy, setBusy ] = useState( false );
		var [ msg, setMsg ] = useState( '' );
		var [ err, setErr ] = useState( '' );

		function request( regenerate ) {
			setBusy( true );
			setMsg( '' );
			setErr( '' );
			var body = new URLSearchParams();
			body.set( 'action', 'gp_ppp_save' );
			body.set( 'post_ID', data.postId );
			body.set( '_ajax_nonce', data.nonce );
			body.set( 'hours', hours || '' );
			if ( regenerate ) {
				body.set( 'regenerate', '1' );
			}
			fetch( data.ajaxUrl, { method: 'POST', credentials: 'same-origin', body: body } )
				.then( function ( r ) { return r.json(); } )
				.then( function ( res ) {
					setBusy( false );
					if ( res && res.success && res.data ) {
						setLink( res.data.previewUrl || '' );
						setMsg( regenerate
							? __( 'Link regenerated. Old shared copies are now expired — copy the new link below.', 'public-post-preview' )
							: __( 'Lifetime saved. It applies to the link you share from now on.', 'public-post-preview' ) );
					} else {
						var m = ( res && res.data && res.data.message ) ? res.data.message : __( 'Save failed.', 'public-post-preview' );
						setErr( String( m ) );
					}
				} )
				.catch( function () {
					setBusy( false );
					setErr( __( 'Request failed — please retry.', 'public-post-preview' ) );
				} );
		}

		var h = parseInt( hours, 10 );
		var expiryNote = '';
		if ( link && h >= 1 && h <= 168 ) {
			var d = new Date( Date.now() + h * 3600 * 1000 );
			expiryNote = __( 'New links expire around', 'public-post-preview' ) + ' ' + d.toLocaleString();
		}

		return el(
			PanelBody,
			{ title: __( 'Preview link', 'public-post-preview' ), initialOpen: false },
			el(
				'p',
				null,
				enabled
					? __( 'Public preview is ON for this draft.', 'public-post-preview' )
					: __( 'Enable "Public preview" (above) to create a shareable link.', 'public-post-preview' )
			),
			el( TextControl, {
				type: 'number',
				min: 1,
				max: 168,
				label: __( 'Link lifetime (hours)', 'public-post-preview' ),
				value: hours,
				onChange: setHours,
				help: __( '1-168. The default comes from Settings → Reading.', 'public-post-preview' )
			} ),
			el(
				Button,
				{ variant: 'primary', isBusy: busy, onClick: function () { request( false ); } },
				__( 'Save lifetime', 'public-post-preview' )
			),
			' ',
			el(
				Button,
				{ variant: 'secondary', isBusy: busy, onClick: function () { request( true ); } },
				__( 'Save & regenerate link', 'public-post-preview' )
			),
			link
				? el( TextControl, {
					label: __( 'Share this link', 'public-post-preview' ),
					value: link,
					readOnly: true,
					onFocus: function ( e ) { e.target.select(); }
				} )
				: null,
			msg ? el( 'p', { style: { color: '#007017', margin: '6px 0 0' } }, msg ) : null,
			err ? el( 'p', { style: { color: '#cc1818', margin: '6px 0 0' } }, err ) : null,
			expiryNote ? el( 'p', { className: 'components-base-control__help', style: { margin: '6px 0 0' } }, expiryNote ) : null
		);
	}

	wp.plugins.registerPlugin( 'gp-public-preview', {
		icon: 'visibility',
		render: function () {
			return el(
				wp.editPost.PluginDocumentSettingPanel,
				{ name: 'gp-public-preview', title: __( 'Public preview', 'public-post-preview' ), className: 'gp-public-preview-panel' },
				el( GPPppPanel, {} )
			);
		}
	} );
} )( window.wp );
