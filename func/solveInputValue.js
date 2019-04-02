/**
 * 
 */
var solveInputValue = {
    formatDropDownItemList (param) {
        var list = [];
        if (Object.prototype.toString.call(param) == '[object Object]') {
            for (var id in param) {
                list.push({
                    text: param[id],
                    value: Number(id)
                })
            }
        }
        return list;
    }
}
module.exports = solveInputValue;