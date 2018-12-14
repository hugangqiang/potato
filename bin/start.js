

const { App } = require('../dist/app');
const app = new App();
app.run(()=>{
    console.clear();
    console.log('\x1B[42m\x1B[30m Success: \x1B[39m\x1B[49m',`http://127.0.0.1:${3000}`);
    console.log(`\n ${process.env.ENV}`)
    console.log('\n')
});

/*
const path = require('path');
const cluster = require('cluster');
const chokidar = require('chokidar');
if (cluster.isMaster) {

    const webpack = require('webpack');
    const webpackConfig = require('../build/webpack.config')
    const compiler = webpack(webpackConfig);

    const devMiddleware = require('koa-webpack-dev-middleware');
    const hotMiddleware = require('koa-webpack-hot-middleware');

    app.use(devMiddleware(compiler,webpackConfig.devServer));
    app.use(hotMiddleware(compiler));

    cluster.on('message', (worker, mes) =>{

        switch (mes.action) {
            case 'READ_FILE': {
                const fileName = mes.fileName;
                try {
                    const filePath = path.join(compiler.outputPath, fileName);
                    const content = compiler.outputFileSystem.readFileSync(filePath).toString('UTF-8');
                    worker.send(content);
                } catch (e) {
                    console.log(`read file ${fileName} error`, e.toString());
                }
                break;
            }
            default:
                break;
        }
    });

    let worker = cluster.fork();
    let dir = path.join(__dirname, '../dist');

    chokidar.watch(dir).on('change', path =>{
        worker.kill();
        worker = cluster.fork().on('listening', (address) =>{
            console.log(`[master] listening: worker ${worker.id}, pid:${worker.process.pid} ,Address:${address.address } :${address.port}`);
        });
    });
} else {
    app.run(()=>{
        //console.clear();
        console.log('\x1B[42m\x1B[30m Success: \x1B[39m\x1B[49m',`http://127.0.0.1:${3000}`);
        console.log(`\n ${process.env.ENV}`)
        console.log('\n')
    });
}

 */
