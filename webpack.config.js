const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const BASE_JS_PATH = './src/client/js';

module.exports = {
	mode: 'development',
	watch: true,
	entry: {
		index: `${BASE_JS_PATH}/index.js`,
		header: `${BASE_JS_PATH}/header.js`,
		videoPlayer: `${BASE_JS_PATH}/videoPlayer.js`,
		upload: `${BASE_JS_PATH}/upload.js`,
		comment: `${BASE_JS_PATH}/comment.js`,
	},
	output: {
		filename: 'js/[name].js',
		path: path.resolve(__dirname, 'assets'),
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [['@babel/preset-env', { targets: 'defaults' }]],
					},
				},
			},
			{
				test: /\.scss$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'css/styles.css',
		}),
	],
};
