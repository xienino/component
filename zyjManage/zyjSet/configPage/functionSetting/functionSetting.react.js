import React, {useState, useEffect} from "react";
import style from "./functionSetting.less";
import tool from "comp/tool";
import TitleBar from "./titleBar.react";
import ConfigCard from "./configCard.react";

const cns = tool.__classNameWithStyle;
const lcns = cns.bind(tool,style);

const FunctionSetting = () => {
    return(
        <div className={lcns(["content"])}>
            <div className={lcns(["wrap"])}>
                <TitleBar />
                <ConfigCard 
                    name={getTrans("minimumAllocation",/*最低分配数*/)}
                    description={getTrans("minimumAllocationDescription",/*商品绑定多个老师时，每个老师最低被分配的学生数量*/)}
                    keyName={'minDealCount'}
                    range={{min: 0}}
                />
                {Plaso.myOrgSettings.zyjCustom && Plaso.myOrgSettings.zyjCustom.zyjShare?[
                <ConfigCard 
                    name={getTrans("onLookerSpend",/*围观花费*/)}
                    description={getTrans("amountLookersNeedToPayToWatch",/*围观人观看付费分享作业所需支付的金额*/)}
                    unit={getTrans("yuan",/*元*/)}
                    keyName={'shareAmount'}
                    calculate={100}
                    range={{min: 0}}
                />,
                <ConfigCard 
                    name={getTrans("dividendRate",/*分成比例*/)}
                    description={getTrans("proportionOfIncomeOrgReceiveForEachCost",/*每份围观花费中机构将获得的收入比例*/)}
                    unit={'%'}
                    keyName={'shareRate'}
                    range={{max: 100,min: 0}}
                />
                ]:null}
            </div>
        </div>
    )
}
export default FunctionSetting;