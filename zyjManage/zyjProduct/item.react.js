var React = require('react');
var Content = require("./zyjProduct.react");
class Item extends React.Component {
	constructor(p) {
		super(p)
		this.title = getTrans('xinzengshangp'/*新增商品*/);
	}
	getContent = () => {
		return { 
			elem: Content, 
			props: { 
				title: this.title,
				operType: 'add',
			} 
		};
	}
	render = () => {
		return (
			<div className="item">
				<span className="listTitle">{this.title}</span>
			</div>
		);
	}
}

module.exports = Item;