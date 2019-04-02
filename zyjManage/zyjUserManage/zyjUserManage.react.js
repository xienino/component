var React = require('react');
import bossServer from 'data/func/boss';
import UserManage from 'accountManage/baseUser/userManage/userManage.react';
import { USERTYPE, SORTTYPE } from 'app/const';
import style from '../../accountManage/baseUser/userManage/userManage.less';
var tool = require('comp/tool');
const lcns = tool.__classNameWithStyle.bind(tool, style);
import Icon from 'comp/icon.react';
import {inject, observer} from "mobx-react";

@inject("gradeStore")
@observer
class zyjUserManage extends UserManage {
	constructor(){
		super();
		this.state.currentSortType = undefined;
        this.placeholder = getTrans('xingmingdianhua'/*姓名/电话*/);
	}

	getUserType = () => {
		this.userType = USERTYPE.ZYJ;
		this.title = 'zyjxuesheng';
		this.listTitle = [
			{
				name: getTrans("bianhao"/*编号*/),
				flex: 1,
			}, {
				name: getTrans('name'),
				canSort: true,
				sortType: SORTTYPE.ZYJ_NAME,
				flex: 2,
			}, {
				name: getTrans('grade'),
				flex: 2,
			}, {
				name: getTrans('lianxidianhua'),
				flex: 2,
			}, {
				name: getTrans('zuihoudenglushijian'),
				canSort: true,
				sortType: SORTTYPE.ZYJ_LASTLOGIN,
				flex: 2,
			}, {
				name: getTrans('tijiaozuoyeshu'/*提交作业数*/),
				canSort: true,
				sortType: SORTTYPE.ZYJ_ZYCOUNT,
				flex: 2,
			}
		]
		this.colums = ['index', 'name', 'grade', 'mobile', 'lastLogin', 'zyCount']
		var btns = (
			<div className={lcns(['buttonBar'])}>
				<button className={`${lcns(['lightBtn','lightBtnLeft'])} btn btn-default`} onClick={this.exportToFile}>
					<Icon className={lcns(['icon'])} icon="icon-export" />
					{getTrans("quanbudaochu"/*全部导出*/)}
				</button>
			</div>
		)
		this.setState({
			btns: btns,
		})
    }

	init = () => {
		this.getZyjUser();
    };

	getZyjUser = () => {
		var params = {
			pageSize: this.state.pageSize ,
			pageStart: this.state.currentPage -1,
			sortKey: this.state.currentSortType,
			sortType: this.state.currentIsSortDesc?-1:1,
			searchKey: this.state.searchKeyWord
		}
        bossServer.getZyjUser(params).then((res)=>{
            this.setState({
				userObj:  {
					number: res.total,
					userList: res.obj,
				}
			})
        })
	};

	exportToFile = () => {
		var ExportStu = require('./exportZyjUser.react');
        Plaso.moredlg(<ExportStu />);
	}
}

module.exports = zyjUserManage;