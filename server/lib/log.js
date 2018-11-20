import log4js from 'log4js';
import config from '../../config/config';

const log = {};

log4js.configure(config.get('log'));

const errorLogger = log4js.getLogger('errorLogger'); 
const resLogger = log4js.getLogger('resLogger');
const consoleLogger = log4js.getLogger('console');


/**
 * 封装错误日志
 *
 * @param {*} ctx
 * @param {*} error
 * @param {*} resTime
 */
log.error = (ctx, error, resTime) => {
    if (ctx && error) {
        errorLogger.error(formatError(ctx, error, resTime));
        consoleLogger.error(formatError(ctx, error, resTime));
    }
};


/**
 * 封装响应日志
 *
 * @param {*} ctx
 * @param {*} resTime
 */
log.info = (ctx, resTime) => {
    if (ctx) {
        resLogger.info(formatRes(ctx, resTime));
    }
};



/**
 * 格式化响应日志
 *
 * @param {*} ctx
 * @param {*} resTime
 * @returns
 */
const formatRes = (ctx, resTime) => {
    let logText = new String();

    //响应日志开始
    logText += "\n" + "*************** response log start ***************" + "\n";

    //添加请求日志
    logText += formatReqLog(ctx.request, resTime);

    //响应状态码
    logText += "response status: " + ctx.status + "\n";

    //响应内容
    logText += "response body: " + "\n" + JSON.stringify(ctx.body) + "\n";

    //响应日志结束
    logText += "*************** response log end ***************" + "\n";

    return logText;

}


/**
 * 格式化错误日志
 *
 * @param {*} ctx
 * @param {*} err
 * @param {*} resTime
 * @returns
 */
const formatError = (ctx, err, resTime) => {
    let logText = new String();

    //错误信息开始
    logText += "\n" + "*************** error log start ***************" + "\n";

    //添加请求日志
    logText += formatReqLog(ctx.request, resTime);

    //错误名称
    logText += "err name: " + err.name + "\n";
    //错误信息
    logText += "err message: " + err.message + "\n";
    //错误详情
    logText += "err stack: " + err.stack + "\n";

    //错误信息结束
    logText += "*************** error log end ***************" + "\n";

    return logText;
};

/**
 * 格式化请求日志
 *
 * @param {*} req
 * @param {*} resTime
 * @returns
 */
const formatReqLog = (req, resTime) => {

    let logText = new String();

    let method = req.method;
    //访问方法
    logText += "request method: " + method + "\n";

    //请求原始地址
    logText += "request originalUrl:  " + req.originalUrl + "\n";

    //客户端ip
    logText += "request client ip:  " + req.ip + "\n";

    //请求参数
    if (method === 'GET') {
        logText += "request query:  " + JSON.stringify(req.query) + "\n";
    } else {
        logText += "request body: " + "\n" + JSON.stringify(req.body) + "\n";
    }
    //服务器响应时间
    logText += "response time: " + resTime + "\n";

    return logText;
}


export default log;