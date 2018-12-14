
const methods = ['get', 'post', 'patch', 'del', 'options', 'put']

interface Rou {
    [key: string]: Array<{
        httpMethod: string,
        constructor: any,
        handler: string
    }>
}
interface ROU {
    httpMethod: string,
    constructor: any,
    handler: string
}
interface Decorator {
    (target: any, propertyKey: string): void
}

export interface routes extends Router {
    /**
     * http post method
     * @param url
     */
    post(url: string): Decorator;

    /**
     * http get method
     * @param url
     */
    get(url: string): Decorator;
    patch(url: string): Decorator;
    del(url: string): Decorator;
    options(url: string): Decorator;
    put(url: string): Decorator;
}

class Router {
    routes: Rou = {}
    setRouter(url: string, routes: ROU) {
        const _router = this.routes[url];
        if (_router) {
            //检查http method 是否冲突
            for (const index in _router) {
                const object = _router[index];
                if (object.httpMethod === routes.httpMethod) {
                    //logger.error(`路由地址 ${object.httpMethod} ${url} 已经存在`);
                    return
                }
            }
            //不冲突则注册
            this.routes[url].push(routes);
        } else {
            this.routes[url] = [];
            this.routes[url].push(routes);
        }
    }

    /**
     * 给一个控制器添加restful方法
     *
     * Get(); => http GET
     *
     * Post(); => http POST
     *
     * Del(); => http DELETE
     *
     * Put(); => http PUT
     * @param url
     */
    restfulClass(url: string) {
        return (Class: Function) => {
            ['Get', 'Post', 'Del', 'Put'].forEach((httpMethod) => {
                const lowercase = httpMethod.toLowerCase();
                const handler = Class.prototype[httpMethod];
                if (handler) {
                    this.setRouter(url, {
                        httpMethod: lowercase,
                        constructor: Class,
                        handler: httpMethod
                    })
                }
            })
        }
    }
    getRoute() {
        return this.routes;
    }
}

methods.forEach((httpMethod) => {
    Object.defineProperty(Router.prototype, httpMethod, {
        get: function () {
            return (url: string) => {
                return (target: any, propertyKey: string) => {
                    (<any>this).setRouter(url, {
                        httpMethod: httpMethod,
                        constructor: target.constructor,
                        handler: propertyKey
                    })
                }
            }
        }
    })
})

export const router: routes = <any>new Router
