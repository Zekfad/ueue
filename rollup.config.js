import {
	resolve as resolvePath,
	join as joinPath,
} from 'path';

import babelProposalClassProperties from '@babel/plugin-proposal-class-properties';
import babelProposalNullishCoalescingOperator from '@babel/plugin-proposal-nullish-coalescing-operator';
import babelProposalOptionalChaining from '@babel/plugin-proposal-optional-chaining';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import builtins from 'builtin-modules';
import MagicString from 'magic-string';
import { terser, } from 'rollup-plugin-terser';


const
	devMode = 'dev' === (process.env.mode && process.env.mode.toLowerCase()),
	srcDir = resolvePath('./src'),
	distDir = resolvePath('./dist'),
	external = builtins;

let plugins = [];

plugins.push(...[
	babel({
		exclude: 'node_modules/**',
		plugins: [
			babelProposalClassProperties,
			babelProposalOptionalChaining,
			babelProposalNullishCoalescingOperator,
		],
		babelHelpers: 'bundled',
	}),
	json(),
	resolve({
		preferBuiltins: true,
	}),
	commonjs(),
	// Hack: JSDoc resolver
	(function jsDocResolver() {
		return {
			transform(code) {
				let jsDocRegExp = /\/\*\*([^*]|(\*(?!\/)))*\*\//g,
					jsDocMatch,
					indexes = [],
					imports = [];

				while ((jsDocMatch = jsDocRegExp.exec(code))) {
					let importRegExp = /import\((.*)\)\./g,
						importMatch;

					while ((importMatch = importRegExp.exec(jsDocMatch[0]))) {
						let importModule = importMatch[1];//.replace(/^(["'`])(.*)\1$/, '$2');

						indexes.push([
							jsDocMatch.index + importMatch.index,
							jsDocMatch.index + importMatch.index + importMatch[0].length,
						]);

						if (!imports.includes(importModule))
							imports.push(importModule);
					}
				}

				let result = null;

				if (indexes.length) {
					let magicCode = new MagicString(code);

					indexes.forEach(offsets => magicCode.remove(...offsets));

					imports.forEach(importModule => magicCode.prepend(`import ${importModule};\n`));

					result = {
						code: magicCode.toString(),
						map : magicCode.generateMap({ hires: true, }),
					};
				}

				return result;
			},
		};
	})(),
]);

if (!devMode)
	plugins.push(...[
		terser({
			compress: {
				arrows         : false,
				keep_classnames: true,
				keep_fnames    : true,
				keep_infinity  : true,
				typeofs        : false,
			},
			output: {
				comments: 'all',
			},
			mangle         : false,
			keep_classnames: true,
			keep_fnames    : true,
		}),
	]);

export default {
	input : joinPath(srcDir, 'index.js'),
	output: [
		{
			file     : joinPath(distDir, 'cjs', 'bundle.cjs'),
			format   : 'cjs',
			sourcemap: true,
		},
		{
			file     : joinPath(distDir, 'esm', 'bundle.mjs'),
			format   : 'es',
			sourcemap: true,
		},
	],
	plugins,
	external,
};