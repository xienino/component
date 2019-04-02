import BaseExport from 'accountManage/exportToFile/baseExport.react';

class exportBill extends BaseExport {
    constructor (p) {
        super(p)
    }
    componentWillMount() {
        this.fileTitle = this.title = '全部作业记账单';
        this.AllPlanString = this.props.itemTitle + '\r\n';
        this.props.dataList.forEach(list=>{
            this.props.keyList.forEach((key,i) => {
                (typeof list[key] == 'string') && (list[key] = list[key].replace(/\,/g,''));
                if (i == 0) {
                    this.AllPlanString += list[key]
                } else {
                    this.AllPlanString += ',' + list[key];
                }
            })
            this.AllPlanString += '\r\n';
        })
	}
}

module.exports = exportBill;