/*!
 * gradient-maker
 * https://github.com/yomotsu/gradient-maker
 * (c) 2019 @yomotsu
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.GradientMaker = factory());
}(this, function () { 'use strict';

	var PI_HALF = Math.PI * 0.5;
	var GradientMaker = (function () {
	    function GradientMaker(cssAngle, colorStops) {
	        if (cssAngle === void 0) { cssAngle = 0; }
	        if (colorStops === void 0) { colorStops = []; }
	        this.angle = GradientMaker.normalizeCSSAngle(cssAngle);
	        this.colorStops = colorStops;
	    }
	    GradientMaker.normalizeCSSAngle = function (cssAngle) {
	        if (typeof cssAngle === 'number')
	            return cssAngle;
	        if (/[0-9]+deg/.test(cssAngle))
	            return +cssAngle.replace(/deg/, '') * GradientMaker.DEG2RAD;
	        if (/[0-9]+rad/.test(cssAngle))
	            return +cssAngle.replace(/rad/, '');
	        if (/[0-9]+turn/.test(cssAngle))
	            return +cssAngle.replace(/turn/, '') * Math.PI * 2;
	        if (/to/.test(cssAngle)) {
	            var top_1 = /top/.test(cssAngle);
	            var right = /right/.test(cssAngle);
	            var bottom = /bottom/.test(cssAngle);
	            var left = /left/.test(cssAngle);
	            if (top_1)
	                return Math.PI * 0.0;
	            if (top_1 && right)
	                return Math.PI * 0.25;
	            if (right)
	                return Math.PI * 0.5;
	            if (bottom && right)
	                return Math.PI * 0.75;
	            if (bottom)
	                return Math.PI * 1.0;
	            if (bottom && left)
	                return Math.PI * 1.25;
	            if (left)
	                return Math.PI * 1.5;
	            if (top_1 && left)
	                return Math.PI * 1.75;
	        }
	        return 0;
	    };
	    GradientMaker.prototype.canvas = function (width, height) {
	        if (width === void 0) { width = 128; }
	        if (height === void 0) { height = 128; }
	        var canvas = document.createElement('canvas');
	        var context2d = canvas.getContext('2d');
	        canvas.width = width;
	        canvas.height = height;
	        if (!(context2d instanceof CanvasRenderingContext2D))
	            return canvas;
	        var grad = this.context2dFillStyle(width, height, context2d);
	        context2d.fillStyle = grad;
	        context2d.fillRect(0, 0, width, height);
	        return canvas;
	    };
	    GradientMaker.prototype.context2dFillStyle = function (width, height, context2d) {
	        if (width === void 0) { width = 128; }
	        if (height === void 0) { height = 128; }
	        var cx = width * 0.5;
	        var cy = height * 0.5;
	        var hypt = cy / Math.cos(this.angle);
	        var area0 = Math.PI * 0.0 <= this.angle && this.angle < Math.PI * 0.5;
	        var area2 = Math.PI * 1.0 <= this.angle && this.angle < Math.PI * 1.5;
	        var area3 = Math.PI * 1.5 <= this.angle && this.angle < Math.PI * 2.0;
	        var isVertical = area0 || area2;
	        var isFromBottom = area2 || area3;
	        var triangleBottom = isVertical ?
	            cx - Math.sqrt(hypt * hypt - cy * cy) :
	            cx + Math.sqrt(hypt * hypt - cy * cy);
	        var diag = Math.sin(this.angle) * triangleBottom;
	        var len = hypt + diag;
	        var topX = cx + Math.cos(PI_HALF + this.angle) * len;
	        var topY = cy + Math.sin(PI_HALF + this.angle) * len;
	        var bottomX = cx + Math.cos(-PI_HALF + this.angle) * len;
	        var bottomY = cy + Math.sin(-PI_HALF + this.angle) * len;
	        var grad = isFromBottom ?
	            context2d.createLinearGradient(bottomX, bottomY, topX, topY) :
	            context2d.createLinearGradient(topX, topY, bottomX, bottomY);
	        this.colorStops.forEach(function (colorStop) { return grad.addColorStop(colorStop.offset, colorStop.color); });
	        return grad;
	    };
	    GradientMaker.prototype.css = function () {
	        var cssGrad = this.colorStops.map(function (colorStop) { return colorStop.color + " " + colorStop.offset * 100 + "%"; });
	        return "linear-gradient(" + this.angle + "rad, " + cssGrad.join() + " )";
	    };
	    GradientMaker.DEG2RAD = Math.PI / 180;
	    return GradientMaker;
	}());

	return GradientMaker;

}));