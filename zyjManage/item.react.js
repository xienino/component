var React = require('react');
var Content = require("./zyjManage.react");
var radioManager = require("comp/tabs.react");
var Tabs = radioManager.t;
var Icon = require("comp/icon.react");
var ZyjUser = require("./zyjUserManage/item.react");
var ZyjProduct = require("./zyjProduct/item.react");
var ProManage = require("./zyjProManage/item.react");
var OrderTrack = require("../onlineSchool/orderTracking/item.react");
var ZyjSet = require("./zyjSet/item.react");
import BillManage from './billManage/item.react';
import ShareRevenue from './shareRevenue/item.react';

class Item extends React.Component {
	constructor(p) {
		super(p)
		this.title = getTrans('zyjManage'/*作业记管理*/);
		this.state = {
			isSubTabsShow: false
		}
	}

    getContent = () => {
		return {elem: Content, props: {title: this.title}};
	}

    selected = (state) => {
		state = state || {}
		state.isSubTabsShow=true
		this.setState(state)
	}

    unselected = () => {
		this.setState({
			isSubTabsShow: false
		})
	}

    render = () => {
		if (this.state.isSubTabsShow) {
			var subTabsDOM = (
				<Tabs className="subTab" topic="zyjContent" ref="tabs">
					<ZyjUser deflt/>
                    <ZyjProduct />
                    <ProManage />
                    <OrderTrack type="zyj"/>
					<ZyjSet />
                    {Plaso.myOrgSettings.zyjCustom && Plaso.myOrgSettings.zyjCustom.zyjShare?
                    <ShareRevenue />
                    :null}
					<BillManage />
				</Tabs>
			);
		} else {
			subTabsDOM = '';
		}
		return (
			<div className="item">
				<span className="listTitle">
					<Icon icon="icon-work" className="zyjIcon"/>
					<Icon icon="icon-work-white" className="zyjIcon active"/>
					{this.title}
					<Icon icon="icon-chevronup" className="open active"/>
					<Icon icon="icon-chevrondown" className="open"/>
				</span>
				{subTabsDOM}
			</div>
		);
	}
}

module.exports = Item;