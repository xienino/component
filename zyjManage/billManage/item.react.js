import React , { Component } from 'react';
import Content from './billManage.react';

class Item extends Component {
	constructor(props) {
		super(props);
		this.title = getTrans('bill_management'/*账单管理*/);
	}

	getContent() {
		return {elem: Content, props: {title: this.title}};
	}

	render() {
		return (
			<div className="item dataManage">
				<span className="listTitle">
					{this.title}
				</span>
			</div>
		);
	}
}

module.exports = Item;