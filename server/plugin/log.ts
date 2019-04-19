const log4js = require('log4js');

/**
 * 格式化响应日志
 *
 * @param {*} ctx
 * @param {*} resTime
 * @returns
 */
const formatRes = (ctx: any, resTime: any) => {
    let logText: string = '';

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
 * 格式化响应错误日志
 *
 * @param {*} ctx
 * @param {*} err
 * @param {*} resTime
 * @returns
 */
const formatError = (ctx: any, err: any, resTime: any) => {
    let logText: string = '';

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
 * 格式化错误日志
 *
 * @param {*} ctx
 * @param {*} err
 * @param {*} resTime
 * @returns
 */
const formatMesError = (str: string) => {
    let logText: string = '';
    let date: any = new Date();
    //错误信息开始
    logText += "*************** error ***************" + date + "\n";
    //错误信息
    logText += "err stack: " + str + "\n";
    //错误信息结束
    logText += "*************** error ***************" + "\n";
    return logText;
};

/**
 * 格式化请求日志
 *
 * @param {*} req
 * @param {*} resTime
 * @returns
 */
const formatReqLog = (req: any, resTime: any) => {

    let logText: string = '';

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

export default (app: any) => {

    const logs: any = {};

    log4js.configure(app.config.log);

    const errorLogger = log4js.getLogger('errorLogger');
    const resLogger = log4js.getLogger('resLogger');
    const consoleLogger = log4js.getLogger('console');

    logs.error = (str:string) => {
        errorLogger.error(formatMesError(str));
        consoleLogger.error(formatMesError(str));
    }
    /**
     *  封装请求错误日志
     *
     * @param {*} ctx
     * @param {*} error
     * @param {*} resTime
     */
    logs.pageError = (ctx: any, error: any, resTime: any) => {
        if (ctx && error) {
            errorLogger.error(formatError(ctx, error, resTime));
            consoleLogger.error(formatError(ctx, error, resTime));
        }
    };

    /**
     * 封装请求响应日志
     *
     * @param {*} ctx
     * @param {*} resTime
     */
    logs.pageInfo = (ctx: any, resTime: any) => {
        if (ctx) {
            resLogger.info(formatRes(ctx, resTime));
        }
    };
    app.log = logs
}
