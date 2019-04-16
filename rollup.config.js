import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const license = `/*!
 * ${ pkg.name }
 * https://github.com/yomotsu/gradient-maker
 * (c) 2019 @yomotsu
 * Released under the MIT License.
 */`;

export default {
	input: 'src/gradient-maker.ts',
	output: [
		{
			format: 'umd',
			name: 'GradientMaker',
			file: pkg.main,
			banner: license,
			indent: '\t',
		},
		{
			format: 'es',
			file: pkg.module,
			banner: license,
			indent: '\t',
		}
	],
	plugins: [
		typescript( { typescript: require( 'typescript' ) } ),
	],
};
