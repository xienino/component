var React = require('react');
var radioManager = require("comp/tabs.react");
var Container = radioManager.c;

class content extends React.Component {
    render() {
		return (
			<Container topic="zyjContent"/>
		);
	}
}

module.exports = content;