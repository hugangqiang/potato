import { Controller } from "../base/controller";
import { router } from "../base/router";

export default class User extends Controller {

    @router.get('/test')
    async asd() {
        this.ctx.body = 'asdfsa';
    }

    @router.get('/')
    async userInfo() {
        this.ctx.render('html/page1', {
            title: '阿斯顿发生大山东'
        });
    }
}
