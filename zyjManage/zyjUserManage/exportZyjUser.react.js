import BaseExport from '../../accountManage/exportToFile/baseExport.react';
import bossServer from 'data/func/boss';
import {inject, observer} from "mobx-react";

@inject("gradeStore")
@observer
class exportZyjUser extends BaseExport {
    componentWillMount() {
        this.func = 'getZyjUserlist';
        this.title = '作业记学生';
        this.itemList = ['index','name','grade','mobile','lastLogin','zyCount'];
        this.itemTitle = getTrans("outputZyjUserTitles") + '\r\n';
    }

    getZyjUserlist = () => {
		var me = this;
		let tempList = [];
		let currentPage = 0;
		let pageSize = 200;
		function _getZyjUserlist(){
			bossServer.getZyjUser({
				pageStart: currentPage,
				pageSize: pageSize,
			}).then(result=>{
				tempList = [...tempList,...result.obj];
				if(tempList.length >= result.total){
					var allList = tempList.map((item) => {
						return item;
					})
					me.setState({
						dataList: tempList,
						allList: allList
					})
					return;
				}
				currentPage++;
				_getZyjUserlist();
			})
		}
		_getZyjUserlist();
	};
}

module.exports = exportZyjUser;