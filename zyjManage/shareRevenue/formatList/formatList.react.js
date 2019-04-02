import React from 'react';
import style from './formatList.less';
import tool from 'comp/tool';
const lcns = tool.__classNameWithStyle.bind(tool, style);
import Icon from 'comp/icon.react';

/**
 * 此组件是为列表页面的统一做准备的
 * @param {Array} titleList 标题列表  
 * @param {Array} dataList 数据列表 
 * @param {String} sortKey 排序类型
 * @param {Function} handleSort 排序方法
 * @param {Number} sortType 排序(正/倒序)顺序
 * @param {Function} showDetail 操作按钮绑定方法 
 * @param {String} className 类名
 */
const FormatList = ({ titleList, dataList, sortKey, handleSort, sortType, showDetail, className })=> {
    let listDom;
    if (dataList.length > 0) {
        listDom = (
            <div className={lcns(['body'])}>
                {dataList.map((li, i) => (
                    <li key={li.index} className={lcns(['item'])}>
                        {titleList.map(item => {
                            let value = li[item.key]
                            if (item.key == 'operate') {
                                value = (
                                    <Icon 
                                        icon='icon-icon-chakan' 
                                        className={lcns(['icon'])} 
                                        onClick={showDetail.bind(null,li)}
                                    />
                                )
                            }
                            return <span className={lcns([item.flex])}>{value}</span>
                        })}
                    </li>
                ))}
            </div>
        )
    } else {
        listDom = getTrans('meiyoushuju'/*无数据*/)   
    }

    return (
        <div className={lcns(['formatList'],[className])}>
            <div className={lcns(['title'])}>
                {titleList.map((li, i) => {
                    let sortIcon, func, iconName;
                    if (li.sortKey) {
                        iconName = 'icon-up1-copy';
                        if (li.sortKey == sortKey) {
                            if (sortType > 0) {
                                iconName = 'icon-up2'
                            } else {
                                iconName = 'icon-down2'
                            }
                        }
                        sortIcon = <Icon icon={iconName}/>
                        func = handleSort.bind(null, li)
                    }
                    return (
                        <li key={i} className={lcns([li.flex])} onClick={func}>
                            {li.name}
                            {sortIcon}
                        </li>
                    )
                })}
            </div>
            {listDom}
        </div>
    )
}

export default FormatList;