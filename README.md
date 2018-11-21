##服务端做数据转发，模板渲染的前端构架

> 思考一下，就目前前端发展状况，需要搭建一个2B的商城，由于商城服务于传统行业，需要考虑兼容到IE8， 需要SEO。
就目前的技术选择构架，思考过用react 的服务端渲染满足SEO，但只能兼容到IE10 😂，后面只能放弃。后面采用node 做数据转发，模板引擎渲染页面给浏览器。 页面引用webpakc 做打包按需加载。

##### 在看完这段介绍后，可能有人会想到为什么不直接用egg.js？

egg在阿里刚开始发布的时候，我看文档就感觉就是一个比 express 更大的包，封装了更多的 service ，在用koa后就放弃了express ，自我感觉koa更符合程序的审美，目前egg 社区各类插件已经比较完善了，但egg太庞大了，因此自己写了一套。

###目录解析

![目录解析](https://cdn.hugangqiang.com/img/15427809332354509.png "目录解析")

###页面打包

页面使用webpack 多页面打包，每个页面实现采用按需加载

```javascript
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

/* 
    环境区分 在开发环境中不需要hash ，在文件监听更改后，同名会自动替换
*/
let env = process.env.ENV || 'development';
let filename = {
    js: 'assets/js/[name].js',
    css: 'assets/css/[name].css',
};

if(env === 'production') {
    filename = {
        js: 'assets/js/[name].[hash].js',
        css: 'assets/css/[name].[hash:8].css',
    };
}

/* 
    获取所有的页面入口
*/
const getEntry = () => {
    let entry = {}
    glob.sync('./src/pages/**/*.js')
        .forEach(function (name) {
            let arr = name.split('/');
            entry[arr[arr.length - 2]] = [name];
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
        path: path.resolve(__dirname, '../src/views'),
        filename: filename.js,
        publicPath: '/'    //后面需要配置CDN
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
			'common': path.resolve(__dirname, '../src/common'),  //别名
			'utils': path.resolve(__dirname, '../src/utils')
		}
	},
    // externals: {
        
    // },
    optimization: {
		splitChunks: {
			cacheGroups: {   //公共包生成，每个页面都会加载
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
        // 全局暴露统一入口，其他文件直接用就可以 配置promise 兼容ie11后的版本
        new webpack.ProvidePlugin({
            'Promise': 'bluebird'
        }),
        // 删除views目录 ， 每次打包都需要删除views 文件夹
		new cleanPlugin(['views'], {
			root: path.resolve(__dirname, '../src'),
			verbose: false,
			dry: false,
        }),
        //静态资源输出  这里没有url-loader 和file-loader 所以静态文件需要复制到生成后的文件夹，由于在html css 行内背景图片没有打包
		//因此直接复制静态文件来解决
		new copyPlugin([{
			from: path.resolve(__dirname, "../src/assets"),
			to: './assets',
			ignore: ['.*']
		}]),
        // css 分离提取出去的插件 
        new extractTextPlugin({
            filename: filename.css,
            publicPath: '/'
		}),
    ]
}
if(env=== 'production') {
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
    }))
    /* 
        css压缩
    */
    webpackBaseConfig.plugins.push(new optimizeCssAssetsPlugin({
        cssProcessorOptions: {
            safe: true
        }
    }))
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
```
打包生成后，模板不会打包组件和整体布局文件，因此模板引擎的根目录设置为src

在webpack 自定义devServer 中入到一个坑， 使用webpack-dev-middleware ，webpack-hot-middleware实现热加载，但webpack-dev-middleware为了读写高效处理，使用 memory-fs把打包生成的文件放到了内存中，然而页面组件并没有复制进内存中，node使用的nunjucks 也没法取到内存中的文件解析，后面读了下egg-view-nunjucks 的源码，他是直接更改了文件读取的方法，再者在node 文件编辑自动重启，在重启的过程中，webpack服务也会自动重启，这个方式肯定是错误的，node 重启生命周期，但webpack的生命周期并不需要重新挂在，egg 的方式是使用  node cluster 多进程，把webpack 打包的进程和 node服务的进程分开。

待续。。。
