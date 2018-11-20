import path from 'path';

import Koa from 'koa';
import statics from 'koa-static';
import nunjucks from 'koa-nunjucks-2';

import log from './lib/log';

import router from '../server/routes/routes';

const app = new Koa();

app.use(statics(
    path.join(__dirname, '../src/views')
));

app.use(nunjucks({
    ext: 'html',
    path: path.join(__dirname, '../src/'),
    nunjucksConfig: {
        trimBlocks: true, // 开启转义 防Xss
        noCache: true,
    }
}));

app.use(async (ctx, next) => {
    const start = new Date();
    let ms = null;
    try {
        await next();
        ms = new Date() - start;
        log.info(ctx, ms);
    } catch (error) {
        ms = new Date() - start;
        log.error(ctx, error, ms);
    }
});
  
app.use(router.routes()).use(router.allowedMethods());

export default app