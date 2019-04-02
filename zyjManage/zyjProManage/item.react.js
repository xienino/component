import React from 'react';
import Content from '../../onlineSchool/productManage/productManage.react';
import { TYPE } from 'definition/js/macro/ProductConst.js';
class Item extends React.Component {
	constructor(p) {
		super(p)
		this.title = getTrans('shangpingguanli');
	}
	getContent() {
		return {
            elem: Content, 
            props: {
                title: this.title,
                type: [TYPE.YUEKA],
            }
        };
	}
    render() {
		return (
			<div className='item'>
				<span className='listTitle'>{this.title}</span>
			</div>
		);
	}
}

module.exports = Item;