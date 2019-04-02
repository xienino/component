import React from "react";
import style from "./titleBar.less";
import tool from "comp/tool";

const cns = tool.__classNameWithStyle;
const lcns = cns.bind(tool,style);

function TitleBar(){
    return(
        <div className={lcns(["title"])}>
            <div className={lcns(["name"])}>{getTrans("mingcheng",/*名称*/)}</div>
            <div className={lcns(["funtionDescription"])}>{getTrans("feature",/*功能*/)}</div>
            <div className={lcns(["number"])}>{getTrans("shuliang",/*数量*/)}</div>
            <div className={lcns(["operate"])}>{getTrans("operation",/*操作*/)}</div>
        </div>
    )
}
export default TitleBar;