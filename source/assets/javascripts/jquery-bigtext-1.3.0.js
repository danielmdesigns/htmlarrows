/*
jQuery BigText v1.3.0, May 2014

Copyright (C) 2013 Daniel Hoffmann Bernardes, Ícaro Technologies

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


(function($){
    "use strict";
    var defaultOptions= {
        rotateText: null,
        fontSizeFactor: 0.8,
        maximumFontSize: null,
        limitingDimension: "both",
        horizontalAlign: "center",
        verticalAlign: "center",
        textAlign: "center",
        whiteSpace: "nowrap"
    };

    $.fn.bigText= function(options) {
        return this.each(function() {
            options= $.extend({}, defaultOptions, options);
            var $this= $(this);
            var $parent= $this.parent();

            //hides the element to prevent "flashing"
            $this.css("visibility", "hidden");

            $this.css({
                display: "inline-block",
                clear: "both",
                'float': "left", //the need to set this is very odd, its due to margin-collapsing. See https://developer.mozilla.org/en-US/docs/Web/CSS/margin_collapsing
                'font-size': (1000 * options.fontSizeFactor) + "px",
                'line-height': "1",
                'white-space': options.whiteSpace,
                "text-align": options.textAlign,
                position: "relative",
                padding: 0,
                margin: 0,
                left: "50%",
                top: "50%"
            });

            var parentPadding= {
                left: parseInt($parent.css('padding-left')),
                top: parseInt($parent.css('padding-top')),
                right: parseInt($parent.css('padding-right')),
                bottom: parseInt($parent.css('padding-bottom'))
            };
            console.log(parentPadding.left, parentPadding.top, parentPadding.right, parentPadding.bottom)

            var box= {
                width: $this.outerWidth(),
                height: $this.outerHeight()
            };
            console.log(box.width, box.height)

            var boxy= {
                width: $(this).innerWidth(),
                height: $(this).outerWidth()
            };
            console.log(boxy.width, boxy.height)

            var rotateCSS= {}
            if (options.rotateText !== null) {
                if (typeof options.rotateText !== "number")
                    throw "bigText error: rotateText value must be a number";
                var rotate= "rotate(" + options.rotateText + "deg)";
                rotateCSS= {
                    "-webkit-transform": rotate,
                    "-ms-transform": rotate,
                    "-moz-transform": rotate,
                    "-o-transform": rotate,
                    "transform": rotate
                };
                $this.css(rotateCSS);
                //calculating bounding box of the rotated element
                var sin= Math.abs(Math.sin(options.rotateText * Math.PI / 180));
                var cos= Math.abs(Math.cos(options.rotateText * Math.PI / 180));
                box.width= $this.outerWidth() * cos + $this.outerHeight() * sin;
                box.height= $this.outerWidth() * sin + $this.outerHeight() * cos;
            }

            var trueWidth = $parent.innerWidth() - parentPadding.left - parentPadding.right;
            var trueHeight = $parent.innerHeight() - parentPadding.top - parentPadding.bottom;
            console.log(trueWidth, trueHeight)

            var widthFactor= ($parent.innerWidth() - parentPadding.left - parentPadding.right) / box.width;
            var heightFactor= ($parent.innerHeight() - parentPadding.top - parentPadding.bottom) / box.height;
            console.log(widthFactor, heightFactor)
            var lineHeight;
            console.log(lineHeight);

            if (options.limitingDimension.toLowerCase() === "width") {
                lineHeight= Math.floor(widthFactor * 1000);
                $parent.height(lineHeight);
            } else if (options.limitingDimension.toLowerCase() === "height") {
                lineHeight= Math.floor(heightFactor * 1000);
            } else if (widthFactor < heightFactor)
                lineHeight= Math.floor(widthFactor * 1000);
            else if (widthFactor >= heightFactor)
                lineHeight= Math.floor(heightFactor * 1000);

            var fontSize= lineHeight * options.fontSizeFactor;
            if (options.maximumFontSize !== null && fontSize > options.maximumFontSize) {
                fontSize= options.maximumFontSize;
                lineHeight= fontSize / options.fontSizeFactor;
            }


            $this.css({
                'font-size': Math.floor(fontSize)  + "px",
                'line-height': Math.ceil(lineHeight)  + "px",
                'margin-bottom': "0px",
                'margin-right': "0px"
            });

            if (options.limitingDimension.toLowerCase() === "height") {
                //this option needs the font-size to be set already so $this.width() returns the right size
                //this +4 is to compensate the rounding erros that can occur due to the calls to Math.floor in the centering code
                $parent.width(($this.width() + 4) + "px");
            }
            var endCSS= {};

            switch(options.verticalAlign.toLowerCase()) {
                case "top":
                    endCSS['top']= "0%";
                break;
                case "bottom":
                    endCSS['top']= "100%";
                    endCSS['margin-top']= Math.floor(-$this.innerHeight()) + "px";
                break;
                default:
                    endCSS['margin-top']= Math.floor((-$this.innerHeight() / 2)) + "px";
                break;
            }

            switch(options.horizontalAlign.toLowerCase()) {
                case "left":
                    endCSS['left']= "0%";
                break;
                case "right":
                    endCSS['left']= "100%";
                    endCSS['margin-left']= Math.floor(-$this.innerWidth()) + "px";
                break;
                default:
                    endCSS['margin-left']= Math.floor((-$this.innerWidth() / 2)) + "px";
                break;
            }


            $this.css(endCSS);
            //shows the element after the work is done
            $this.css("visibility", "visible");
        });
    }
})(jQuery);
