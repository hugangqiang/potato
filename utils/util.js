

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