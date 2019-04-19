
const nunjucks = require('nunjucks');
const path = require('path');



const defaultConfig = {
    path: 'views',
    autoescape: true,
    noCache: false,
    watch: false,
    throwOnUndefined: false,
    filters: {}
}


class FileLoader extends nunjucks.FileSystemLoader {
    constructor(path: string, opts: any, outputFileSystem: any) {
        super(path, opts);
        this.searchPaths = this.searchPaths;
        this.pathsToNames = this.pathsToNames;
        this.noCache = this.noCache;
        this.outputFileSystem = outputFileSystem;
    }

    getSource(name: string) {
        if( !this.outputFileSystem ){
            const result = super.getSource(name);
            return result;
        }else{
            let fullpath = path.join(this.searchPaths[0], name);
            this.pathsToNames[fullpath] = name;
            return {
                src: this.outputFileSystem.readFileSync(fullpath).toString('UTF-8'),
                path: fullpath,
                noCache: this.noCache
            }
        }
    }
}

// const readFile = (name: string) => {
//     return new Promise((resolve: any, reject: any) => {
//         if(process.send){
//             process.send({action: 'READ_FILE', fileName: name});
//             process.on('message', (content: any) => {
//                 console.log(content)
//                 resolve(content)
//             })
//         }
//     })
// }

const createEnv = (opts: any) => {
    let env = new nunjucks.Environment(
                new FileLoader(opts.path, {
                    noCache: opts.noCache,
                    watch: opts.watch,
                }, opts.outputFileSystem), {
                    autoescape: opts.autoescape,
                    throwOnUndefined: opts.throwOnUndefined
                });
    if (opts.filters) {
        for (let f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}

export default (opts: any) => {
    let env = createEnv(Object.assign({}, defaultConfig, opts || {}));
    return async (ctx: any, next: any) => {
        ctx.render = (view: any, model: any) => {
            model.title = `${model.title}-${ctx.state.site[ctx.i18n.__('env')].defaultTitle}`;
            ctx.response.body = env.render(`${view}.html`, Object.assign({}, ctx.state || {}, model || {}));
            ctx.response.type = 'text/html';
        };
        await next();
    };
}

