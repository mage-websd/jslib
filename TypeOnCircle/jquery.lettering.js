/*global jQuery */
/*!	
* Lettering.JS 0.6.1
*
* Copyright 2010, Dave Rupert http://daverupert.com
* Released under the WTFPL license 
* http://sam.zoy.org/wtfpl/
*
* Thanks to Paul Irish - http://paulirish.com - for the feedback.
*
* Date: Mon Sep 20 17:14:00 2010 -0600
*/
(function($){
	function injector(t, splitter, klass, after,options) {
		var a = t.text().split(splitter), inject = '';
		if (a.length) {
			 var defaults = {
                deg: 6
            };
            var options = $.extend(defaults, options);
			$(a).each(function(i, item) {
				style=''+
				'-webkit-transform: rotate('+((i+1)*options.deg)+'deg);'+
				  '-moz-transform: rotate('+((i+1)*options.deg)+'deg);'+
				  '-ms-transform: rotate('+((i+1)*options.deg)+'deg);'+
				  '-o-transform: rotate('+((i+1)*options.deg)+'deg);'+
				  'transform: rotate('+((i+1)*options.deg)+'deg);';

				inject += '<span class="'+klass+(i+1)+'" style="'+style+'">'+item+'</span>'+after;
			});	
			t.empty().append(inject);
		}
	}
	
	var methods = {
		init : function(options) {
			return this.each(function() {
				injector($(this), '', 'char', '',options);
			});
		},
		words : function() {
			return this.each(function() {
				injector($(this), ' ', 'word', ' ');
			});
		},		
		lines : function() {
			return this.each(function() {
				var r = "eefec303079ad17405c889e092e105b0";
				// Because it's hard to split a <br/> tag consistently across browsers,
				// (*ahem* IE *ahem*), we replaces all <br/> instances with an md5 hash 
				// (of the word "split").  If you're trying to use this plugin on that 
				// md5 hash string, it will fail because you're being ridiculous.
				injector($(this).children("br").replaceWith(r).end(), r, 'line', '');
			});
		}
	};

	$.fn.lettering = function( methodOrOptions ) {
		if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.tooltip' );
        }
	};

})(jQuery);