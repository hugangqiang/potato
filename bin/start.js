/* 
    node import 兼容处理
*/

require('@babel/polyfill')
require('@babel/register') ({
    presets: [ '@babel/preset-env' ]
})


module.exports = require('./server')
