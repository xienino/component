import React, { useState, useEffect } from 'react';
import tool from 'comp/tool';
import style from './qaListInGroup.less';
const lcns = tool.__classNameWithStyle.bind(tool, style);
import BigDirectory from 'data/func/bigDirectory.js';
import QaThreadItem from './qaThreadItem/qaThreadItem.react';
import groupFunc from 'data/func/group';
import qaStore from 'newQA/qaStore/qaStore';

function getDateString(momentObj) {
    var m_today = moment(), m_yesterday = moment().add(-1, 'day');
    if (momentObj.isSame(m_today, 'day')) {
        return getTrans('today');
    } else if (momentObj.isSame(m_yesterday, 'day')) {
        return getTrans('yesterday');
    } else {
        return momentObj.format('YYYY-MM')
    }
}

const QaListInGroup = ({ groupId, className, isGroupExpired, onClick }) => {
    const [list, setList] = useState([])
    const [isScrollEnd, setIsScrollEnd] = useState(false)
    const [pageNum, setPageNum] = useState(0)
    let len = 10;

    useEffect(() => {
        init(0);
        setPageNum(0)
    }, [groupId])

    const init = (page,id = groupId) => {
        let start = page ? page * len : 0;
        BigDirectory.getQAthreadForM({
            start,
            len,
            groupId: id,
        }).then((res) => {
            if (res.msg.length <= 0) {
                setIsScrollEnd(true);
                if (start == 0) {
                    setList([])
                }
                return;
            }

            if (!qaStore.scList) {
                qaStore.scList = "";
                getGroupStudents().then(studentList => {
                    checkStudentInClass(studentList);
                });
            } else {
                let studentList, hasFind;
                var tsc = JSON.parse("[" + qaStore.scList.substring(0, qaStore.scList.length - 1) + "]");
                for (var i = 0, l = tsc.length; i < l; i++) {
                    var ele = tsc[i]
                    if (ele.GroupId == groupId) {
                        hasFind = true;
                        studentList = ele.studentList;
                    }
                }
                if (!hasFind) {
                    getGroupStudents().then(studentList => {
                        checkStudentInClass(studentList);
                    });
                } else {
                    checkStudentInClass(studentList);
                }
            }

            function getGroupStudents() {
                return new Promise(resolve => {
                    groupFunc.getGroupStudent({ groupId: groupId }).then((result) => {
                        let studentList = result.students || [];
                        var tSL = studentList.map(ele => {
                            return ele.id
                        })
                        qaStore.scList += (JSON.stringify({ GroupId: groupId, studentList: tSL }) + ",");
                        resolve(tSL);
                    })
                })
            }

            function checkStudentInClass(students) {
                res.msg.forEach(qa => {
                    qa.thread.active = students.some(student => qa.thread.studentId === student);
                })

                if (start) {
                    setList([
                        ...list,
                        ...res.msg
                    ])
                } else {
                    setIsScrollEnd(false)
                    setList(res.msg)
                }
            }
        })
    }

    const deleteThread = (thread, index) => {
        let bigDir = require('data/func/bigDirectory');
        bigDir.hideQaThread({qaId: thread.id}).then(() => {
            let newList = [...list]
            newList.splice(index, 1)
            setList(newList)
        })
    }

    const scrollToLoadMore = e => {
        if (e.target.scrollTop == e.target.scrollHeight - e.target.clientHeight && !isScrollEnd) {
            init(pageNum + 1)
            setPageNum(pageNum + 1)
        }
    }

    let listsDOM = [], string_lastDate;

    list.forEach((li, index) => {
        var m_currentItemCreate = moment(li.thread.createAt, 'YYYY-MM-DD HH:mm:ss ZZ');
        if (!string_lastDate || string_lastDate != getDateString(m_currentItemCreate)) {
            listsDOM.push(
                <li className={lcns(['dateTipsLine'])}>
                    <span>{getDateString(m_currentItemCreate)}</span>
                    {tool.getWeekDay(moment(m_currentItemCreate).weekday() + 1)}
                </li>
            )
        }
        listsDOM.push(
            <QaThreadItem
                key={li.thread.id}
                isGroupExpired={isGroupExpired}
                onClick={onClick}
                qaList={li}
                index={index}
                deleteThread={deleteThread}
            />
        )
        string_lastDate = getDateString(m_currentItemCreate);
    })

    return (
        <div className={lcns(['qaListInGroup'],[className])} onScroll={scrollToLoadMore}>
            {listsDOM}
        </div>
    )
}


export default QaListInGroup;