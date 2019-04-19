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
    log: any;
    fetch: any;
    util: any;
    redis: any;

    constructor (){
        super();
        this.loader = new Loader(this);
        this.port = 1616;
        this.ip = '0.0.0.0';
    }
    loadDefaultMiddleware() {
        const koaBody = require('koa-body');

        const statics = require('koa-static');
        const cors = require('koa2-cors');

        const render = require('./lib/render').default;


        const renderConfig: any = {
            path: path.join(__dirname, 'views'),
            noCache: this.config.ENV === 'development',
            watch: this.config.ENV === 'development',
            outputFileSystem: null,
            filters: {}
        }
        if(this.config.ENV === 'development'){
            const webpack = require('webpack');
            const webpackConfig = require('../build/webpack.config')
            const compiler = webpack(webpackConfig);

            const devMiddleware = require('koa-webpack-dev-middleware');
            const hotMiddleware = require('koa-webpack-hot-middleware');

            this.use(devMiddleware(compiler,webpackConfig.devServer));
            this.use(hotMiddleware(compiler));
            renderConfig.outputFileSystem = compiler.outputFileSystem
        }
        this.use(cors({
            origin: (ctx: any) => {
                return '*';
            },
            exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
            maxAge: 5,
            credentials: true,
            allowMethods: ['GET', 'POST', 'DELETE'],
            allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
        }));


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
                    let dir = path.join(__dirname,`../tmp`);

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
                this.log.pageInfo(ctx, ms);
            } catch (error) {
                let date: any = new Date();
                ms = date - start;
                this.log.pageError(ctx, error, ms);
            };
        });

    }
    run(fn: (port: number, ip: string) => void, port?: number, ip?: string) {
        this.loader.loadConfig();
        this.loader.loadPlugin();

        this.loadDefaultMiddleware();

        this.loader.load();

        return this.listen(port || this.port, ip || this.ip, () => {
            fn && fn(port || this.port, ip || this.ip)
        })
    }
}
