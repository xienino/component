const delay = (func, wait, args) => {
    return setTimeout(function(){
        return func.call(null, args);
    }, wait);
};

/**
 * 防反跳. 高频请求下, 只响应一次
 * @param {Function} func 
 * @param {Number} wait 等待立即执行
 * @param {Bolean} immediate 是否立即执行, 不好用, 别用这个参数
 */
const debounce = (func, wait, immediate) => {
    var timeout, result;

    var later = function (args) {
        timeout = null;
        if (args) result = func.call(null, args);
    };

    var debounced = function (args) {
        if (timeout) clearTimeout(timeout);
        if (immediate) {
            var callNow = !timeout;             // 如果之前尚没有调用尝试, 则此次调用立即执行, 否则wait
            timeout = setTimeout(later, wait);
            if (callNow) result = func.call(null, args);
        } else {
            timeout = delay(later, wait, args);
        }

        return result;
    };

    debounced.cancel = function () {
        clearTimeout(timeout);
        timeout = null;
    };

    return debounced;
};

module.exports = {
    debounce
};