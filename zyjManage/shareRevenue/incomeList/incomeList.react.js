import React, { useState, useEffect } from 'react';
import bs from 'data/service/boss';
import FormatList from '../formatList/formatList.react';
import zyjUser from 'data/service/zyjUser';

const titleList = [
    {
        name: getTrans('bianhao'/*编号*/),
        flex: 'flex4',
        key: 'index',
    }, {
        name: getTrans('shareMan'/*分享人*/),
        flex: 'flex9',
        key: 'nUserName',
    }, {
        name: getTrans('watchMan'/*围观人*/),
        flex: 'flex10',
        key: 'lookerName',
    }, {
        name: getTrans('watchTime'/*围观时间*/),
        sortKey: 1,
        flex: 'flex10',
        key: 'formatTime',
    }, {
        name: getTrans('watchPay'/*围观支出*/),
        flex: 'flex6',
        key: 'amountYuan',
    }, {
        name: getTrans('profit'/*收益*/),
        flex: 'flex6',
        key: 'divide',
    }, {
        name: getTrans('correctTeacher'/*批改老师*/),
        flex: 'flex7',
        key: 'teacherName',
    }, {
        name: getTrans('operation'/*操作*/),
        flex: 'flex5',
        key: 'operate',
    }
];

const showZyjDetail = obj => {
    var file = Object.assign({
        name: getTrans('zyjDetail'/*作业详情*/)
    }, obj);
    file._id = {
        shareKey: file.fileId,
        type: 5,
    };
    Plaso.playCommonFile(file);
}

const IncomeList = ({ date, userInfo, pageStart, pageSize, className, getTotal }) => {
    const [dataList, setDataList] = useState([])
    const [sortKey, setSortKey] = useState(0)
    const [sortType, setSortType] = useState(-1)

    useEffect(() => {
        bs.incomeDetail({
            pageSize,
            pageStart,
            startTime: date[0],
            endTime: date[1],
            userId: userInfo.id,
            userType: userInfo.userType,
            sortType,
            sortKey,
        }).then(res => {
            if (res.code == 0) {
                if (res.obj.rs.length > 0) {
                    solveList(res.obj.rs)
                } else {
                    setDataList([])
                }
                getTotal(res.obj.total)
            }
        })
    }, [pageStart, date, userInfo, sortType, sortKey])

    const solveList = rs => {
        let promiseArr = [];
        rs.forEach((li, i) => {
            li.index = pageSize * pageStart + i + 1;
            li.formatTime =  moment(li.createTime).format('YYYY-MM-DD HH:mm');
            li.divide = (li.rate * li.amount / 10000 ).toFixed(2);
            li.amountYuan = li.amount/100;
            promiseArr.push( new Promise(resolve => {
                zyjUser.getNewUserInfo({ 
                    id: li.userId
                }).then(el => {
                    resolve(el.obj);
                    Object.assign(li, el.obj);
                });
            }));
            promiseArr.push( new Promise(resolve => {
                zyjUser.getTeacherInfo({
                    id: li.teacherId
                }).then(el => {
                    resolve(el.obj);
                    Object.assign(li, el.obj);
                })
            }))
            promiseArr.push( new Promise(resolve => {
                zyjUser.getLookerInfo({
                    id: li.lookerId
                }).then(el => {
                    resolve(el.obj);
                    Object.assign(li, el.obj);
                })
            }))
            Promise.all(promiseArr).then(list => {
                setDataList(rs)
            })
        })
    }

    const handleSort = item => {
        setSortKey(item.sortKey)
        setSortType(-sortType)
    }

    return (
        <FormatList
            titleList={titleList}
            dataList={dataList}
            sortKey={sortKey}
            sortType={sortType}
            handleSort={handleSort}
            showDetail={showZyjDetail}
            className={className}
        />
    )
}


export default IncomeList;