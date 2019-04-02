var React = require('react');
var Icon = require('comp/icon.react');
import style from './zyjSet.less';
import tool from 'comp/tool';
const lcns = tool.__classNameWithStyle.bind(tool, style);
import comm from 'app/common'
import ConfigPage from "./configPage/configPage.react";

class ZYJSet extends React.Component {
    constructor(props) {
        super(props);
        this.zyjShareUrl = comm.getShareInfoUrl();
    }

    showZyjCode = () => {
        var WxCode = require('../../onlineSchool/wxcode/wxcode.react.js');
        var product = {
            src: this.zyjShareUrl,
            product_name: Plaso.userInfo.myOrg.name + '作业记小程序商品列表二维码',
        }
        Plaso.moredlg(<WxCode product={product}/>)
    }

    render() {
        return (
            <div className={lcns(['zyjSetWrap'])}>
                <div className={lcns(["qaCode"])}>
                    <div className={lcns(["description"])}>{getTrans('zyjerweima'/*作业记小程序二维码*/)+"："}</div>
                    <div className={lcns(["imgBox"])} onClick={this.showZyjCode}><img src={this.zyjShareUrl} className={lcns(["share-icon"])}/></div>
                </div>
                <ConfigPage />
            </div>
        )
    }
}

module.exports = ZYJSet;