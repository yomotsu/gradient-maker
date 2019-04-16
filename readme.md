# gradient-maker

get liner gradient in CSS, Canvas2d and `fillStyle` of context2d.

[![Latest NPM release](https://img.shields.io/npm/v/gradient-maker.svg)](https://www.npmjs.com/package/gradient-maker)
![MIT License](https://img.shields.io/npm/l/gradient-maker.svg)

## Example

- [basic](https://yomotsu.github.io/gradient-maker/examples/basic.html)

## Usage

### As a module

```js
import ComparisonSlider from 'gradient-maker';

const angle = '30deg';
const colorStops = [
  { offset: 0.0, color: 'black' },
  { offset: 0.2, color: '#090979' },
  { offset: 0.6, color: 'rgba( 189, 4, 149, 1)' },
  { offset: 1.0, color: 'rgba( 0, 212, 255, 0.8)' },
];

const gradMaker = new GradientMaker( angle, colorStops );
```

then,

```js
const canvas = gradMaker.canvas( 128, 64 ); // reutrns 128 x 64 canvas element
const fillStyle = gradMaker.context2dFillStyle( 128, 64, context2d ); // reutrns fill style only
const cssBackground = gradMaker.css(); // reutrns css liner-gradient
```
