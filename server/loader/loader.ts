import * as KoaRouter from 'koa-router';
import * as fs from 'fs';
import * as path from 'path';

import { BaseContext } from 'koa';
import { App } from '../app';
import { router } from '../base/router';


const HASLOADED = Symbol('hasloaded')

interface FileModule {
    module: any,
    filename: string,
    merge: string,
}


export class Loader {
    private koaRouter: any = new KoaRouter;
    private app: App;

    constructor(app: App) {
        this.app = app;
    }

    private fileLoader(url: string): Array<FileModule> {
        const merge = url;

        return fs.readdirSync(path.join(__dirname,merge)).map((name) => {
            return {
                module: require(merge + '/' + name).default,
                filename: name,
                merge: merge
            };
        });
    }

    loadController() {
        this.fileLoader('../controller');
    }

    loadRouter() {
        const r = router.getRoute();
        Object.keys(r).forEach((url) => {
            r[url].forEach((object) => {
                this.koaRouter[object.httpMethod](url, async (ctx: BaseContext) => {
                    const instance = new object.constructor(ctx);
                    await instance[object.handler]();
                })
            })
        })
        this.app.use(this.koaRouter.routes());
    }

    loadToContext(target: Array<FileModule>, app: App, property: string) {
        Object.defineProperty(app.context, property, {
            get() {
                if (!(<any>this)[HASLOADED]) {
                    (<any>this)[HASLOADED] = {};
                }
                const loaded = (<any>this)[HASLOADED];
                if (!loaded[property]) {
                    loaded[property] = {};
                    target.forEach((mod) => {
                        const key = mod.filename.split('.')[0];
                        loaded[property][key] = new mod.module(this, app);
                    })
                    return loaded.service
                }
                return loaded.service;
            }
        })
    }


    loadService() {
        const service = this.fileLoader('../service');
        this.loadToContext(service, this.app, 'service');
    }



    loadConfig() {
        const confDef = require('../config/config.default');
        const configEnv = confDef.ENV === 'production' ? '../config/config.pro' : '../config/config.dev';
        const conf = require(configEnv);
        const merge = Object.assign({}, conf, confDef);
        Object.defineProperty(this.app, 'config', {
            get: () => {
                return merge
            }
        })
    }

    loadPlugin() {
        const plugin = this.fileLoader('../plugin');
        plugin.forEach(item => {
            const plugin = item.module;
            plugin(this.app)
        })
    }

    load() {
        this.loadConfig();
        this.loadPlugin();
        this.loadController();
        this.loadService();

        this.loadRouter();
    }
}
