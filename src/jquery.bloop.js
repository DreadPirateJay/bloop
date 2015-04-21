// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

	"use strict";

	// Create the defaults once
	var pluginName = "bloop",
		defaults = {
			action: 'init',
			css: {},
			delay: 200,
			duration: 800,
			theme: 'default'
		};

	// The actual plugin constructor
	function Bloop ( element, options ) {

		this.element = element;
		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;

		switch(this.settings.action) {
		    case 'init':
		        this.init();
		        break;

		    case 'bloopIn':
		        this.bloop(true);
		        break;

		    case 'bloopOut':
		        this.bloop(false);
		        break;

		    default:
		        console.log('ERROR: Invalid action!');
		}

		return this;
	}

	// Avoid Bloop.prototype conflicts
	$.extend(Bloop.prototype, {
		init: function () {

			var $bloop = $(this.element);

			$bloop
			.append('<span class="triangle"></span>')
			.css({
				display: 'inline-block',
				opacity: 0,
				transform: 'translateY(100%) scale(0, 0)'
			})
			.find('.triangle')
			.css({
				borderColor: this.settings.backgroundColor + ' transparent'
			});

			jQuery.easing.def = 'easeOutElastic';

			return this;
		},

		bloop: function(bloopIn) {
			var bloopIn = bloopIn || false,
		    	$bloop = $(this.element);

		    $bloop
		        .delay(this.settings.delay)
		        .css(this.settings.css)
		        .animate({
		            opacity: (bloopIn ? 1 : 0)
		        }, {
		            duration: this.settings.duration,
		            step: function(now) {
		                $bloop.css({ 'transform': 'translateY('+ ( 100 * (1 - now) ) +'%) scale('+now+','+now+')' });
		            },
		            complete: this.settings.complete
		        })
		        .find('.triangle')
		        .css({ borderColor: this.settings.css.backgroundColor + ' transparent' });

		    return this;
		}

	});

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[ pluginName ] = function ( options ) {

		// shortcut arguments
		if (typeof options === 'undefined')
		{
			var options = { action: 'init' };
		}
		else if (typeof options === 'string')
		{
            var options = { action: options };
        }
        else if (typeof options === 'boolean')
        {
            if (options)
            {
                var options = { action: 'bloopIn' };
            }
            else
            {
                var options = { action: 'bloopOut' };
            }
        }

		return this.each(function(idx) {
			if ( !$.data( this, "plugin_" + pluginName + "_" + idx ) ) {
				$.data( this, "plugin_" + pluginName + "_" + idx, new Bloop( this, options ) );
			} else {
				$.data( this, "plugin_" + pluginName + "_" + idx ).bloop( options );
			}
		});
	};

})( jQuery, window, document );
