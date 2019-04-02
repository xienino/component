var React = require('react');
var Content = require('./zyjUserManage.react');

class RegisterUserItem extends React.Component {
    constructor(props) {
        super(props);
        this.title = getTrans("zyjxuesheng"/*作业记学生*/)
    }

    getContent = () => {
        return { elem: Content, props: { key: this.title, title: this.title } };
    }

    render = () => {
        return (
            <div className="item">
                <span className="listTitle">{this.title}</span>
            </div>
        );
    }
}

module.exports = RegisterUserItem;