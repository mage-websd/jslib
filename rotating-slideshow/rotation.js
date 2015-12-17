(function($) {
var div = document.createElement('div'),
  divStyle = div.style,
  support = $.support;

support.transform =
  divStyle.MozTransform === ''? 'MozTransform' :
  (divStyle.MsTransform === ''? 'MsTransform' :
  (divStyle.WebkitTransform === ''? 'WebkitTransform' :
  (divStyle.OTransform === ''? 'OTransform' :
  false)));
support.matrixFilter = !support.transform && divStyle.filter === '';
div = null;

$.cssNumber.rotate = true;
$.cssHooks.rotate = {
  set: function( elem, value ) {
    var _support = support,
      supportTransform = _support.transform,
      cos, sin,
      centerOrigin;

    if (typeof value === 'string') {
      value = toRadian(value);
    }

    $.data( elem, 'transform', {
      rotate: value
    });

    if (supportTransform) {
      elem.style[supportTransform] = 'rotate('+ value +'rad)';

    } else if (_support.matrixFilter) {
      cos = Math.cos(value);
      sin = Math.sin(value);
      elem.style.filter = [
        "progid:DXImageTransform.Microsoft.Matrix(",
          "M11="+cos+",",
          "M12="+(-sin)+",",
          "M21="+sin+",",
          "M22="+cos+",",
          "SizingMethod='auto expand'",
        ")"
      ].join('');

      // From pbakaus's Transformie http://github.com/pbakaus/transformie
      if(centerOrigin = $.rotate.centerOrigin) {
        elem.style[centerOrigin == 'margin' ? 'marginLeft' : 'left'] = -(elem.offsetWidth/2) + (elem.clientWidth/2) + "px";
        elem.style[centerOrigin == 'margin' ? 'marginTop' : 'top'] = -(elem.offsetHeight/2) + (elem.clientHeight/2) + "px";
      }
    }
  },
  get: function( elem, computed ) {
    var transform = $.data( elem, 'transform' );
    return transform && transform.rotate? transform.rotate : 0;
  }
};
$.fx.step.rotate = function( fx ) {
  $.cssHooks.rotate.set( fx.elem, fx.now+fx.unit );
};

function radToDeg( rad ) {
  return rad * 180 / Math.PI;
}
function toRadian(value) {
  if(value.indexOf("deg") != -1) {
    return parseInt(value,10) * (Math.PI * 2 / 360);
  } else if (value.indexOf("grad") != -1) {
    return parseInt(value,10) * (Math.PI/200);
  }
  return parseFloat(value);
}
$.rotate = {
  centerOrigin: 'margin',
  radToDeg: radToDeg
};
})(jQuery);


(function($){
    $.fn.rotationSlider = function(object) {
      if(object == undefined) {
        object = {};
      }
      var slideShow = $(this),
      slideItems = slideShow.children(),
      sliderTotal = slideItems.length;
      if(object.width == undefined) {
        object.width = 1000;
      }
      if(object.height == undefined) {
        object.height = 300;
      }
      if(object.rotate == undefined) {
        object.rotate = 90;
      }
      if(object.controller == undefined) {
        object.controller = true;
      }
      if(object.controller) {
        if(object.prev == undefined) {
          object.prev = '.rotation-prev';
        }
        if(object.next == undefined) {
          object.next = '.rotation-next';
        }
      }
      if(object.pager == undefined) {
        object.pager = true;
      }
      if(object.auto == undefined) {
        object.auto = 0;
      }
      if(object.resize == undefined) {
        object.resize = false;
      }
      if(object.pager) {
        if(object.pagerDom == undefined) {
          object.pagerDom = '.rotation-slider-pager';
        }
        flagDomPager = 'rotation-pager';
      }
      if(object.resize) {
        if($(object.resize).length) {
            var proportion = object.width / object.height;
            $(window).resize(function(event) {
                widthResize = $(object.resize).outerWidth();
                heightResize = widthResize / proportion;
                slideShow.width(widthResize);
                slideShow.height(heightResize);
            });

            widthResize = $(object.resize).outerWidth();
            heightResize = widthResize / proportion;
            slideShow.width(widthResize);
            slideShow.height(heightResize);
        }
      }

      slideItemActive = slideShow.children('.active');
      if(slideItemActive.length != 1) {
        slideItemActive = slideItems.first();
      }
      slideItemActive.addClass('active');
      slideItemActive.siblings().removeClass('active').hide();
      slideItemActive.show();


    if($.support.transform){
      slideItems.css('rotate',function(i){
        return (-object.rotate*i) + 'deg';
      });

      slideShow.bind('rotateJump',function(e,to,controller){
        indexActive = slideItemActive.index();
        if(to==null) {
          if(controller=='next') {
            to = indexActive+1;
          }
          else {
            to = indexActive - 1;
          }
        }
        if(to != indexActive) {
          if(to>=sliderTotal) {
            to = 0
          }
          else if(to<0) {
            to = sliderTotal-1;
          }
          if(object.pager) {
            $(object.pagerDom+' .'+flagDomPager+' a').removeClass('active');
            $(object.pagerDom+'.'+flagDomPager+' a').eq(to).addClass('active');
          }
          widthResize = 0;
          heightResize = 0;
          if(object.resize) {
            if($(object.resize).length) {
                widthResize = $(object.resize).outerWidth();
                heightResize = widthResize / proportion;
            }
          }
          if(!widthResize) {
            widthResize = object.width;
            heightResize = object.height;
          }
          slideShow.animate({
            width   : widthResize,
            height    : heightResize
          },'fast',function(){
            slideItemActive.removeClass('active');
            slideItemActive.fadeOut('slow',function() {
              slideItemActiveNew = slideItems.eq(to);
              slideItemActiveNew.fadeIn('slow');
              slideItemActive = slideItemActiveNew;
              slideItemActive.addClass('active');
            });

            if(to>indexActive) {
              rotate = object.rotate;
            }
            else {
              rotate = -object.rotate;
            }
            slideShow.animate({
              rotate:Math.round($.rotate.radToDeg(slideShow.css('rotate'))+rotate) + 'deg'
            },'slow').animate({
              width   : widthResize,
              height    : heightResize
            },'fast');
          });
        }
      });
    }
    else{ //ie
      slideShow.bind('rotateJump',function(e,to,controller){
        indexActive = slideItemActive.index();
        if(to==null) {
          if(controller=='next') {
            to = indexActive+1;
          }
          else {
            to = indexActive - 1;
          }
        }
        if(to != indexActive) {
          if(to>=sliderTotal) {
            to = 0
          }
          else if(to<0) {
            to = sliderTotal-1;
          }
          if(object.pager) {
            $(object.pagerDom+'.'+flagDomPager+' a').removeClass('active');
            $(object.pagerDom+'.'+flagDomPager+' a').eq(to).addClass('active');
          }

          slideItemActive.removeClass('active');
          slideItemActive.fadeOut('slow',function() {
            slideItemActiveNew = slideItems.eq(to);
            slideItemActiveNew.fadeIn('slow');
            slideItemActive = slideItemActiveNew;
            slideItemActive.addClass('active');
          });

          if(to>indexActive) {
            rotate = object.rotate;
          }
          else {
            rotate = -object.rotate;
          }
        }
      });
    }
    if(object.pager) {
      pagerHtml = '';
      pagerHtml += '<ul class="'+flagDomPager+'">';
      indexActive = slideItemActive.index();
      for(i=0;i<sliderTotal;i++) {
        pagerHtml += '<li>';
        pagerHtml += '<a href="#"';
        if(i==indexActive) {
          pagerHtml += ' class="active"';
        }
        pagerHtml += '>';
        pagerHtml += '';
        pagerHtml += '</a>';
        pagerHtml += '</li>';
      }
      pagerHtml += '</ul>';
      $(object.pagerDom).html(pagerHtml);
    }
    $(document).on('click',object.prev,function(event){
      event.preventDefault();
      if(slideShow.is(':animated')){
        return false;
      }
      slideShow.trigger('rotateJump',[null,'prev']);
    });

    $(document).on('click',object.next,function(event){
      event.preventDefault();
      if(slideShow.is(':animated')){
        return false;
      }
      slideShow.trigger('rotateJump',[null,'next']);
    });
    if(object.pager) {
      $(document).on('click',object.pagerDom+'.'+flagDomPager+' a',function(event) {
        event.preventDefault();
        if(slideShow.is(':animated')){
          return false;
        }
        indexActive = $(this).parent().index();
        slideShow.trigger('rotateJump',indexActive);
      });
    }
    if(object.auto > 0) {
      setInterval(function(event){
        if(!slideShow.is(':animated')){
          slideShow.trigger('rotateJump',[null,'next']);
        }
      },object.auto);
    }
  };
})(jQuery);


//!function(e){function t(e){return 180*e/Math.PI}function i(e){return-1!=e.indexOf("deg")?parseInt(e,10)*(2*Math.PI/360):-1!=e.indexOf("grad")?parseInt(e,10)*(Math.PI/200):parseFloat(e)}var r=document.createElement("div"),a=r.style,o=e.support;o.transform=""===a.MozTransform?"MozTransform":""===a.MsTransform?"MsTransform":""===a.WebkitTransform?"WebkitTransform":""===a.OTransform?"OTransform":!1,o.matrixFilter=!o.transform&&""===a.filter,r=null,e.cssNumber.rotate=!0,e.cssHooks.rotate={set:function(t,r){var a,n,s,d=o,l=d.transform;"string"==typeof r&&(r=i(r)),e.data(t,"transform",{rotate:r}),l?t.style[l]="rotate("+r+"rad)":d.matrixFilter&&(a=Math.cos(r),n=Math.sin(r),t.style.filter=["progid:DXImageTransform.Microsoft.Matrix(","M11="+a+",","M12="+-n+",","M21="+n+",","M22="+a+",","SizingMethod='auto expand'",")"].join(""),(s=e.rotate.centerOrigin)&&(t.style["margin"==s?"marginLeft":"left"]=-(t.offsetWidth/2)+t.clientWidth/2+"px",t.style["margin"==s?"marginTop":"top"]=-(t.offsetHeight/2)+t.clientHeight/2+"px"))},get:function(t,i){var r=e.data(t,"transform");return r&&r.rotate?r.rotate:0}},e.fx.step.rotate=function(t){e.cssHooks.rotate.set(t.elem,t.now+t.unit)},e.rotate={centerOrigin:"margin",radToDeg:t}}(jQuery),function(e){e.fn.rotationSlider=function(t){void 0==t&&(t={});var r=e(this),a=r.children(),o=a.length;if(void 0==t.width&&(t.width=1e3),void 0==t.height&&(t.height=300),void 0==t.rotate&&(t.rotate=90),void 0==t.controller&&(t.controller=!0),t.controller&&(void 0==t.prev&&(t.prev=".rotation-prev"),void 0==t.next&&(t.next=".rotation-next")),void 0==t.pager&&(t.pager=!0),void 0==t.auto&&(t.auto=0),void 0==t.resize&&(t.resize=!1),t.pager&&(void 0==t.pagerDom&&(t.pagerDom=".rotation-slider-pager"),flagDomPager="rotation-pager"),t.resize&&e(t.resize).length){var n=t.width/t.height;e(window).resize(function(i){widthResize=e(t.resize).outerWidth(),heightResize=widthResize/n,r.width(widthResize),r.height(heightResize)}),widthResize=e(t.resize).outerWidth(),heightResize=widthResize/n,r.width(widthResize),r.height(heightResize)}if(slideItemActive=r.children(".active"),1!=slideItemActive.length&&(slideItemActive=a.first()),slideItemActive.addClass("active"),slideItemActive.siblings().removeClass("active").hide(),slideItemActive.show(),e.support.transform?(a.css("rotate",function(e){return-t.rotate*e+"deg"}),r.bind("rotateJump",function(i,s,d){indexActive=slideItemActive.index(),null==s&&(s="next"==d?indexActive+1:indexActive-1),s!=indexActive&&(s>=o?s=0:0>s&&(s=o-1),t.pager&&(e(t.pagerDom+" ."+flagDomPager+" a").removeClass("active"),e(t.pagerDom+" ."+flagDomPager+" a").eq(s).addClass("active")),widthResize=0,heightResize=0,t.resize&&e(t.resize).length&&(widthResize=e(t.resize).outerWidth(),heightResize=widthResize/n),widthResize||(widthResize=t.width,heightResize=t.height),r.animate({width:widthResize,height:heightResize},"fast",function(){slideItemActive.removeClass("active"),slideItemActive.fadeOut("slow",function(){slideItemActiveNew=a.eq(s),slideItemActiveNew.fadeIn("slow"),slideItemActive=slideItemActiveNew,slideItemActive.addClass("active")}),s>indexActive?rotate=t.rotate:rotate=-t.rotate,r.animate({rotate:Math.round(e.rotate.radToDeg(r.css("rotate"))+rotate)+"deg"},"slow").animate({width:widthResize,height:heightResize},"fast")}))})):r.bind("rotateJump",function(i,r,n){indexActive=slideItemActive.index(),null==r&&(r="next"==n?indexActive+1:indexActive-1),r!=indexActive&&(r>=o?r=0:0>r&&(r=o-1),t.pager&&(e(t.pagerDom+" ."+flagDomPager+" a").removeClass("active"),e(t.pagerDom+" ."+flagDomPager+" a").eq(r).addClass("active")),slideItemActive.removeClass("active"),slideItemActive.fadeOut("slow",function(){slideItemActiveNew=a.eq(r),slideItemActiveNew.fadeIn("slow"),slideItemActive=slideItemActiveNew,slideItemActive.addClass("active")}),r>indexActive?rotate=t.rotate:rotate=-t.rotate)}),t.pager){for(pagerHtml="",pagerHtml+='<ul class="'+flagDomPager+'">',indexActive=slideItemActive.index(),i=0;i<o;i++)pagerHtml+="<li>",pagerHtml+='<a href="#"',i==indexActive&&(pagerHtml+=' class="active"'),pagerHtml+=">",pagerHtml+="",pagerHtml+="</a>",pagerHtml+="</li>";pagerHtml+="</ul>",e(t.pagerDom).html(pagerHtml)}e(document).on("click",t.prev,function(e){return e.preventDefault(),r.is(":animated")?!1:void r.trigger("rotateJump",[null,"prev"])}),e(document).on("click",t.next,function(e){return e.preventDefault(),r.is(":animated")?!1:void r.trigger("rotateJump",[null,"next"])}),t.pager&&e(document).on("click",t.pagerDom+" ."+flagDomPager+" a",function(t){return t.preventDefault(),r.is(":animated")?!1:(indexActive=e(this).parent().index(),void r.trigger("rotateJump",indexActive))}),t.auto>0&&setInterval(function(e){r.is(":animated")||r.trigger("rotateJump",[null,"next"])},t.auto)}}(jQuery);
