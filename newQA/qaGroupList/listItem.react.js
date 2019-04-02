import React from 'react';
import tool from 'comp/tool';
import style from './qaGroupList.less';
const lcns = tool.__classNameWithStyle.bind(tool, style);

function ListItem({ item, select, className } ) {
    const { id, isExpired, title } = item;
    const selectItem = () => {
        select(id, isExpired)
    }

    return (
        <li className={lcns(['itemWrap'], [className])} key={id} >
            <div className={lcns(['item'])} onClick={selectItem}>
                <span className={lcns(['name'])}>{title}</span>
                <span className={lcns(['expireTip'])}>{isExpired ? getTrans('alreadyOverdue'/*已过期*/) : ''}</span>
            </div>
        </li>
    )
}

module.exports = ListItem;