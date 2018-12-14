const path = require('path')
const webpack = require('webpack')
const glob = require('glob')
const htmlPlugin = require('html-webpack-plugin')
const extractTextPlugin = require('extract-text-webpack-plugin')
const optimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const uglifyjsPlugin = require('uglifyjs-webpack-plugin')
const cleanPlugin = require('clean-webpack-plugin')
const copyPlugin = require('copy-webpack-plugin')

const rules = require('./webpack.rules.config')

let config = {};

/*
    环境区分
*/
let env = process.env.ENV || 'development';


if(env === 'production') {
    config = {
        cdn: '/',
        filename: {
            js: 'assets/js/[name].[hash].js',
            css: 'assets/css/[name].[hash:8].css',
        },
        hotPath: ''
    }
}else{
    config = {
        cdn: 'http://127.0.0.1:3000/',
        filename: {
            js: 'assets/js/[name].[hash].js',
            css: 'assets/css/[name].[hash:8].css',
        },
        hotPath: 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000&reload=true'
    }
}

/*
    获取所有的页面入口
*/
const getEntry = () => {
    let entry = {}
    glob.sync('./src/pages/**/*.js')
        .forEach(function (name) {
            let arr = name.split('/');
            let names = [name];
            if(config.hotPath){
                names.push(config.hotPath)
            }
            entry[arr[arr.length - 2]] = names;
        });
    return entry;
}

/*
    webpack配置
*/
const webpackBaseConfig = {
    mode: env,
    entry: getEntry(),
    output: {
        path: path.resolve(__dirname, '../dist/views'),
        filename: config.filename.js,
        publicPath: config.cdn
    },
    devServer: {
        noInfo: true,
        inline: true,
        publicPath: config.cdn,
        stats: {
            cached: false,
            colors: true
        }
    },
    /*
        监听配置
    */
    watchOptions: {
        aggregateTimeout: 200,   // 编辑后打包间隔时间
        ignored: /node_modules/, // 排除文件夹
        poll: 1000    // 循环查询监听时间
    },
    /*
        配置loader
    */
    module: {
        rules: rules
    },
    resolve: {
		alias: {
			'common': path.resolve(__dirname, '../src/common'),
			'utils': path.resolve(__dirname, '../utils'),
			'theme': path.resolve(__dirname, '../src/theme'),
		}
	},
    optimization: {
		splitChunks: {
			cacheGroups: {
				utils: {
					chunks: 'initial',
					name: 'common',  // 包名称
					minSize: 0,    // 只要超出0字节就生成一个新包
					minChunks: 2
				}
			}
		}
    },
    plugins: [
        // 全局暴露统一入口，其他文件直接用就可以
        new webpack.ProvidePlugin({
            'Promise': 'bluebird'
        }),
        new webpack.DefinePlugin({
            ENV: JSON.stringify(env)
        }),
        // 删除views目录
		new cleanPlugin(['views'], {
			root: path.resolve(__dirname, '../dist'),
			verbose: false,
			dry: false,
        }),
        //静态资源输出
		new copyPlugin([{
			from: path.resolve(__dirname, "../src/assets"),
			to: './assets',
			ignore: ['.*']
		},{
			from: path.resolve(__dirname, "../src/components"),
			to: './components',
			ignore: ['.*']
		},{
			from: path.resolve(__dirname, "../src/layout"),
			to: './layout',
			ignore: ['.*']
		}]),
    ]
}
if(env === 'production') {
    // css 分离提取出去的插件
    webpackBaseConfig.plugins.push( new extractTextPlugin({
        filename: config.filename.css,
        publicPath: '/'
    }));
    /*
        js压缩
    */
    webpackBaseConfig.plugins.push(new uglifyjsPlugin({
        uglifyOptions: {
            compress: {
                warnings: false,
                drop_debugger: false,
                drop_console: true
            }
        }
    }));
    /*
        css压缩
    */
    webpackBaseConfig.plugins.push(new optimizeCssAssetsPlugin({
        cssProcessorOptions: {
            safe: true
        }
    }));
}else{
    webpackBaseConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
}
/*
    自动生成html模板
*/
Object.keys(getEntry()).forEach(item => {
    webpackBaseConfig.plugins.push(new htmlPlugin({
        template: `./src/pages/${item}/index.html`,
        filename: `html/${item}.html`,
        inject: true,
        hash: true,
        chunks: ['common', item]
    }))
})

module.exports = webpackBaseConfig
