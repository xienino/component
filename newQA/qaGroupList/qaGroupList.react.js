import React, { useState, useEffect } from 'react';
import tool from 'comp/tool';
import style from './qaGroupList.less';
const lcns = tool.__classNameWithStyle.bind(tool, style);
import groupFunc from 'data/func/group';
import ListItem from './listItem.react';
import AllQaSearch from './allQaSearch/allQaSearch.react';

const QaGroupList = ({ handleEmpty, selectGroup }) => {
    const [groupList, setGroupList] = useState(null)
    const [xx, setxx] = useState('')
    const [activeId, setActiveId] = useState(0)
    const [pageNum, setPageNum] = useState(0)
    var isSearch = false;
    const [isSearch, setIsSearch] = useState(false);
    const [isScrollEnd, setIsScrollEnd] = useState(false)

    const getGroupList = () => {
        groupFunc.getGroupIdHasQa({
            pageSize: 20,
            pageNum,
            xx,
        }).then(res => {
            if (res.obj) {
                if (res.obj.length <= 0) {
                    setIsScrollEnd(true);
                    if (pageNum == 0) {
                        handleEmpty('response');
                        setGroupList([])
                    }
                    return;
                }
                let ids = res.obj.map(li => li.groupId)
                groupFunc.groupInfo({
                    ids,
                }).then(res => {
                    res.code == 0 && solveGroupInfo(res.obj)
                })
            }
        })
    }

    const solveGroupInfo = (list) => {
        let newList = list.map(li => {
            return {
                id: li.id,
                title: li.groupName,
                isExpired: moment(li.activeEnd).valueOf() < moment().valueOf() ? true : false,
            }
        })
        let allList = newList;
        if (isSearch) {
            setGroupList(allList)
        } else {
            let oldList = groupList || [];
            allList = [...oldList, ...newList];
            setGroupList(allList)
        }

        if (!activeId && allList[0]) {
            select(allList[0].id,allList[0].isExpired)
        }
    }

    const select = (id, isExpired) => {
        setActiveId(id)
        selectGroup(id, isExpired)
    }

    const scrollToLoadMore = e => {
        if (e.target.scrollTop == e.target.scrollHeight - e.target.clientHeight && !isScrollEnd) {
            setIsSearch(false)
            setPageNum(pageNum + 1)
        }
    }

    const handleSearch = value => {
        setIsScrollEnd(false);
        setIsSearch(true)
        setPageNum(0)
        setxx(value)
    }

    useEffect(() => {
        getGroupList();
    }, [pageNum,xx])

    if (!groupList) {
        return null
    }

    return (
        <div className={lcns(['qaGroupList'])}>
            <AllQaSearch
                handleSearch = {handleSearch}
                className={lcns(['searchBar'])}
                placeholder={getTrans('searchClass'/*搜索班级*/)}
            />
            <div className={lcns(['list'])} onScroll={scrollToLoadMore}>
                {groupList.map(item => (
                    <ListItem
                        item={item}
                        select={select}
                        className={lcns(['groupItem', activeId == item.id ? 'active' : ''])}
                    />
                ))}
            </div>
        </div>
    )
}

export default QaGroupList;