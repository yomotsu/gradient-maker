interface ColorStop {
    offset: number;
    color: string;
}
export default class GradientMaker {
    static DEG2RAD: number;
    static normalizeCSSAngle(cssAngle: number | string): number;
    angle: number;
    colorStops: ColorStop[];
    constructor(cssAngle?: number | string, colorStops?: ColorStop[]);
    canvas(width?: number, height?: number): HTMLCanvasElement;
    context2dFillStyle(width: number | undefined, height: number | undefined, context2d: CanvasRenderingContext2D): CanvasGradient;
    css(): string;
}
export {};
