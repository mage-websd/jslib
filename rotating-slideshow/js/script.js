(function($){
    $.fn.rotatingSlider = function(object) {
    	if(object == undefined) {
    		object = {};
    	}
    	var slideShow = $(this),
		ul = slideShow.find('ul'),
		li = ul.find('li'),
		cnt = li.length;
		if(object.width == undefined) {
			object.width = 1366;
		}
		if(object.height == undefined) {
			object.height = 318;
		}
		if(object.marginTop == undefined) {
			object.marginTop = 10;
		}
		if(object.marginLeft == undefined) {
			object.marginLeft = 10;
		}
		if(object.prev == undefined) {
			object.prev = '.rotating-prev';
		}
		if(object.next == undefined) {
			object.next = '.rotating-next';
		}
		if(object.rotate == undefined) {
			object.rotate = 90;
		}
		// As the images are positioned absolutely, the last image will be shown on top.
		// This is why we force them in the correct order by assigning z-indexes:
		// This function updates the z-index properties.
		function updateZindex(){
			// The CSS method can take a function as its second argument.
			// i is the zero-based index of the element.
			ul.find('li').css('z-index',function(i){
				return cnt-i;
			});
		}
		updateZindex();
		if($.support.transform){		
			// Modern browsers with support for css3 transformations		
			li.find('img').css('rotate',function(i){
				// Rotating the images counterclockwise
				return (-object.rotate*i) + 'deg';
			});		
			// Binding a custom event. the direction and degrees parameters
			// are passed when the event is triggered later on in the code.		
			slideShow.bind('rotateContainer',function(e,direction,degrees){				
				// Enlarging the slideshow and photo:				
				slideShow.animate({
					width		: object.width,
					height		: object.height,
					marginTop	: 0,
					marginLeft	: 0
				},'fast',function(){
					if(direction == 'next'){
						// Moving the topmost image containing Li at
						// the bottom after a fadeOut animation
						ul.find('li').first().fadeOut('slow',function(){
							$(this).remove().appendTo(ul);
							updateZindex();
							ul.find('li').first().fadeIn('slow');
						});
					}
					else {
						// Showing the bottomost Li element on top 
						// with a fade in animation. Notice that we are
						// updating the z-indexes.
						ul.find('li').last().fadeOut('slow',function(){
							$(this).remove().prependTo(ul);
							updateZindex();
							ul.find('li').first().fadeIn('slow');
						});

						/*var liLast = li.last().hide().remove().prependTo(ul);
						updateZindex();
						liLast.fadeIn('slow');*/
					}
					
					// Rotating the slideShow. css('rotate') gives us the
					// current rotation in radians. We are converting it to
					// degress so we can add 90 or -90 to rotate it to its new value.
					
					slideShow.animate({				
						rotate:Math.round($.rotate.radToDeg(slideShow.css('rotate'))+degrees) + 'deg'
					},'slow').animate({
						width		: object.width,
						height		: object.height,
						marginTop	: object.marginTop,
						marginLeft	: object.marginLeft
					},'fast');
				});
			});
			// By triggering the custom events below, we can 
			// show the previous / next images in the slideshow.
			slideShow.bind('showNext',function(){
				slideShow.trigger('rotateContainer',['next',object.rotate]);
			});
			slideShow.bind('showPrevious',function(){
				slideShow.trigger('rotateContainer',['previous',-object.rotate]);
			});
		}
		else{ //ie
			// Fallback for Internet Explorer and older browsers
			slideShow.bind('showNext',function(){
				ul.find('li').first().fadeOut('slow',function(){
					$(this).remove().appendTo(ul).show();
					updateZindex();
				});
			});
			slideShow.bind('showPrevious',function(){
				var liLast = ul.find('li').last().hide().remove().prependTo(ul);
				updateZindex();
				liLast.fadeIn('slow');
			});
		}
		// Listening for clicks on the arrows, and
		// triggering the appropriate event.
		$(document).on('click',object.prev,function(){
			if(slideShow.is(':animated')){
				return false;
			}
			slideShow.trigger('showPrevious');
			return false;
		});
		
		$(document).on('click',object.next,function(){
			if(slideShow.is(':animated')){
				return false;
			}
			slideShow.trigger('showNext');
			return false;
		});
    };
})(jQuery);
