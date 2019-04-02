
const _group = behavior => {
    return (arr, iteratee) => {
        let result = {};
        iteratee = _cb(iteratee)
        arr.forEach(value => {
            let key = iteratee(value)
            behavior(result, value, key)
        })
        return result
    }
}

const _isFunction = obj => typeof obj == 'function' || false;
const _cb = value => {                      //目前只考虑两种情况: Function, 属性
    if (_isFunction(value)) return value;
    return obj => {
        return obj == null ? undefined : obj[value]
    }
}

/**
 * 把一个集合分组为多个集合，通过iterator进行分组.
 * in: arr: 被分组的数组; itearator: String/Function;
 * out: result: Object
 */
const groupBy = _group((result, value, key) => {
    if (result[key]) result[key].push(value); else result[key] = [value];
})

/**
 * 给定一个list，和 一个用来返回一个在列表中的每个元素键 的iterator(function/属性名)， 返回一个每一项索引的对象
 * 与groupBy很像, 当知道iteratee唯一可使用此方法
 */
const indexBy = _group(function (result, value, key) {
    result[key] = value;
});


module.exports = {
    groupBy,
    indexBy,
};