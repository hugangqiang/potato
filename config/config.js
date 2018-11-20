import logConfig from './config.log'

const config = new Map();
const env = process.env.ENV || 'development';

/* 
    环境区分
*/
config.set('env', env)
/* 
    端口设置
*/
config.set('port', 6060);

/* 
    日志配置
*/
config.set('log', logConfig);


export default config