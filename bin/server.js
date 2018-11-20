import http from 'http';
import app from '../server/app';
import config from '../config/config';

const server = http.createServer(app.callback())

/* 
    服务监听
*/
server.listen(config.get('port'), () => {
    console.clear();
    console.log('\x1B[42m Success: \x1b[0m',`http://127.0.0.1:${config.get('port')}`);
    console.log(`\n ${config.get('env')}`)
    console.log('\n')
});

