const path = require('path');

module.exports = {
	mode: 'development',
	entry: './src/client/js/index.js',
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'assets', 'js'),
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
		],
	},
};
