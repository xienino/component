import React from "react";
import style from "./navigation.less";
import tool from "comp/tool";

const cns = tool.__classNameWithStyle;
const lcns = cns.bind(tool,style);

function Navigation({config={},select,click}=props){
    let optionDOM = [];
    for(let key in config){
        optionDOM.push(
            <div className={lcns(["option",key==select?"active":""])} onClick={()=>click(key)} key={key}>{config[key].title}</div>
        )
    }

    return(
        <div className={lcns(["navigation"])}>
            {optionDOM}
        </div>
    )
}
export default Navigation;