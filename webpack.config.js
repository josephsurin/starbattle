const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	devtool: 'eval', //for chrome devtools

	watch: true, //watch project folder

	mode: 'development',

	entry: './src/index.js',

	output: {
		path: __dirname + '/build',
		publicPath: './',
		filename: 'bundle.js'
	},

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					presets: ['react']
				}
			},
			{
				test: /\.(sa|c)ss$/,
				use: ExtractTextPlugin.extract({
					use: ['css-loader', 'sass-loader']
				})
			},
			{
				test: /\.(png|jpg|gif|svg|eot|svg|ttf|woff|woff2)$/,
				loader: 'file-loader',
				options: {
					name: 'assets/[name].[ext]'
				}
			},
			{ test: /\.html$/, use: ['html-loader'] }
		]
	},

	plugins: [
		new ExtractTextPlugin({
			filename: 'bundle.css'
		}),
		new HtmlWebpackPlugin({
			template: 'src/index.html'
		})
	]
}
