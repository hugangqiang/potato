import Router from 'koa-router';
import indexctl from '../controllers/index'

const router = Router();

router
.get('/', indexctl.index)


export default router