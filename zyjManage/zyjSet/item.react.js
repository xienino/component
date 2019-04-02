var React = require('react');
var Content = require("./zyjSet.react");
class Item extends React.Component {
	constructor(p) {
		super(p)
		this.title = getTrans('zyjSet'/*作业记设置*/);
	}
	getContent = () => {
		return { 
			elem: Content, 
			props: { 
				title: this.title
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