import React, { useState } from 'react';
import style from './shareRevenue.less';
import tool from 'comp/tool';
const lcns = tool.__classNameWithStyle.bind(tool, style);
import DatetimeRangePicker from 'components/bootstrap-datetimerrangepicker.react';
import SearchZyjUser from './searchZyjUser/searchZyjUser.react';
import IncomeList from './incomeList/incomeList.react';
import AccumulateProfit from './accumulateProfit/accumulateProfit.react';
import BottomBar from './bottomBar/bottomBar.react'

const shareRevenueWrap = ({ title }) => {
    return (
        <div className={lcns(['shareRevenueWrap'])}>
            <Directory title={title} />
            <ShareRevenue />
        </div>
    )
}

const ShareRevenue = () => {
    const [date, setDate] = useState([moment().subtract(29, 'days').valueOf(), moment().valueOf()])
    const [userInfo, setUserInfo] = useState({});
    const [pageStart, setPageStart] = useState(0)
    const [total, setTotal] = useState(0);
    const datePickerBar = React.createRef();
    const pageSize = 10;

    const handleCoreDataPicker = time => {
        setPageStart(0)
        setDate([(time.startDate).valueOf(),(time.endDate).valueOf()])
    }

    const searchUser = user => {
        setPageStart(0)
        setUserInfo({
            id: user.id,
            userType: user.userType
        })
    }

    return (
        <div className={lcns(['shareRevenue'])}>
            <div className={lcns(['operateBar'])} ref={datePickerBar}>
                <DatetimeRangePicker
                    startDate={moment(date[0]).format('YYYY-MM-DD')}
                    endDate={moment(date[1]).format('YYYY-MM-DD')}
                    onApply={handleCoreDataPicker}
                    className="form-control"
                    opens="right"
                    widgetParent={datePickerBar.current}
                    domPosition={{ float: 'left' }}
                />
                <AccumulateProfit date = {date} />
                <SearchZyjUser searchUser={searchUser} className={lcns(['SearchZyjUser'])} />
            </div>
            <div className={lcns(['incomeListWrap'])}>
                <IncomeList
                    date = {date}
                    userInfo={userInfo}
                    pageStart={pageStart}
                    pageSize={pageSize}
                    getTotal={num => setTotal(num)}
                    className={lcns(['formatList'])}
                />
                <BottomBar 
                    total={total} 
                    pageStart={pageStart}
                    pageSize={pageSize} 
                    setCurrentPage={page => setPageStart(page - 1)} 
                />
            </div>
        </div>
    )
}

const Directory = ({ title }) => {
    return (
        <div className={lcns(['directory'])}>
            <span className={lcns(['primary'])}>{getTrans('zyjManage'/*作业记管理*/)}</span>
            /
            <span className={lcns(['secondary'])}>{title}</span>
        </div>
    )
}

module.exports = shareRevenueWrap;