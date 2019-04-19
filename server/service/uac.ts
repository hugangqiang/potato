import { Service } from '../base/service';


export default class Uac extends Service {

    async test(json:any) {
        json = {
            test: '测试'
        }

        return json;
    }
}
