import { Controller } from "../base/controller";
import { router } from "../base/router";

export default class Index extends Controller {

    @router.get('/')
    async index() {
        this.ctx.render('html/index', {
            title: '首页'

        });
    }

}
