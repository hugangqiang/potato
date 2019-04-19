import $ from 'common/jquery'
import { Notification, fetch } from 'common/common'
import {  arrToJson } from 'utils/util'

import 'layout/layout.js';
import "components/sign/index.js"
import "components/shortcut/index.js"
import "components/header/index.js"
import "components/nav/index.js"
import "components/category/index.js"
import "components/carousel/index.js"
import "components/footer/index.js"

import './index.scss'

if(ENV !== 'production'){ require('./index.html')};



$('#overstock .submit').on('click', ()=>{
    let json = arrToJson($('#overstock').serializeArray());

    if(!json.company ){
        Notification.error('请填写公司名称')
        return
    }
    if( !json.name ){
        Notification.error('请填写联系人')
        return
    }
    if(!json.phone){
        Notification.error('请填写联系人电话')
        return
    }
    fetch({
        url: '/overstock/contact',
        type: 'POST',
        data: json
    }).then(res => {
        Notification.success('提交保存成功');
    })
})
