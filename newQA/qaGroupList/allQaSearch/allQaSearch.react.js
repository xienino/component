import React, { useState, useEffect } from 'react';
import tool from 'comp/tool';
import style from '../../searchThread/searchThreadBar.less';
const lcns = tool.__classNameWithStyle.bind(tool, style);
import Icon from 'comp/icon.react';

/**
 * 该搜索组件可实时延迟搜索, 延迟时间为1000ms, 目前在‘辅导-全部问题’里使用
 * @param {Function} handleSearch 搜索后的回调
 * @param {String} className 类名
 * @param {String} placeholder input的placeholder文字
 */
module.exports = ({ handleSearch, className, placeholder }) => {
    const [xx, setxx] = useState('')
    let searchTimer;

    const search = (e) => {
        var value = e.target.value;
        setxx(value)
        if (value == '') {
            handleSearch('')
        } else {
            if (searchTimer) {
                clearTimeout(searchTimer);
            }
        }
    }

    useEffect(() => {
        searchTimer = setTimeout(() => {
            xx && handleSearch(xx)
        }, 1000)
    }, [xx])

    return (
        <div className={lcns(['searchThreadBar'], [className])}>
            <Icon icon='icon-icon_search' className={lcns(['icon'])} />
            <input
                value={xx}
                type="text"
                placeholder={placeholder}
                className={lcns(['input'])}
                onChange={search}
            />
        </div>
    );
}