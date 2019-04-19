
/**
 *
 * Arr转JSON
 *
 * @param {array} [arr=[]]
 * @returns
 */
export const arrToJson = (arr = []) => {
    let json = {};
    arr.forEach(item => {
        json[item.name] = delSpace(item.value);
    })
    return json
}


/**
 *
 * JSON标准化
 *
 * @param {array} [str]
 * @returns
 */
export const toJson = (str = '') => {
    let text = str.replace(/'/g, '').replace(/&quot;/g, '"');
    return JSON.parse(text);
}



/**
 *
 * 随机生成指定长度字符串
 *
 * @param {number} [len=32]
 * @returns
 */
export const randomString = (len = 32) => {
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz12345678';
    let maxPos = $chars.length;
    let pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}

export const getCountDown = (el,str) => {
    clearInterval(el.time)
    el.seconds = str;
    el.time = setInterval(()=>{
        el.seconds = el.seconds-1000;
        if(parseInt(el.seconds)<0){
            setTimeout(() => {
                clearInterval(el.time)
                location.reload();
            },1000)
            return;
        }
        let days = parseInt(el.seconds / 1000 / 60 / 60 / 24 , 10);
        let hours = parseInt(el.seconds / 1000 / 60 / 60 % 24 , 10);
        let minutes = parseInt(el.seconds / 1000 / 60 % 60, 10);
        let seconds = parseInt(el.seconds / 1000 % 60, 10);
        days = p(days);
        hours = p(hours);
        minutes = p(minutes);
        seconds = p(seconds);
        let daysText = '';
        let hoursText = '';
        let minutesText = '';
        let secondsText = '';
        if(parseInt(days) != 0){
            hours = Number(hours)+24;
        }
        if(parseInt(hours) != 0){
            hoursText= hours+'时';
        }
        if(parseInt(minutes) != 0){
            minutesText= minutes+'分';
        }
        secondsText= seconds+'秒';

        if(parseInt(minutes) < 0){
            minutesText=''
        }
        if(parseInt(minutes) < 0){
            secondsText=''
        }
        el.text(daysText + hoursText + minutesText + secondsText)
    },1000);
    let p = (s) => {
        return s < 10 ? '0' + s: s;
    }
};
/**
 * 数字相加
 *
 * @param {*} a
 * @param {*} b
 * @returns
 */
export const addNum = (a, b) => {
    let c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
};
/**
 * 数字乘
 *
 * @param {*} a
 * @param {*} b
 * @returns
 */
export const mul = (a, b) => {
    let c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) {}
    try {
        c += e.split(".")[1].length;
    } catch (f) {}
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
};

/**
 * 价格格式化
 *
 * @param {*} str
 * @returns
 */
export const toPrice = (str) => {
    str = (str || 0).toString().replace(/,/g, "");
    if(str.split(".").length > 1){
        return str.toString().split(".")[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + str.toString().split(".")[1];
    }else{
        return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
};

/**
 *  日期格式化
 *
 * @param {*} str
 * @param {string} [s='']
 * @returns
 */
export  const toDate = (str,s='') => {
    let date = new Date(str);
    let p = (s) => {
        return s < 10 ? '0' + s: s;
    }
    if( s == "CN" ){
        return date.getFullYear() + '年' + p((date.getMonth() + 1)) + '月' + p(date.getDate()) + '日 ' + p(date.getHours()) + ':' + p(date.getMinutes()) + ':' + p(date.getSeconds());
    }else{
        return date.getFullYear() + '-' + p((date.getMonth() + 1)) + '-' + p(date.getDate()) + ' ' + p(date.getHours()) + ':' + p(date.getMinutes()) + ':' + p(date.getSeconds());
    }
};
/**
 * 删除字符串前后空格
 *
 * @param {*} value
 * @returns
 */
export const delSpace = (value)=>{
    return value.replace(/(^\s*)|(\s*$)/g, "");
};

/**
 * 删除非数字
 *
 * @param {*} value
 * @returns
 */
export const delNoNum = (value)=>{
    return value.replace(/[^\d]/g, "");
};

/**
 * 删除非数字但排除'.'
 *
 * @param {*} value
 * @returns
 */
export const delNoNumFloat = (value)=>{
    let text = value.replace(/[^\d^\.]/g, "");
    let arr = text.split('.');
    let oneNum = arr.splice(0, 1)[0];
    if(arr.length === 0){
        return oneNum;
    }else{
        return `${oneNum}.${arr.join('')}`
    }

};
/**
 * 日期格式转换"-"转"/"
 *
 * @param {*} value
 * @returns
 */
export const toTime = (value)=>{
    return value.replace(/\-/g, "/");
};
/**
 * 格式验证
 *
 * @param {*} value
 * @param {*} type
 * @returns
 */
export const validate = (value,type) => {
    value = delSpace(value);
    switch(type){
        case 'phone':
            return /^1[2|3|4|5|6|7|8|9][0-9]\d{8}$/.test(value);
            break;
        case 'email':
            return /^(\S)+@(\w-?)+(\.\w{2,})+$/.test(value);
            break;
        case 'code':
            return /^[0-9]*$/.test(value) && /^.{4}$/.test(value);
            break;
        case 'password':
            return value.length >= 6;
            break;
        default:;
    };
};

export const param = (json) => {
    const params = []
    Object.keys(json).forEach((key) => {
        let value = json[key];
        params.push([key, encodeURIComponent(value)].join('='))
    })
    return params.join('&')
}
/**
 * 图片转beac64位
 *
 * @param {*} file
 * @returns
 */
export const toImgB64 = (file) => {
    return new Promise((resolve, reject) => {
		let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e)=>{
            resolve(reader.result);
        }
	})
}



export const Base64 = {
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	encode: function(e) {
		var t = "";
		var n, r, i, s, o, u, a;
		var f = 0;
		e = Base64._utf8_encode(e);
		while (f < e.length) {
			n = e.charCodeAt(f++);
			r = e.charCodeAt(f++);
			i = e.charCodeAt(f++);
			s = n >> 2;
			o = (n & 3) << 4 | r >> 4;
			u = (r & 15) << 2 | i >> 6;
			a = i & 63;
			if (isNaN(r)) {
				u = a = 64
			} else if (isNaN(i)) {
				a = 64
			}
			t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
		}
		return t
	},
	decode: function(e) {
		var t = "";
		var n, r, i;
		var s, o, u, a;
		var f = 0;
		e = e.replace(/[^A-Za-z0-9+/=]/g, "");
		while (f < e.length) {
			s = this._keyStr.indexOf(e.charAt(f++));
			o = this._keyStr.indexOf(e.charAt(f++));
			u = this._keyStr.indexOf(e.charAt(f++));
			a = this._keyStr.indexOf(e.charAt(f++));
			n = s << 2 | o >> 4;
			r = (o & 15) << 4 | u >> 2;
			i = (u & 3) << 6 | a;
			t = t + String.fromCharCode(n);
			if (u != 64) {
				t = t + String.fromCharCode(r)
			}
			if (a != 64) {
				t = t + String.fromCharCode(i)
			}
		}
		t = Base64._utf8_decode(t);
		return t
	},
	_utf8_encode: function(e) {
		e = e.replace(/rn/g, "n");
		var t = "";
		for (var n = 0; n < e.length; n++) {
			var r = e.charCodeAt(n);
			if (r < 128) {
				t += String.fromCharCode(r)
			} else if (r > 127 && r < 2048) {
				t += String.fromCharCode(r >> 6 | 192);
				t += String.fromCharCode(r & 63 | 128)
			} else {
				t += String.fromCharCode(r >> 12 | 224);
				t += String.fromCharCode(r >> 6 & 63 | 128);
				t += String.fromCharCode(r & 63 | 128)
			}
		}
		return t
	},
	_utf8_decode: function(e) {
		var t = "";
		var n = 0;
		var r = c1 = c2 = 0;
		while (n < e.length) {
			r = e.charCodeAt(n);
			if (r < 128) {
				t += String.fromCharCode(r);
				n++
			} else if (r > 191 && r < 224) {
				c2 = e.charCodeAt(n + 1);
				t += String.fromCharCode((r & 31) << 6 | c2 & 63);
				n += 2
			} else {
				c2 = e.charCodeAt(n + 1);
				c3 = e.charCodeAt(n + 2);
				t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
				n += 3
			}
		}
		return t
	}
}
