import React,{Component} from "react";
import style from "./configPage.less";
import tool from "comp/tool";
import Navigation from "./navigation.react";
import config from "./config";

const cns =tool.__classNameWithStyle;
const lcns = cns.bind(tool,style);

function getPage(key){
    return config[key].content;
}

//react升级后可改用hook
class ConfigPage extends Component{
    constructor(){
        super();
        this.state={
            content:getPage("functionSetting"),
            select:"functionSetting",
        }
    }

    getContent(key){
        this.setState({content:getPage(key),select:key})
    }

    render(){
        return(
            <div className={lcns(["configPage"])}>
                <Navigation config={config} click={this.getContent.bind(this)} select={this.state.select}/>
                {this.state.content}
            </div>
        )
    }
}

export default ConfigPage;