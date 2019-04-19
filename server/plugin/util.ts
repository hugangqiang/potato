



const util:any = {};


util.res = ({code=1,msg='ok',data={}}:any) => {
    const json: any = {
        code: code,
        msg: msg
    }
    if(data.hasOwnProperty('code')){
        return data;
    }else{
        json.data = data;
        return json;
    }
}

util.delNoNum = (value: any) => {
    return value.toString().replace(/[^\d]/g, "");
};
util.randomNum = (n: number,m: number) => {
    return Math.floor(Math.random()*(m-n+1)+n);
};

util.randomArr = (arr: any) => {
    return arr[Math.floor(Math.random()*(arr.length))]
}
util.param = (json: any) => {
    const params:any = []
    Object.keys(json).forEach((key) => {
        let value = json[key];
        params.push([key, encodeURIComponent(value)].join('='))
    })
    return params.join('&')
}
util.getIP = (req:any) => {
    return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
}
util.toDate = (str:string,s:string='') => {
    let date:any = new Date(str);
    let p = (s:number) => {
        return s < 10 ? '0' + s: s;
    }
    if( s == "CN" ){
        return date.getFullYear() + '年' + p((date.getMonth() + 1)) + '月' + p(date.getDate()) + '日  ' + p(date.getHours()) + ':' + p(date.getMinutes()) + ':' + p(date.getSeconds());
    }else{
        return date.getFullYear() + '-' + p((date.getMonth() + 1)) + '-' + p(date.getDate()) + '  ' + p(date.getHours()) + ':' + p(date.getMinutes()) + ':' + p(date.getSeconds());
    }
};
export default (app: any) => {
    app.util = util;
}
