import React from 'react';
import Icon from 'comp/icon.react';
import style from './search.less';
import tool from 'comp/tool';
const lcns = tool.__classNameWithStyle.bind(tool, style);
import { debounce } from 'app/func/debounce.js';

/**
 * props.placeholder: 默认input placeholder
 * search: 返回搜索value的方法
 * className: 控制输入框样式
 * associate: 是否输入即搜索
 * totalValue: 是否获取全部选择信息
 */
class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            isOpen: false,
            list: [],
        }
        this.debounceFunc = props.associate? debounce(props.search, 300) : null;
    }
    setOpenStateFalse = () => {
		this.setState({
			isOpen: false
		})
	};

    componentDidMount() {
		document.addEventListener('click', this.setOpenStateFalse);
	}

    componentWillUnmount() {
		document.removeEventListener('click', this.setOpenStateFalse);
    }
    
    clickInput = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        if (!this.state.isOpen) {
            this.setState({
                isOpen: true
            })
        }
    }
    handleInput = e => {
        this.debounceFunc && this.debounceFunc(e.target.value)
        this.setState({
            inputValue: e.target.value,
        })
    }
    returnSearch = (e) => {
        if (e.keyCode == 13) {
            this.search()
        }
    }
    setList = (value) => {  //父组件传入list
        this.setState({
            list: value
        })
    }
    clearValue = () => {    //父组件清数据框
        this.setState({
            inputValue: ''
        })
    }
    search = () => {
        this.props.search(this.state.inputValue)
    }
    chooseSearchLi = (value) => {
        if (this.props.totalValue) {
            this.props.searchUser(value);
        } else {
            this.props.searchUser(value.id);
        }
        this.setState({
            inputValue: value.name
        })
    }
   
    render () {
        if (this.state.list.length > 0 && this.state.isOpen) {
            var searchListDom = (
                <ul className={lcns(['searchListDom'])}>
                    {this.state.list.map(li => 
                        <li key={li.id} className={lcns(['searchListi__li'])} onClick={this.chooseSearchLi.bind(this,li)}>
                            {li.name}
                        </li>)
                    }
                </ul>
            )
        }
        return (
            <div className={lcns(['search'],[this.props.className])}>
                <input 
                    placeholder={this.props.placeholder} 
                    onChange={this.handleInput} 
                    value={this.state.inputValue} 
                    onKeyDown={this.returnSearch}
                    onClick={this.clickInput}
                />
                <div className={lcns(['doSearch'])} onClick={this.search}>
                    <Icon icon="icon-search" className={lcns(['alicon'])}/>
                </div>
                {searchListDom}
            </div>
        );
    }
}

module.exports = Search