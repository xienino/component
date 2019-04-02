var React = require('react');
var Icon = require('comp/icon.react');
import style from './selectRadio.less';
import tool from 'comp/tool';
const lcns = tool.__classNameWithStyle.bind(tool, style);


class selectRadio extends React.Component {
    constructor(p) {
        super(p)
        this.state = {
            isdefaultCheck: p.defaultRadio,
            value: p.defautValue,
        }
    }

    handleCheck = flag => {
        if (flag != this.state.isdefaultCheck) {   
            this.setState({
                isdefaultCheck: flag
            })
            this.props.handleRadioChange(flag)
        }
    }

    handleInput = e => {
        this.setState({
            value: e.target.value
        })
        this.props.handleValueChange(e.target.value)
    }

    clearContent = () => {
        this.setState({
            isdefaultCheck: true,
            value: 1,
        })
    }

    render() {
        let { isdefaultCheck, value } = this.state;
        let { checkName, placeholder } = this.props;
        return (
            <div className={lcns(['selectRadio'], [this.props.className])}>
                <div className={lcns(['radio','left'])} onClick={this.handleCheck.bind(this,true)}>
                    <Icon 
                        className={lcns(['icon'])} 
                        icon={isdefaultCheck ? 'icon-duoxuan' : 'icon-duoxuankuang'} 
                    />
                    <span>{checkName[0]}</span>
                </div>
                <div className={lcns(['radio','right'])} onClick={this.handleCheck.bind(this,false)}>
                    <Icon 
                        className={lcns(['icon'])} 
                        icon={isdefaultCheck ? 'icon-duoxuankuang' : 'icon-duoxuan'} 
                    />
                    <span>{checkName[1]}</span>
                    <input 
                        type="number" 
                        className={lcns([isdefaultCheck ? 'hidden' : ''])} 
                        placeholder={placeholder}
                        value={value}
                        min="1"
                        onChange={this.handleInput}
                    />
                </div>
            </div>
        )
    }
}

module.exports = selectRadio;