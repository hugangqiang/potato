import path from 'path';

/* 
    配置文档: https://log4js-node.github.io
*/

/* 
    错误日志路径
*/
const errorPath = '/error'

const errorLogPath = `${path.resolve(__dirname, '../logs')}${errorPath}/error`


/* 
    响应日志设置
*/
const resPath = '/response'

const resLogPath = `${path.resolve(__dirname, '../logs')}${resPath}/response`



export default {
    appenders: { 
        console: {
            type: 'console'
        },
        resLogger: { 
            type: 'dateFile', 
            alwaysIncludePattern: true,
            filename: resLogPath,
            pattern: "-yyyy-MM-dd-hh.log",     
            path: resPath 
        },
        errorLogger: {
            type: 'dateFile', 
            alwaysIncludePattern: true,
            filename: errorLogPath,
            pattern: "-yyyy-MM-dd-hh.log",     
            path: errorPath 
        }
    },
    categories: { 
        default: { 
            appenders: ['console'], 
            level: 'debug' 
        },
        resLogger: {
            appenders: ['resLogger'], 
            level: 'info' 
        },
        errorLogger: {
            appenders: ['errorLogger'], 
            level: 'error' 
        }
    }
}