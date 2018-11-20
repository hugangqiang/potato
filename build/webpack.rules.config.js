const extractTextPlugin = require('extract-text-webpack-plugin')

const rules = [{
    test: /\.(css|scss|sass)$/,
    use: extractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader', 'postcss-loader'],
        publicPath: '/'
    })
}, {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader'
}]

module.exports = rules