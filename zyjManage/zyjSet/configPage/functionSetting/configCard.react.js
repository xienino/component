import React, { useState, useEffect } from "react";
import style from "./configCard.less";
import tool from "comp/tool";
import Icon from "comp/icon.react";
const cns = tool.__classNameWithStyle;
const lcns = cns.bind(tool, style);
import orgFunc from "data/func/boss";

const ConfigCard = ({ name, description, unit, keyName, calculate, range }) => {
    let cal =calculate || 1;
    const [edit, setEdit] = useState(false);
    const [number, setNumber] = useState(Plaso.myOrgSettings[keyName]/cal);
    const inputRef = React.createRef();

    const numberFunc = e => {
        e.stopPropagation();
        setNumber(e.target.value)
    }

    const keyEvent = e => {
        if (e.keyCode == 13) {
            e.preventDefault();
            sureToSetChange(SVGAnimatedNumber);
        }
    }

    const sureToSetChange = () => {
        if (number === "") {
            Plaso.showPrompt({
                content: getTrans("minimumAllocationIllegal"/*设置不能为空*/),
                btns: [{ name: getTrans("ok"), func: () =>  inputRef.current.focus() }]
            })
        } else if (range && (number > range.max || number < range.min)) {
            var tip = ''
            if (range.max !== undefined) {
                tip += '最大'+range.max+' '
            }
            if (range.min !== undefined) {
                tip += '最小'+range.min+' '
            }
            Plaso.showPrompt({
                content: getTrans("numberRangSetTip"/*请设置{1}的数值*/,tip),
                btns: [{ name: getTrans("ok"), func: () =>  inputRef.current.focus() }]
            })
        } else {
            orgFunc.setZyjOrgSetting({ 
                [keyName]: Number(number*cal)
            }).then(res => {
                setEdit(false)
                Plaso.myOrgSettings[keyName] = Number(number*cal)
            })
        }
    }
    
    return (
        <div className={lcns(["configCard"])}>
            <div className={lcns(["name"])}>{name}</div>
            <div className={lcns(["funtionDescription"])}>{description}</div>
            <div className={lcns(["number"])}>
                {edit ? 
                    <input 
                        type="number" 
                        autoFocus 
                        value={number} 
                        type="text" 
                        onChange={numberFunc} 
                        ref={inputRef}
                        onBlur={sureToSetChange} 
                        onKeyDown={keyEvent} 
                        className={lcns(["input"])} 
                    />
                : number}
                {unit || ''}
            </div>
            <div className={lcns(["operate"])} onClick={() => setEdit(true)}>
                <Icon icon="icon-edit" />
            </div>
        </div>
    )
}
export default ConfigCard;