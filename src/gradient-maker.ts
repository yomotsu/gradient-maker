interface ColorStop {
	offset: number;
	color: string;
};

type GradientLineCoords = [ number, number, number, number ];

export default class GradientMaker {

	static DEG2RAD = Math.PI / 180;
	static RAD2DEG = 180 / Math.PI;

	static normalizeCSSAngle( cssAngle: number | string ): number {

		if ( typeof cssAngle === 'number' ) return cssAngle;
		if ( /[0-9]+deg/.test( cssAngle ) ) return + cssAngle.replace( /deg/,  '' ) * GradientMaker.DEG2RAD;
		if ( /[0-9]+rad/.test( cssAngle ) ) return + cssAngle.replace( /rad/,  '' );
		if ( /[0-9]+turn/.test( cssAngle ) ) return + cssAngle.replace( /turn/,  '' ) * Math.PI * 2;
		if ( /to/.test( cssAngle ) ) {

			// <side-or-corner>
			const top    = /top/.test( cssAngle );
			const right  = /right/.test( cssAngle );
			const bottom = /bottom/.test( cssAngle );
			const left   = /left/.test( cssAngle );

			if ( top             ) return Math.PI * 0.0;
			if ( top    && right ) return Math.PI * 0.25;
			if ( right           ) return Math.PI * 0.5;
			if ( bottom && right ) return Math.PI * 0.75;
			if ( bottom          ) return Math.PI * 1.0;
			if ( bottom && left  ) return Math.PI * 1.25;
			if ( left            ) return Math.PI * 1.5;
			if ( top    && left  ) return Math.PI * 1.75;

		}

		return 0;

	}

	// static parseCSSLinearGradient(): ColorStop[] {

	// 	// https://github.com/rafaelcaricio/gradient-parser/blob/master/lib/parser.js

	// }

	public angle: number; // angle is in radian. starting from North and clckwise, the same as CSS rotation.
	public colorStops: ColorStop[];

	constructor( cssAngle: number | string = 0, colorStops: ColorStop[] = [] ) {

		this.angle = GradientMaker.normalizeCSSAngle( cssAngle );
		this.colorStops = colorStops;

	}

	canvas( width: number = 128, height: number = 128 ): HTMLCanvasElement {

		const canvas = document.createElement( 'canvas' );
		const context2d = canvas.getContext( '2d' );
		
		canvas.width = width;
		canvas.height = height;

		if ( ! ( context2d instanceof CanvasRenderingContext2D ) ) return canvas;

		const grad = this.context2dFillStyle( width, height, context2d );
		context2d.fillStyle = grad;
		context2d.fillRect( 0, 0, width, height );

		return canvas;

	}

	context2dFillStyle(
		width: number = 128,
		height: number = 128,
		context2d: CanvasRenderingContext2D,
	) {

		const gradientLineCoords = getGradientLineCoords( this.angle, width, height );
		const grad = context2d.createLinearGradient( ...gradientLineCoords )
		this.colorStops.forEach( ( colorStop ) => grad.addColorStop( colorStop.offset, colorStop.color ) );

		return grad;

	}

	css() {

		const cssGrad = this.colorStops.map( ( colorStop ) => `${ colorStop.color } ${ colorStop.offset * 100 }%` );
		return `linear-gradient(${ this.angle }rad, ${ cssGrad.join() } )`;

	}

}


function getGradientLineCoords(
	angle: number,
	width: number,
	height: number
): GradientLineCoords {

	const canvasGradentAngle = modulo( ( - angle + Math.PI * 0.5 ), Math.PI * 2 );

	// vertical and horizontal
	if ( angle === Math.PI * 0.0 ) return [ 0,     height, 0,     0      ];
	if ( angle === Math.PI * 0.5 ) return [ 0,     0,      width, 0      ];
	if ( angle === Math.PI * 1.0 ) return [ 0,     0,      0,     height ];
	if ( angle === Math.PI * 1.5 ) return [ width, 0,      0,     0      ];

	// other angle
	// https://developer.mozilla.org/docs/Web/CSS/linear-gradient#Composition_of_a_linear_gradient
	const cx = width * 0.5;
	const cy = height * 0.5;
	const slope = Math.tan( canvasGradentAngle );
	const pslope = - 1 / slope;

	const corner =
		canvasGradentAngle < Math.PI * 0.5 ? [   cx,   cy ] :
		canvasGradentAngle < Math.PI * 1.0 ? [ - cx,   cy ] :
		canvasGradentAngle < Math.PI * 1.5 ? [ - cx, - cy ] :
		                                     [   cx, - cy ];

	const intercept = corner[ 1 ] - pslope * corner[ 0 ];
	const endx = intercept / ( slope - pslope );
	const endy = pslope * endx + intercept;

	const x0 = cx - endx;
	const y0 = cy + endy;
	const x1 = cx + endx;
	const y1 = cy - endy;

	return [ x0, y0, x1, y1 ];

};

function modulo( n: number, d: number ): number {

	if ( d === 0 ) return n;
	if ( d < 0 ) return NaN;

  return ( n % d + d ) % d;
}
