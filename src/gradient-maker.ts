interface ColorStop {
	offset: number;
	color: string;
};

const PI_HALF = Math.PI * 0.5;

export default class GradientMaker {

	static DEG2RAD = Math.PI / 180;

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

	public angle: number;
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

		// https://developer.mozilla.org/docs/Web/CSS/linear-gradient#Composition_of_a_linear_gradient

		const cx = width * 0.5;
		const cy = height * 0.5;
		const hypt = cy / Math.cos( this.angle );
		const area0 = Math.PI * 0.0 <= this.angle && this.angle < Math.PI * 0.5; //   0deg to  89.9... deg
		// const area1 = Math.PI * 0.5 <= this.angle && this.angle < Math.PI * 1.0; //  90deg to 179.9... deg
		const area2 = Math.PI * 1.0 <= this.angle && this.angle < Math.PI * 1.5; // 180deg to 269.9... deg
		const area3 = Math.PI * 1.5 <= this.angle && this.angle < Math.PI * 2.0; // 270deg to 359.9... deg
		const isVertical   = area0 || area2;
		// const isHorizontal = area1 || area3;
		const isFromBottom = area2 || area3;
		const triangleBottom = isVertical ?
			cx - Math.sqrt( hypt * hypt - cy * cy ) :
			cx + Math.sqrt( hypt * hypt - cy * cy );
		
		const diag = Math.sin( this.angle ) * triangleBottom;
		const len = hypt + diag;

		const topX    = cx + Math.cos(   PI_HALF + this.angle ) * len;
		const topY    = cy + Math.sin(   PI_HALF + this.angle ) * len;
		const bottomX = cx + Math.cos( - PI_HALF + this.angle ) * len;
		const bottomY = cy + Math.sin( - PI_HALF + this.angle ) * len;
		
		// ---
		
		const grad = isFromBottom ?
			context2d.createLinearGradient( bottomX, bottomY, topX, topY ) :
			context2d.createLinearGradient( topX, topY, bottomX, bottomY );

		this.colorStops.forEach( ( colorStop ) => grad.addColorStop( colorStop.offset, colorStop.color ) );

		return grad;

	}

	css() {

		const cssGrad = this.colorStops.map( ( colorStop ) => `${ colorStop.color } ${ colorStop.offset * 100 }%` );
		return `linear-gradient(${ this.angle }rad, ${ cssGrad.join() } )`;

	}

}
