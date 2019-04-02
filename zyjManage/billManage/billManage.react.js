import React from 'react';
import BillManageBase from '../../financialManage/billManageBase.react.js';
import bs from 'data/service/boss';

//分校账单管理首页
class BillManage extends BillManageBase {
	componentWillMount() {
		this.type = 'zyj';
		this.keyList = ['index','time','formatRecorde','liveType','name'];
		this.titleKeyList = ['编号','时间','收支记录(元)','类型','批改老师']
		this.searchTip = '批改老师';
		this.getDataList(0)
	}

	getDataList(currentPage) {
		var params = {
			orgId: this.orgId,
			beginTime: moment(this.currentDate).startOf('month').valueOf(),
			endTime: moment(this.currentDate).endOf("month").valueOf(),
			pageStart: currentPage,
			pageSize: this.pageSize,
			xx: this.xx,
		}

		bs.getZyjShouzhiRecord(params).then(res => {
			if (res.code == 0) {
				this.pageLength = Math.ceil(res.total / this.pageSize);
				this.solveList(res.obj,currentPage);
				this.setState({
					dataList: res.obj, 
					currentPage: currentPage
				});
			}
		})
	}

	solveList = (obj,currentPage) => {
		obj.forEach((li,index) => {
			li.index = currentPage*this.pageSize + index + 1;
			li.time = moment(li.createTime).format('YYYY-MM-DD');
			var sign = '';
			if (li.optType == 'deposit' && li.value >= 0) {
				sign = '+';
			} else if (li.optType == 'consume' && li.value >= 0) {
				sign = '-';
			}
			li.formatRecorde = `${sign}${moneyFormat(li.value/100)}`;
			li.liveType = li.optType == 'deposit'?'充值':getTrans('exercise'/*作业*/)
			li.name = li.optType == 'deposit'? '-': li.teacherRealName;
		})
	}

	showConsumeRecord(index, e) {
		e.stopPropagation();
		if (index != this.state.selectedIndex) {
			this.setState({
				selectedIndex: index,
				isShowDetailView: true,
			})
		} else {
			this.setState({
				isShowDetailView: !this.state.isShowDetailView,
			})
		}
	}

	export = () => {
		var self = this;
		var pageStart = 0;
		var list = [];
		function _getDataList() {
			var params = {
				orgId: self.orgId,
				beginTime: moment(self.currentDate).startOf('month').valueOf(),
				endTime: moment(self.currentDate).endOf("month").valueOf(),
				pageStart: pageStart,
				pageSize: 200,
				xx: '',
			};
			bs.getZyjShouzhiRecord(params).then(res => {
				if (res.code == 0) {
					self.solveList(res.obj,pageStart);
					list = [...list,...res.obj]
					if (list.length >= res.total) {
						var Export = require('./exportZyjBill.react');
						Plaso.moredlg(<Export dataList={list} itemTitle={self.titleKeyList} keyList={self.keyList}/>);
						return;
					}
					pageStart++;
					_getDataList();
				}
			})
		}
		_getDataList();
	}
}

module.exports = BillManage;