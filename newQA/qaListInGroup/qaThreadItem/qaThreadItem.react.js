import React, { useState, useEffect } from 'react';
import tool from 'comp/tool';
import style from './qaThreadItem.less';
const lcns = tool.__classNameWithStyle.bind(tool, style);
import Operation from 'components/changeItem/changeItem.react';
import { getCover } from "data/funcHelper/commonFile";
import QASTATUS from 'definition/js/macro/qaStatus.js';

/**
 * 辅导-全部问题页, 左侧列表(班级内辅导列表)
 * @param {Object} qaList 辅导详情
 * @param {Int} index 当前辅导在列表中的索引, 用户删除辅导操作
 * @param {Boolean} isGroupExpired 当前辅导所在班级是否过期
 * @param {Function} onClick 进入辅导详情
 * @param {Function} deleteThread 删除辅导方法
 */
function QaThreadItem({ qaList, index, isGroupExpired, onClick, deleteThread }) {
    let { thread, detail } = qaList, tip = '';
    const [cover, setCover] = useState('')
    const name = thread.sname || '';

    const deleteQA = () => {
        Plaso.showPrompt({
            content: getTrans('deleteQuestionTip'/*确定删除该辅导吗*/),
            btns: [
                {
                    name: getTrans('button_Yes'),
                    func: () => {
                        deleteThread(thread, index);
                    }
                },
                { name: getTrans('button_Cancel') }
            ]
        })
    }


    if (thread.status & QASTATUS.TEACHER_REPLIED) {
        tip = getTrans('alreadyAnswer'/*已回答*/)
    } else {
        if (
            isGroupExpired || !thread.active
        ) {
            tip = getTrans('expired'/*已失效*/)
        } else {
            tip = getTrans('noAnswer'/*未回答*/)
        }
    }

    const enter = () => { onClick(thread) }

    useEffect(() => {
        if (detail[0] && detail[0].locationPath && detail[0].cover) {
            getCover(detail[0]).then(cover => {
                setCover(cover)
            })
        }
    }, [])

    return (
        <li
            className={lcns(['qaThreadItem'])}
            onClick={enter}
        >
            {cover ? <img className={lcns(['cover'])} src={cover} /> : null}
            <div className={lcns(['mainInfo'])}>
                <h1 className={lcns(['title'])}>
                    {thread.topic}
                </h1>
                <div className={lcns(['detail'])}>
                    <span>{name}</span>
                    <span>{moment(thread.updateTime).format('MM月DD日HH:mm')}</span>
                    <span className={lcns(['expire'])}>{tip}</span>
                </div>
            </div>
            <Operation item={[{ title: getTrans('delete'), event: deleteQA }]} className={lcns(['operation'])} />
        </li>
    )
}

export default QaThreadItem;