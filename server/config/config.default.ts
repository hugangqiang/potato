import * as path from 'path';

module.exports = {
    ENV: process.env.ENV || 'development',
    log: {
        /*
            配置文档: https://log4js-node.github.io
        */
        appenders: {
            console: {
                type: 'console'
            },
            resLogger: {
                type: 'dateFile',
                alwaysIncludePattern: true,
                filename: `${path.resolve(__dirname, '../logs')}/response/response`,
                pattern: "-yyyy-MM-dd-hh.log",
                path: '/response'
            },
            errorLogger: {
                type: 'dateFile',
                alwaysIncludePattern: true,
                filename: `${path.resolve(__dirname, '../logs')}/error/error`,
                pattern: "-yyyy-MM-dd-hh.log",
                path: '/error'
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
    },
    site: {
        cn: {
            defaultTitle: '伟德芯城 www.v-buy.com',
            phone: '021-60317246',
            qq: '550501319'
        },
        en: {
            defaultTitle: 'Vadas www.v-buy.com',
            phone: '+86-021-60317246',
        }
    }
}
