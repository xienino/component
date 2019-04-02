import React, { useState, useEffect } from 'react';
import style from './accumulateProfit.less';
import tool from 'comp/tool';
const lcns = tool.__classNameWithStyle.bind(tool, style);
import bs from 'data/func/boss'


const useAccoountIncome = date => {
    const [income, setIncome] = useState(0)

    useEffect(() => {
        bs.getIncomeByTime({
            beginTime: date ? date[0] : undefined,
            endTime: date ? date[1] : undefined,
        }).then(res => {
            res.code == 0 && setIncome((res.obj.income/100).toFixed(2))
        })
    }, [date])

    return income;
}

const AccumulateProfit = ({ date }) => {
    const income = useAccoountIncome(date)
    const totalIcome = useAccoountIncome();
    return (
        <div className={lcns(['accumulateProfit'])}>
            <p>
                {getTrans('newaddIncome'/*新增收益*/)}:
                <span>  {income}{getTrans('yuan')}</span>
            </p>
            <p>
                {getTrans('accumulatedProfit'/*累计收益*/)}:
                <span>  {totalIcome}{getTrans('yuan')}</span>
            </p>
        </div>
    )
}

export default AccumulateProfit;