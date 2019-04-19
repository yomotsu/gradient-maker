/*!
 * gradient-maker
 * https://github.com/yomotsu/gradient-maker
 * (c) 2019 @yomotsu
 * Released under the MIT License.
 */
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
        var gradientLineCoords = getGradientLineCoords(this.angle, width, height);
        var grad = context2d.createLinearGradient.apply(context2d, gradientLineCoords);
        this.colorStops.forEach(function (colorStop) { return grad.addColorStop(colorStop.offset, colorStop.color); });
        return grad;
    };
    GradientMaker.prototype.css = function () {
        var cssGrad = this.colorStops.map(function (colorStop) { return colorStop.color + " " + colorStop.offset * 100 + "%"; });
        return "linear-gradient(" + this.angle + "rad, " + cssGrad.join() + " )";
    };
    GradientMaker.DEG2RAD = Math.PI / 180;
    GradientMaker.RAD2DEG = 180 / Math.PI;
    return GradientMaker;
}());
function getGradientLineCoords(angle, width, height) {
    var canvasGradentAngle = modulo((-angle + Math.PI * 0.5), Math.PI * 2);
    if (angle === Math.PI * 0.0)
        return [0, height, 0, 0];
    if (angle === Math.PI * 0.5)
        return [0, 0, width, 0];
    if (angle === Math.PI * 1.0)
        return [0, 0, 0, height];
    if (angle === Math.PI * 1.5)
        return [width, 0, 0, 0];
    var cx = width * 0.5;
    var cy = height * 0.5;
    var slope = Math.tan(canvasGradentAngle);
    var pslope = -1 / slope;
    var corner = canvasGradentAngle < Math.PI * 0.5 ? [cx, cy] :
        canvasGradentAngle < Math.PI * 1.0 ? [-cx, cy] :
            canvasGradentAngle < Math.PI * 1.5 ? [-cx, -cy] :
                [cx, -cy];
    var intercept = corner[1] - pslope * corner[0];
    var endx = intercept / (slope - pslope);
    var endy = pslope * endx + intercept;
    var x0 = cx - endx;
    var y0 = cy + endy;
    var x1 = cx + endx;
    var y1 = cy - endy;
    return [x0, y0, x1, y1];
}
function modulo(n, d) {
    if (d === 0)
        return n;
    if (d < 0)
        return NaN;
    return (n % d + d) % d;
}

export default GradientMaker;
