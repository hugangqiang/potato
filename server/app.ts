import * as fs from 'fs';
import * as path from 'path';

import * as Koa from 'koa';

import { Loader } from './loader/loader';
import { Controller } from './base/controller';
import { Service } from './base/service';
import { router, routes } from './base/router';

export class App extends Koa {
    private loader: Loader;
    private port: number;
    private ip: string;
    static Controller: typeof Controller = Controller;
    static Service: typeof Service = Service;
    static Router: routes = router;
    config: any;
    test: any;

    constructor (){
        super();
        this.loader = new Loader(this);
        this.port = 3000;
        this.ip = '127.0.0.1';
    }
    loadDefaultMiddleware() {
        const koaBody = require('koa-body');
        const statics = require('koa-static');
        const render = require('./lib/render').default;
        const log = require('./lib/log').default;
        const ENV:string = process.env.ENV || 'development';

        const renderConfig: any = {
            path: path.join(__dirname, 'views'),
            noCache: ENV === 'development',
            watch: ENV === 'development',
            outputFileSystem: null,
            filters: {
                delHtml: (str: string) => str.replace(/<[^<>]+>/g, ''),
            }
        }
        if(ENV === 'development'){
            const webpack = require('webpack');
            const webpackConfig = require('../build/webpack.config')
            const compiler = webpack(webpackConfig);

            const devMiddleware = require('koa-webpack-dev-middleware');
            const hotMiddleware = require('koa-webpack-hot-middleware');

            this.use(devMiddleware(compiler,webpackConfig.devServer));
            this.use(hotMiddleware(compiler));
            renderConfig.outputFileSystem = compiler.outputFileSystem
        }
        this.use(render(renderConfig));
        this.use(koaBody({
            multipart: true,
            formLimit: 10000,
            formidable: {
                uploadDir: path.join(__dirname, 'tmp'),
                keepExtensions: true,
                maxFieldsSize: 2 * 1024 * 1024,
                onFileBegin: (name: string, file: any ) => {
                    let arr = file.name.split('.');
                    let ext = arr[arr.length - 1];
                    let dir = path.join(__dirname,`/tmp`);

                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }

                    let fileName = `${Date.now()}.${ext}`;
                    file.path = `${dir}/${fileName}`;
                    file.name = fileName;
                    this.context.uploadpath = this.context.uploadpath ? this.context.uploadpath : {};
                    this.context.uploadpath[name] = `${fileName}`;
                }
            }
        }));
        this.use(statics(
            path.join(__dirname, 'views')
        ));
        this.use(async (ctx, next) => {
            const start: any = new Date();
            let ms: any;
            try {
                await next();
                let date: any = new Date();
                ms = date - start;
                log.info(ctx, ms);
            } catch (error) {
                let date: any = new Date();
                ms = date - start;
                log.error(ctx, error, ms);
            }
        });
    }
    run(fn: (port: number, ip: string) => void, port?: number, ip?: string) {
        this.loadDefaultMiddleware();

        this.loader.load();

        return this.listen(port || this.port, ip || this.ip, () => {
            fn && fn(port || this.port, ip || this.ip)
        })
    }
}
