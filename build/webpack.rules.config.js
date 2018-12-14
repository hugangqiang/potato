const extractTextPlugin = require('extract-text-webpack-plugin')


let env = process.env.ENV || 'development';

const rules = [{
    test: /\.(css|scss|sass)$/,
    use: env === "development" ? ["style-loader", "css-loader", "sass-loader", "postcss-loader"] : extractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader', 'postcss-loader'],
        publicPath: '/'
    })
}, {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader'
}, ]

if(env === 'development'){
    rules.push({
        test: /\.html$/,
        loader: "raw-loader"
    })
}

module.exports = rules
