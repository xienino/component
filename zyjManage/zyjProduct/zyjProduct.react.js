var React = require('react');
var ReactDOM = require('react-dom');
var Icon = require('comp/icon.react');
var DropDownCheck = require('components/dropDownSelect.react');
var bossServer = require('data/func/boss');
var userServer = require('data/func/user');
var AddfileorteacherWindow = require('accountManage/teacherGroupManage/addfileorteacherWindow');
import sstring from 'app/func/solveString.react.js';
import style from 'onlineSchool/newProduct/newProduct.less';
import tool from 'comp/tool';
const lcns = tool.__classNameWithStyle.bind(tool, style);
import { BOSSPRODUCT } from 'definition/js/macro/ProductConst.js';
import {inject, observer} from "mobx-react";
import SelectRadio from '../selectRadio/selectRadio.react';

const groupBuyStatus = {
    shut: -1,
    off: 0,
    open: 1,
}

@inject("gradeStore","courseStore")
@observer
class ZYJProduct extends React.Component {
    constructor(props) {
        super(props);
        var initialState = {};
        initialState.status = props.operType;
        initialState.teachers = [];
        initialState.kejianfanwei = [
            { text: getTrans("jbjgkj"), value: 0 },
            { text: getTrans("jiamengjigoukejian"), value: -2 }
        ];
        initialState.kejianfanweiKey = 0;
        initialState.fenlei1 = [{ text: getTrans("qingxuanz") + getTrans("grade"), value: 0 }].concat(props.gradeStore.getGradeList)
        initialState.fenlei2 = [{text: getTrans("qingxuanz") + getTrans("xueke"), value: 0 }].concat(props.courseStore.getCourseList)
        if (props.product) {
            var product = props.product;
            initialState.prodId = product.product_id;
            initialState.mingchengContent = product.product_name;
            initialState.visible_type_value = product.visible_type;
            initialState.quantity = product.quantity;
            initialState.shopPrice = product.shop_price / 100;
            initialState.marketRmbPrice = product.marketRmbPrice / 100 || 0;
            initialState.iosPrice = product.ios_price ? product.ios_price : Math.ceil(product.shop_price / 0.7);
            initialState.first_id = product.grades ? parseInt(product.grades.split(',')[0]) : 0;
            initialState.second_id = product.courses ? parseInt(product.courses.split(',')[0]) : 0;
            initialState.editorContent = product.description;
            initialState.tianshu = product.serviceDuration / 24 / 60 / 60000;
            initialState.openGroupBuy = product.teamNum>0 ? groupBuyStatus.open:groupBuyStatus.shut;
            initialState.teamExpire = product.teamExpire>0?Number(product.teamExpire / 3600 / 1000):3;
            initialState.teamNum = product.teamNum>0?product.teamNum:2;
            this.borderCN = 'edit';

            this.useBuyLimit = product.buyLimit==0?false:true;
            this.useQuota = product.quota == -1?false:true;
            this.buyLimit = product.buyLimit==0?1:product.buyLimit;
            this.quota = product.quota == -1?1:product.quota;
            
            this.state = initialState;
        } else {
            initialState.refreshDropdown = "";
            initialState.mingchengContent = "";
            initialState.visible_type_value = 0;
            initialState.quantity = null;
            initialState.shopPrice = null;
            initialState.iosPrice = null;
            initialState.marketRmbPrice = null;
            initialState.first_id = 0;
            initialState.second_id = 0;
            initialState.editorContent = "";
            initialState.tianshu = 30;
            initialState.openGroupBuy = -1;
            initialState.teamExpire = 3;
            initialState.teamNum = 2;

            this.useBuyLimit = false;
            this.useQuota = false;
            this.buyLimit = 1;
            this.quota = 1;
            this.state = initialState;
        }
    }

    componentWillMount() {
        this.getTeachers()
    }

    componentDidMount() {
        const toolbarOptions = [
            ['bold'],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['image']
        ];
        const options = {
            modules: {
                toolbar: toolbarOptions
            },
            placeholder: '请输入文本...',
            readOnly: false,
            theme: 'snow'
        };
        var quill = new Quill('#editor_zyjid', options);
        this.editor = quill;
        this.editor.root.innerHTML = this.state.editorContent;
        if (this.props.product) {
            var status = this.props.product.mergedProductState;
            if (status == BOSSPRODUCT.DAISHANGJIA || status == BOSSPRODUCT.SALEING || status == BOSSPRODUCT.SALEOUT) {
                if (this.state.openGroupBuy == groupBuyStatus.open) {  //只有在售中的拼团商品,才不可修改价格
                    this.refs.jiage.disabled = true;
                    this.refs.huaxianPrice.disabled = true;
                    this.setState({
                        openGroupBuy: groupBuyStatus.off
                    })
                }
                this.refs.teamExpire && (this.refs.teamExpire.disabled = true);
                this.refs.teamNum && (this.refs.teamNum.disabled = true);
            }
        }
    }

    teachersSelected = (teachers) => {
        var _teachers = this.state.teachers;
        for (var i = 0; i < teachers.length; i++) {
            var hit = false;
            for (var j = 0; j < this.state.teachers.length; j++) {
                if (this.state.teachers[j].myid == teachers[i].myid) {
                    hit = true;
                    break;
                }
            }
            if (!hit) {
                _teachers.push(teachers[i]);
            }
        }
        this.setState({
            teachers: _teachers
        });
    };

    selectTeacher = () => {
        Plaso.moredlg(<AddfileorteacherWindow
            itemsCallback={this.teachersSelected.bind(this)}
            key="addteacherInGroup"
            title={getTrans("tianjialaoshi"/*添加老师*/)}
            type="addteacherInGroup" />);
    };

    deleteGroupItem = (index) => {
        var teachers = this.state.teachers;
        teachers.splice(index, 1);
        this.setState({
            teachers: teachers
        });
    };

    mingchengChange = () => {
        this.setState({
            mingchengContent: this.refs.mingcheng.value
        })
    };

    kejianfanwei = (value, text) => {
        this.setState({
            visible_type_value: value
        })
    };

    getTeachers = () => {
        var self = this;
        if (!self.state.prodId) return;

        var teachers = this.props.product.teachers.split(',');
        var c = teachers.length;
        teachers.forEach((o) => {
            let tid = o.split(':')[0];
            userServer.getUserInfo({
                userId: tid,
                role: 'teacher'
            }, res => {
                res.obj.myid = tid;
                res.obj.loginName = res.obj.loginname;
                self.state.teachers.push(res.obj)
                c--;
                if (!c) self.setState({ teachers: self.state.teachers });
            })
        })
    };

    fenleiselect = (type, value) => {
        if (type == 1) {//第一个分类
            this.setState({
                first_id: value
            })
        } else {
            this.setState({
                second_id: value
            })
        }
    };

    tijiao = () => {
        var self = this;
        var status = this.state.status;
        var product = { visibleType: 0, type: TProductType.YUEKA };
        if (status === 'add') {

        } else {
            product.productId = this.state.prodId;
        }
        product.serviceDuration = this.refs.tianshu.value * 60 * 60 * 1000 * 24;
        var jiage = Number(ReactDOM.findDOMNode(this.refs.jiage).value);//价格
        var marketRmbPrice = Number(ReactDOM.findDOMNode(this.refs.huaxianPrice).value);//价格
        var iosOriginPrice = Math.ceil(jiage / 0.7) || 0;//IOS原始价格
        var mingcheng = ReactDOM.findDOMNode(this.refs.mingcheng).value;//名称
        var shuliang = Number(ReactDOM.findDOMNode(this.refs.shuliang).value);//数量
        if (!this.state.teachers.length) {
            Plaso.showPrompt({ content: '至少选择一个老师批改作业' });
            return;
        }
        if (!Number.isInteger(Number(this.refs.tianshu.value))) {
            Plaso.showPrompt({ content: '服务天数需为整数' });
            return;
        }
        if (isNaN(product.serviceDuration) || product.serviceDuration <= 0) {
            Plaso.showPrompt({ content: getTrans("pleasezhengqueTianshu"/*请输入正确天数*/) });
            return;
        }
        if (this.state.first_id == 0 || this.state.second_id == 0) {
            Plaso.showPrompt({ content: getTrans("xuanzduiyingfenlei") });
            return;
        }
        if (!mingcheng) {
            Plaso.showPrompt({ content: getTrans("mingchengweikong"/*名称不能为空*/) });
            return;
        }
        if (sstring.getByteLen(mingcheng) > 40) {
            Plaso.showPrompt({content:'名称输入最多40个字符'})
            return;
        }
        var priceTitle = '价格',marketPriceTitle = '划线价格';
        if (this.state.openGroupBuy >= 0) {
            var teamExpire = Number(ReactDOM.findDOMNode(this.refs.teamExpire).value)*3600*1000;//拼团期限
            var teamNum = Number(ReactDOM.findDOMNode(this.refs.teamNum).value);//成团人数
            if (isNaN(teamExpire) || teamExpire<0) {
                Plaso.showPrompt({content: '请输入正确的拼团期限'});
                return;
            }
            if (!teamExpire) {
                Plaso.showPrompt({ content: '请填写拼团期限' });
                return;
            }
            if (isNaN(teamNum) || teamNum < 2) {
                Plaso.showPrompt({content: '请输入正确的成团人数'});
                return;
            }
            if (!teamNum) {
                Plaso.showPrompt({content: '请填写成团人数'});
                return;
            }
            product.teamExpire = teamExpire;
            product.teamNum = teamNum;
            priceTitle = '拼团价';
            marketPriceTitle = '单人价';
            if (jiage < 0) {
                Plaso.showPrompt({ content: '请输入正确的拼团价'})
                return;
            }
            if (jiage == 0) {
                Plaso.showPrompt({ content: '拼团价需大于0'})
                return;
            }
            if (jiage > marketRmbPrice) {
                Plaso.showPrompt({ content: '拼团价不得高于个人价'})
                return;
            }
        }
        if (isNaN(jiage) || jiage < 0 || ReactDOM.findDOMNode(this.refs.jiage).value == '') {
            Plaso.showPrompt({ content: '请输入正确的' +  priceTitle})
            return;
        }
        if (isNaN(marketRmbPrice) || marketRmbPrice < 0 || ReactDOM.findDOMNode(this.refs.huaxianPrice).value == '') {
            Plaso.showPrompt({ content: '请输入正确的' + marketPriceTitle })
            return;
        }

        if (jiage < 0 || marketRmbPrice < 0) {
            Plaso.showPrompt({ content: '商品价格错误' });
            return;
        }

        if (
            isNaN(iosOriginPrice) || iosOriginPrice < 0 || iosOriginPrice > 999999
        ) {
            Plaso.showPrompt({ content: '请输入正确的' +  priceTitle })
            return;
        }
        if (isNaN(shuliang)) {
            Plaso.showPrompt({ content: getTrans("zhengqueshuliang"/*请输入正确的数量*/) })
            return;
        }
        if (!shuliang) {
            Plaso.showPrompt({ content: getTrans("zqshangpshuliang"/*请填写商品数量*/) });
            return;
        }
        if (sstring.hasEmoji(this.editor.root.innerHTML)) {
            Plaso.showPrompt({content: '不支持输入表情符号'});
            return;
        }
        if (
            this.useBuyLimit && Number(this.buyLimit) < 1
        ) {
            Plaso.showPrompt({content: '请输入正确的每人限购数量'})
            return;
        }
        if (
            this.useQuota && Number(this.quota) < 1
        ) {
            Plaso.showPrompt({content: '请输入正确的提问总数'})
            return;
        }
        var t = [];
        var teachers = this.state.teachers;
        for (var i = 0; i < teachers.length; i++) {
            var obj = { userId: Number(teachers[i].myid) };
            t.push(obj);
        }
        product.teachers = t;
        product.productName = mingcheng;
        product.shopPrice = jiage * 100;
        product.marketRmbPrice = marketRmbPrice * 100;
        var iosPrice = Number.isInteger(iosOriginPrice) ? iosOriginPrice : Number(iosOriginPrice.toFixed(2));//IOS价格保留两位小数;
        product.iosPrice = iosPrice;
        product.quantity = shuliang;
        product.grades = [this.state.first_id];
        product.courses = [this.state.second_id];
        product.buyLimit = this.useBuyLimit ? Number(this.buyLimit) : 0;
        product.quota = this.useQuota ? Number(this.quota) : -1;
        product.productImg = 'default/cover/zyDetail.png';
        //将富文本里的图片上传至服务端
        var miaoshu = this.editor.root.innerHTML;
        if (miaoshu.replace(/[\n\r\s]/g, "").replace(/((\<p\>\<br\>\<\/p\>)|(\<p\>\<\/p\>))/g, "") == "") {
            miaoshu = "";
        }
        var imgs = this.editor.root.getElementsByTagName("img");
        if (miaoshu != "" && imgs.length > 0) {
            var count = 0;
            var uploadImgs = [];
            for (var i = 0; i < imgs.length; i++) {
                if (imgs[i].src.indexOf("data:image") >= 0) {
                    uploadImgs.push(imgs[i]);
                }
            }
            if (uploadImgs.length > 0) {
                for (i = 0; i < uploadImgs.length; i++) {
                    (function (i) {
                        var formData = new FormData();
                        formData.append("file", dataURItoBlob(uploadImgs[i].src));
                        formData.append('dirType', 'MALL');
                        bossServer.uploadToDirPublic(formData).then(res => {
                            if (res.code == 0) {
                                count++;
                                uploadImgs[i].src = res.obj;
                                if (count == uploadImgs.length) {
                                    product.description = self.editor.root.innerHTML;
                                    self.doCreateOrUpdate(product);
                                }
                            }
                        });
                    })(i);
                }
            } else {
                product.description = miaoshu;
                this.doCreateOrUpdate(product);
            }
        } else {
            product.description = miaoshu;
            this.doCreateOrUpdate(product);
        }
    };

    getTeacherIds = () => {
        var teacherIds = []
        for (let t of this.state.teachers) {
            teacherIds.push(t.myid)
        }
        return teacherIds;
    };

    doCreateOrUpdate = (product) => {
        var btn_submit = this.refs['btn-submit'];
        btn_submit.style.background = 'lightgray';
        btn_submit.disabled = true;

        if (this.state.status == 'add') {
            var self = this;
            bossServer.createProduct(product).then((res) => {
                btn_submit.style.background = '#61C7F9';
                btn_submit.disabled = false;
                if (res.code == 0) {
                    Plaso.showPrompt({ content: getTrans('spcjcgplease') });
                    self.clearContent();
                    Plaso.hideTop();
                }
            });

        } else {
            var self = this;
            bossServer.modifyProduct(product, function (res) {
                btn_submit.style.background = '#61C7F9';
                btn_submit.disabled = false;
                console.log(res)
                if (res.code == 0) {
                    Plaso.showPrompt({ content: getTrans('shangpingxiugaichengong') });
                    self.props.back && self.props.back(true);
                    Plaso.hideTop();
                }
            })
        }
    };

    clearContent = () => {
        ReactDOM.findDOMNode(this.refs.jiage).value = '';
        ReactDOM.findDOMNode(this.refs.mingcheng).value = '';
        ReactDOM.findDOMNode(this.refs.shuliang).value = '';
        ReactDOM.findDOMNode(this.refs.tianshu).value = '';
        ReactDOM.findDOMNode(this.refs.huaxianPrice).value = '';
        if (this.state.openGroupBuy >= 0) {
            ReactDOM.findDOMNode(this.refs.teamExpire).value = '';
            ReactDOM.findDOMNode(this.refs.teamNum).value = '';
        }
        this.editor.root.innerHTML = "";
        this.setState({
            teachers: [],
            refreshDropdown: "refreshDropdown",
            mingchengContent: '',
            kejianfanweiKey: this.state.kejianfanweiKey + 1,
            first_id: 0,
            second_id: 0,
            openGroupBuy: -1,
        })
        this.buyLimitRef.clearContent();
        this.quotaRef.clearContent();
        this.useBuyLimit = false;
        this.useQuota = false;
        this.buyLimit = 1;
        this.quota = 1;
    };

    handleswitch = () => {
        var openGroupBuy = -this.state.openGroupBuy;
        this.setState({
            openGroupBuy
        })
    }

    handleBuyLimit = value => {
        console.log('handleBuyLimit: ',value)
        this.buyLimit = value;
    }

    handleQuota = value => {
        console.log('handleQuota: ',value)
        this.quota = value;
    }

    handleRadioChange = (stateName, flag) => {
        console.log('flag,stateName: ',stateName, !flag)
        this[stateName] = !flag;
    }

    render() {
        var status = this.state.status;
        // var selectPackageTitle = "选择批改作业的老师";
        var selectPackageTitle = '批改老师';
        // if (status == 'edit') {
        //     selectPackageTitle = "已选择批改作业的老师";
        // }
        var showcontent = "选择老师";
        var selectedList = [];
        this.state.teachers.map((teacher, index) => {
            selectedList.push(
                <div className={lcns(['selectedItem'])}>
                    <span className={lcns(['tagName'])} >{teacher.name + "(" + teacher.loginName + ")"}</span>
                    <Icon icon="icon-close1" className={lcns(['delete'])} onClick={this.deleteGroupItem.bind(this, index)} />
                </div>
            );
        });
        if (this.state.fenlei1) {
            var gradeDOM = (
                <div className={lcns(['dropdown-wrapper', 'grade'])}>
                    <DropDownCheck
                        key='grade'
                        className={lcns(['dropdown'])}
                        itemList={this.state.fenlei1}
                        // initValue={[getTrans('qingxuanz') + getTrans('grade')]}
                        defaultValue={this.state.first_id}
                        onSelect={this.fenleiselect.bind(this, 1)}
                    />
                </div>
            )   
        }
        if (this.state.fenlei2) {
            var courseDOM = (
                <div className={lcns(['dropdown-wrapper'])}>
                    <DropDownCheck
                        key='course'
                        className={lcns(['dropdown'])}
                        itemList={this.state.fenlei2}
                        // initValue={[getTrans('qingxuanz') + getTrans('xueke')]}
                        defaultValue={this.state.second_id}
                        onSelect={this.fenleiselect.bind(this, 2)}
                    />
                </div>
            )
        }
        var pic,groupBuyBtn,gbFunc;
        switch (this.state.openGroupBuy) {
            case -1: 
                pic = 'shut.png';
                gbFunc = this.handleswitch.bind(this);
                break;
            case 0:
                pic = 'openoff.png';
                break;
            case 1: 
                pic = 'open.png';
                gbFunc = this.handleswitch.bind(this);
                break;
        }
        if (pic) {
            groupBuyBtn = Plaso.appinfo.rhost + 'pics/switch/' + pic;
        }
        if (this.state.openGroupBuy>=0) {
            var gbTip = <p>{'拼团信息下架后方可修改，下架时所有正在进行的团失效。'}</p>
            var gbDetailDom = [
                <div className={lcns(['form-input','zyj','unitItem'])}>
                    <label>拼团期限</label>
                    <input defaultValue={this.state.teamExpire} ref="teamExpire" placeholder="不能为0"/>
                    <span className={lcns(['unit'])}>{'小时'}</span>
                    <div className={lcns(['operateTip'])}>
                        <Icon icon='icon-info_alt' className={lcns(['icon'])}/>
                        <div className={lcns(['rawPriceTip'])}>{'团长发起拼团后，需在此期限内达到成团人数，否则拼团失败。'}</div>
                    </div>
                </div>,
                <div className={lcns(['form-input','zyj','unitItem'])}>
                    <label>成团人数</label>
                    <input defaultValue={this.state.teamNum} ref="teamNum" placeholder="最小成团人数需大于1"/>
                    <span className={lcns(['unit'])}>{'人'}</span>
                </div>
            ]
            var originPrice = '拼团价',soldPrice = '单人价';
            var originPriceHolder = '请填写多人拼团价',soldPriceHolder = '请填写单人购买价';
        } else {
            originPrice = '原价';
            soldPrice = '划线价';
            originPriceHolder = '请填写价格';
            soldPriceHolder = '请填写划线价格';
        }
        if (Plaso.myOrgSettings.pintuan) {   
            var pintuanDom = (
                <div className={lcns(['form-input','zyj'])}>
                    <label>{'开启拼团'}</label>
                    <div className={lcns(['tip'])}>
                        <img src={groupBuyBtn} onClick={gbFunc}/>
                        {gbTip}
                    </div>
                </div>
            )
        }
        return (
            <div className={lcns(['border',this.borderCN])}>
                <div className={lcns(['container'])}>
                    <span className={lcns(['zyj_title'])}>作业记商品 只会出现在作业记小程序中</span>
                    <div className={lcns(['mainContent', 'baseInfo'])}>
                        <div className={lcns(['left'])}>
                            <div className={lcns(['form-input','name'])}>
                                <label>{getTrans("mingcheng")}</label>
                                <input
                                    placeholder={getTrans("inputshangpmcnotempty"/*输入商品名称,不可为空*/)}
                                    value={this.state.mingchengContent}
                                    onChange={this.mingchengChange}
                                    ref="mingcheng"
                                />
                            </div>
                            <div className={lcns(['form-input','zyj'])}>
                                <label>{selectPackageTitle}</label>
                                <div className={lcns(['cover'])}>
                                    <div className={lcns(['xuanzjc'], ['btn','btn-default'])} onClick={this.selectTeacher}>{showcontent}</div>
                                    <div className={lcns(['tagsArea', 'tagsArea_zyj'])}>{selectedList}</div>
                                </div>
                            </div>
                            <div className={lcns(['form-input', 'classify'])}>
                                <label>{getTrans('fenlei')}</label>
                                {gradeDOM}
                                {courseDOM}
                            </div>
                            {pintuanDom}
                            <div className={lcns(['form-input', 'price-section','zyj'])}>
                                <label>{'价格/元'}</label>
                                <div className={lcns(['price-set'])}>
                                    <div className={lcns(['price-line'])}>
                                        <div className={lcns(['price'])}>
                                            <span className={lcns(['price-label'])}>{originPrice}</span>
                                            <input type="text" placeholder={originPriceHolder} ref="jiage" defaultValue={this.state.shopPrice}/>
                                        </div>
                                        <div className={lcns(['price'])}>
                                            <span className={lcns(['price-label'])}>{soldPrice}</span>
                                            <input type="text" placeholder={soldPriceHolder} ref="huaxianPrice" defaultValue={this.state.marketRmbPrice}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {gbDetailDom}
                            <div className={lcns(['form-input','zyj','unitItem'])}>
                                <label>{getTrans("tianshu"/*服务天数*/)}</label>
                                <input placeholder={getTrans("pleaseTianshu"/*请填服务写天数*/)}
                                    ref="tianshu"
                                    defaultValue={this.state.tianshu}
                                />
                                <span className={lcns(['unit'])}>{'天'}</span>
                            </div>
                            <div className={lcns(['form-input','zyj'])}>
                                <label>{getTrans("shuliang")}</label>
                                <input placeholder={getTrans("shuliangwuxian"/*不能为0;-1表示数量无限制*/)}
                                    min="-1"
                                    ref="shuliang"
                                    defaultValue={this.state.quantity}
                                />
                            </div>
                            <div className={lcns(['form-input','zyj'])}>
                                <label>{getTrans("purchasePerPerson"/*每人限购*/)}</label>
                                <SelectRadio 
                                    className={lcns(['selectRadio'])} 
                                    checkName={['无限制','限量']}
                                    placeholder={'数量必须大于等于1'}
                                    handleValueChange={this.handleBuyLimit}
                                    handleRadioChange={this.handleRadioChange.bind(this,'useBuyLimit')}
                                    defaultRadio={!this.useBuyLimit}
                                    defautValue={this.buyLimit}
                                    ref = {p => this.buyLimitRef = p}
                                />
                            </div>
                            <div className={lcns(['form-input','zyj'])}>
                                <label>{getTrans("questionSum"/*提问总数*/)}</label>
                                <SelectRadio 
                                    className={lcns(['selectRadio'])} 
                                    label={'提问总数'} 
                                    checkName={['无限制','限次']}
                                    placeholder={'数量必须大于等于1'}
                                    handleValueChange={this.handleQuota}
                                    handleRadioChange={this.handleRadioChange.bind(this,'useQuota')}
                                    defaultRadio={!this.useQuota}
                                    defautValue={this.quota}
                                    ref = {p => this.quotaRef = p}
                                />
                            </div>
                        </div>
                        <div className={lcns(['right','rightBox'])}>
                            <div className={lcns(['cover'])}>
                                <label>{getTrans("windowTips_desc")}</label>
                                <div className={lcns(['editor-wrapper'])}>
                                    <div className={lcns(['editor-container'])} id="editor_zyjid"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={lcns(['step'])}>
                        <button ref="btn-submit" className={lcns(['step-btn','enable'])} onClick={this.tijiao}>{status == 'add' ? getTrans("handin") : getTrans("update")}</button>
                    </div>
                </div>
            </div>
        )
    }
}

module.exports = ZYJProduct;