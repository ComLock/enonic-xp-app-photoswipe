/* eslint-disable no-console */
//──────────────────────────────────────────────────────────────────────────────
// Imports
//──────────────────────────────────────────────────────────────────────────────
import glob from 'glob';
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
//import MinifyPlugin from 'babel-minify-webpack-plugin';

//──────────────────────────────────────────────────────────────────────────────
// Common
//──────────────────────────────────────────────────────────────────────────────
const JS_EXTENSION_GLOB_BRACE = '*.{es,es6,mjs,jsx,flow,js}';
const ASSETS_PATH_GLOB_BRACE = '{site/assets,assets}';

const SRC_DIR = 'src/main/resources';
const DST_DIR = 'build/resources/main';

const context = path.resolve(__dirname, SRC_DIR);
const extensions = ['.es', '.js', '.json']; // used in resolve
const outputPath = path.join(__dirname, DST_DIR);

//const mode = 'production'; // Enables UglifyJsPlugin which we don't want
//const mode = 'development';
const mode = 'none';

const stats = {
	colors: true,
	hash: false,
	maxModules: 0,
	modules: false,
	moduleTrace: false,
	timings: false,
	version: false
};

//──────────────────────────────────────────────────────────────────────────────
// Functions
//──────────────────────────────────────────────────────────────────────────────
//const toStr = v => JSON.stringify(v, null, 4);
const dict = arr => Object.assign(...arr.map(([k, v]) => ({ [k]: v })));

//──────────────────────────────────────────────────────────────────────────────
// CSS
//──────────────────────────────────────────────────────────────────────────────
const CSS_CONFIG = {
	context,
	devtool: false, // Don't waste time generating sourceMaps
	entry: {
		'assets/css/photoswipe': './assets/css/photoswipe.scss'
	},
	mode,
	module: {
		rules: [{
			test: /\.(scss)$/,
			use: [
				MiniCssExtractPlugin.loader,
				'css-loader',
				'sass-loader'
			]
		}, {
			test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
			loader: 'url-loader',
			options: {
				limit: 10000
			}
		}]
	}, // module
	output: {
		path: outputPath,
		//filename: '[name].[chunkhash].js'
		filename: 'unwanted'
	}, // output
	plugins: [
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output both options are optional
			filename: '[name].css',
			chunkFilename: '[id].[chunkhash].css'
		})
	],
	stats
};


//──────────────────────────────────────────────────────────────────────────────
// Assets
//──────────────────────────────────────────────────────────────────────────────
const ALL_JS_ASSETS_GLOB = `${SRC_DIR}/${ASSETS_PATH_GLOB_BRACE}/**/${JS_EXTENSION_GLOB_BRACE}`;
//console.log(`ALL_JS_ASSETS_GLOB:${toStr(ALL_JS_ASSETS_GLOB)}`);

const ALL_JS_ASSETS_FILES = glob.sync(ALL_JS_ASSETS_GLOB);
//console.log(`ALL_JS_ASSETS_FILES:${toStr(ALL_JS_ASSETS_FILES)}`);

const ASSETS_ENTRY = dict(ALL_JS_ASSETS_FILES.map(k => [
	k.replace(`${SRC_DIR}/`, '').replace(/\.[^.]*$/, ''), // name
	`.${k.replace(`${SRC_DIR}`, '')}` // source relative to context
]));

//ASSETS_ENTRY['assets/css/photoswipe'] = './assets/css/photoswipe.scss';

const ASSETS_CONFIG = {
	context,
	entry: ASSETS_ENTRY,
	devtool: false, // Don't waste time generating sourceMaps
	mode,
	module: {
		rules: [{
			test: /\.(es6?|js)$/, // Will need js for node module depenencies
			use: [{
				loader: 'babel-loader',
				options: {
					babelrc: false, // The .babelrc file should only be used to transpile config files.
					comments: false,
					compact: false,
					minified: false,
					plugins: [
						'array-includes',
						'optimize-starts-with',
						'transform-object-assign',
						'transform-object-rest-spread'
					],
					presets: [[
						'env', {
							modules: false, // Let minifyer handle modules...
							targets: {
								// browserlist combined by OR clause
								// https://github.com/ai/browserslist
								browsers: ['last 2 versions', 'not ie <= 10']
							}
						}
						/*'es2015', {
							modules: false // Let minifyer handle modules...
						}*/
						/*'minify'/*, {
							deadcode: false, // photoSwipeInitializer
							//mangle: false
							mangle: {
								//exclude: ['photoSwipeInitializer'],
								eval: false,
								keepClassName: true,
								keepFnName: true,
								topLevel: false
							}
						}*/
					]]
				} // options
			}] // use
		}/*, {
			test: /\.(scss)$/,
			use: [
				MiniCssExtractPlugin.loader,
				'css-loader',
				'sass-loader'
			]
		}, {
			test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
			loader: 'url-loader',
			options: {
				limit: 10000
			}
		}*/] // rules
	}, // module
	output: {
		path: outputPath,
		filename: '[name].js',
		libraryTarget: 'commonjs' // exports is not defined
		//libraryTarget: 'commonjs2' // module is not defined
	}, // output
	plugins: [
		/*new MinifyPlugin({ // minifyOpts // https://github.com/babel/minify/tree/master/packages/babel-preset-minify#options
			mangle: {
				exclude: [
					'photoSwipeInitializer'
				]
			}
		}, { // pluginOpts // https://github.com/webpack-contrib/babel-minify-webpack-plugin#pluginopts
			comments: false
		}),*/ // MinifyPlugin
		/*new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output both options are optional
			chunkFilename: '[id].[chunkhash].css',
			filename: '[name].css'
		})*/
	],
	resolve: {
		extensions
	}, // resolve
	stats,
	target: 'web'
}; // ASSETS_CONFIG

//──────────────────────────────────────────────────────────────────────────────
// Server-side Javascript
//──────────────────────────────────────────────────────────────────────────────
const SERVER_JS_FILES = glob.sync(`${SRC_DIR}/**/${JS_EXTENSION_GLOB_BRACE}`, {
	ignore: ALL_JS_ASSETS_FILES
});
//console.log(`SERVER_JS_FILES:${toStr(SERVER_JS_FILES)}`);

const SERVER_JS_ENTRY = dict(SERVER_JS_FILES.map(k => [
	k.replace(`${SRC_DIR}/`, '').replace(/\.[^.]*$/, ''), // name
	`.${k.replace(`${SRC_DIR}`, '')}` // source relative to context
]));
//console.log(`SERVER_JS_ENTRY:${toStr(SERVER_JS_ENTRY)}`);

const SERVER_JS_CONFIG = {
	context,
	entry: SERVER_JS_ENTRY,
	externals: [
		/\/lib\/(enonic|xp)/
	],
	devtool: false, // Don't waste time generating sourceMaps
	mode,
	module: {
		rules: [{
			test: /\.(es6?|js)$/, // Will need js for node module depenencies
			use: [{
				loader: 'babel-loader',
				options: {
					babelrc: false, // The .babelrc file should only be used to transpile config files.
					comments: false,
					compact: false,
					minified: false,
					plugins: [
						'array-includes',
						'optimize-starts-with',
						'transform-object-assign',
						'transform-object-rest-spread'
					],
					presets: ['es2015']
				} // options
			}] // use
		}] // rules
	}, // module
	output: {
		path: outputPath,
		filename: '[name].js',
		libraryTarget: 'commonjs'
	}, // output
	resolve: {
		alias: {
			'/content-types': path.resolve(__dirname, SRC_DIR, 'site', 'content-types'),
			'/lib': path.resolve(__dirname, SRC_DIR, 'lib'),
			'/mixins': path.resolve(__dirname, SRC_DIR, 'site', 'mixins'),
			'/services': path.resolve(__dirname, SRC_DIR, 'services'),
			'/site': path.resolve(__dirname, SRC_DIR, 'site')
		},
		extensions
	}, // resolve
	stats
};
//console.log(`SERVER_JS_CONFIG:${JSON.stringify(SERVER_JS_CONFIG, null, 4)}`);


//──────────────────────────────────────────────────────────────────────────────
// Exports
//──────────────────────────────────────────────────────────────────────────────
const WEBPACK_CONFIG = [
	CSS_CONFIG,
	ASSETS_CONFIG,
	SERVER_JS_CONFIG
];

//console.log(`WEBPACK_CONFIG:${JSON.stringify(WEBPACK_CONFIG, null, 4)}`);
//process.exit();

export { WEBPACK_CONFIG as default };
