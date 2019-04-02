import React from 'react';
import Icon from 'comp/icon.react';
import style from './tagInput.less';
import tool from 'comp/tool';
const lcns = tool.__classNameWithStyle.bind(tool, style);
import bossServer from 'data/func/boss';
import {OverlayTrigger,Tooltip} from 'react-bootstrap';
import check from 'comp/func/check';
import ss from 'app/func/solveString.react.js';
import {inject, observer} from "mobx-react";

@inject("labelStore")
@observer
class TagInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTags : [],
            tags:[]
        }
    }
    handleTagInput(e) {
        let inputValue = e.target.value;
        if (ss.getByteLen(inputValue) > 16) {
			Plaso.notification.addNoteItem({ 
				content: (
                    <span>
                        <Icon icon="icon-icon-careful"/>
                        <span style={{paddingLeft:'10px'}}>{getTrans('biaoqianguochang'/*标签超过规定长度,请修改*/)}</span>
                    </span>
                ),
				type: 'warn'
			}, true);
            e.target.value = inputValue.substring(0, 16);
			return;
		}
        if (check.isEmpty(inputValue, true)) {
            this.setState({
                searchTags: [],
                showSearchTags: true
            })
        } else {
            clearTimeout(this.inputTagTimer);
            this.inputTagTimer = setTimeout(() => {
                bossServer.searchLabels({ label_name: inputValue }).then((res) => {
                    if (res.code == 0) {
                        this.setState({ 
                            searchTags: res.obj.labels,
                            showSearchTags: true
                        });
                    }
                });
            }, 1000);
        }
    }
    addInputTag(tag) {
        let oldTags = this.state.tags;
        if (oldTags.length > 9) {
			Plaso.notification.addNoteItem({content: getTrans('mostTenTagsOnce'/*'一次最多添加十个标签'*/), type: 'warn', autoClose: true}, true);
			return;
		}
        for (let i = 0, l = oldTags.length; i < l; i++) {
            if (tag.my_id == oldTags[i].my_id) {
                return;
            }
        }
        this.setState({
            searchTags: [],
            tags: [...oldTags, tag]
        });
        this.props.addInputTag([...oldTags, tag])
        this.inputRef.value = ''
    }
    componentDidMount() {
        this.fetchTags();
    }
    fetchTags() {
        this.props.labelStore.getLastLabel(5).then(latestTags => {
            this.setState({ latestTags });
        })
    }
    deleteTag (tag) {
        for (var i = 0; i < this.state.tags.length; i++) {
            var targetTag = this.state.tags[i];
            if (targetTag.my_id == tag.my_id) {
                this.state.tags.splice(i, 1);
                this.setState({
                    tags: this.state.tags
                })
                this.props.addInputTag(this.state.tags)
                break;
            }
        }
    }
    toggleSearchTags = (isshow) => {
        setTimeout(() => {
            this.setState({showSearchTags: isshow});
        }, 300);
    }
    handleTagKeyUp = (e) => {
		let elem = e.target.value.trim();
        let keyValue, tags = this.state.tags;
		if (elem.length > 0) {
			keyValue = elem[elem.length - 1];
		}
		if (e.keyCode != 13 && e.keyCode != 188 && keyValue != '，') {
			return;
		}
		if (tags.length > 9) {
			Plaso.notification.addNoteItem({content: getTrans('mostTenTagsOnce'/*'一次最多添加十个标签'*/), type: 'warn', autoClose: true}, true);
            e.target.value = '';
			return;
		}
		if (e.keyCode == 188 || keyValue == '，') {
			elem = elem.substring(0, elem.length - 1);
		}
		if (elem.length == 0) {
			e.target.value = '';
			return;
		}
        for (let i = 0, l = tags.length; i < l; i++) {
            if (tags[i].label_name == elem) {
                e.target.value = '';
                return;
            }
        }
		tags.push({my_id: Date.now(), label_name: elem, userInput: true});
		this.setState({tags});        
        e.target.value = '';
        this.props.addInputTag(tags)
    }
    render() {
        var { searchTags, tags, latestTags, showSearchTags } = this.state;
        var {showLatestTags} = this.props;
        var tagsDOM = null,searchTagsDOM = null,latestTagsDOM;
        if (tags) {
            tagsDOM = tags.map(tag => {
                return (
                    <li key={tag.my_id} className={lcns(['input-tag'])}>
                        <span>{tag.label_name}</span>
                        <Icon icon='icon-close' onClick={this.deleteTag.bind(this,tag)}/>
                    </li>
                )
            })
        }
        if (showSearchTags && searchTags && searchTags.length > 0) {
            searchTagsDOM = (
                <ul className={lcns(['search-tags'])}>
                    {
                        searchTags.map(tag => {
                            return (
                                <li key={tag.my_id} className={lcns(['search-tag'])} onClick={this.addInputTag.bind(this, tag)}>
                                    {tag.label_name}
                                </li>
                            )
                        })
                    }
                </ul>
            )
        }
        if (showLatestTags && latestTags) {
            let latestTagsList = latestTags.map(tag => {
                return (
                    <div key={tag.my_id} className={lcns(['latest-tag'])} onClick={this.addInputTag.bind(this, tag)}>
                        <OverlayTrigger overlay={<Tooltip id={'tooltip' + tag.my_id}>{tag.label_name}</Tooltip>} placement='bottom' delayShow={300} delayHide={150}>
                            <div>{tag.label_name}</div>
                        </OverlayTrigger>
                    </div>
                )
            })
            latestTagsDOM = <div className={lcns(['frequent-tags'])}>{latestTagsList}</div>;
        }
        return (
            <div className={lcns(['tagInput'])}>
                <ul className={lcns(['input-tags'])}>
                    {tagsDOM}
                    <input type='text' ref={c => {this.inputRef = c}}
                            onFocus={this.toggleSearchTags.bind(this, true)} 
                            onBlur={this.toggleSearchTags.bind(this, false)} 
                            onChange={this.handleTagInput.bind(this)}
                            onKeyUp={this.handleTagKeyUp} />
                    {searchTagsDOM}
                </ul>
                {latestTagsDOM}
            </div>
        )
    } 
}


module.exports = TagInput;