import React, { Component } from 'react';
import tool from "comp/tool";
import style from "./setting.less";
import Icon from "comp/icon.react";
import {observer} from 'mobx-react';
import upime from "./communication/communication";
import upimeChat from "./chat/communication";
import SelectComp from "comp/selectComp/selectComp.react";
var cns=tool.__classNameWithStyle;
var lcns=cns.bind(tool,style);

@observer
class setting extends Component {
    constructor(p){
        super(p);
        this.state = {
            currentCamera: '',
            currentMic:'',
            currentSpeaker:'',
            cameraArr : [],
            micArr : [],
            speakerArr:[],
            volume:0,
            logout:false
        }
        this.store = this.props.store;
        this._player = this.props.player._player;
        this.audiooutput=(audiooutput)=>{
            this._audiooutput=audiooutput;
        }
        this.music=(music)=>{
            this._music=music;
        }
        this.currentVolume = (volume) => {      //添加setting声音变化的回调函数
            this.setState({
                volume:volume
            })
            if(this.state.volume>1){
                this.setState({
                    volume:1
                })
            }
            var num = Math.floor(this.state.volume*27);
            for(var i=0; i<27; i++) {
                if(i<num) {
                    this.refs[`vline${i}`].style.background='#006F5B';
                }else{
                    this.refs[`vline${i}`].style.background='#D4D4D4';
                }
            }
        }
    }
    creatAudio(id) {
        var me=this,
            constraints = {audio: true};
        var audioContext=window.AudioContext || window.webkitAudioContext;
        if(!(audioContext&&audioContext.prototype.createMediaStreamSource)){
            return;
        }
        if(me.mediaStream){
            me.mediaStream.getTracks().forEach(function(track) {
                track.stop();
            });
        }
        if(me.audioCtx2){
            me.audioCtx2.close();
        }
        if(me.drawVisual){
            clearTimeout(me.drawVisual);
        }
        me.audioCtx2 = new audioContext();
        if(id){
            constraints.audio = {"deviceId":id}
        }
        navigator.mediaDevices.getUserMedia(constraints)
        .then(me.gotDevices.bind(me), function(e) {
            console.log('Rejected!', e);
        });
    }
    gotDevices(mediaStream){
        var me = this;
        var audiooutput = me._audiooutput;      //处理扬声器输出声音
        audiooutput.srcObject = mediaStream;
        audiooutput.onloadedmetadata = function(e) {    //video的话可以自动播放，audio需要手动加.play()
            audiooutput.play();
        };
        var currentSpeaker = me.store.currentSpeaker;
        if(currentSpeaker){
            me.attachSinkId(me._audiooutput,currentSpeaker.deviceId); //出现杂音特别严重的现象
            me.attachSinkId(me._music,currentSpeaker.deviceId);
        }

        me.mediaStream=mediaStream;
        var source = me.audioCtx2.createMediaStreamSource(mediaStream);
        var analyser = me.audioCtx2.createAnalyser();
        source.connect(analyser);
        analyser.fftSize = 2048;
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Float32Array(bufferLength);
        function draw() {
            var barHeight=0;
            me.drawVisual = setTimeout(draw,100);   //每100ms刷新一次音量显示条
            analyser.getFloatTimeDomainData(dataArray);
            for(var i = 0; i < bufferLength; i++) {
                if(dataArray[i]>barHeight){
                    barHeight = dataArray[i];
                }
            }
            me.currentVolume && me.currentVolume(barHeight);
        }
        draw();
    }
    close(){
        if(this.props.isShowBtn){
            var onExit=this.props.onExit;
            upime.logout(true,this.props.store.force_save);
            upimeChat.logout(true);
            onExit&&onExit();
        }
        Plaso.hideTop();
    }
    success() {
        var camId = this.state.currentCamera ? this.state.currentCamera.deviceId : '',
            micId = this.state.currentMic ? this.state.currentMic.deviceId : '',
            speakerId = this.state.currentSpeaker ? this.state.currentSpeaker.deviceId : '',
            isChoosedLogout = this.props.chooseDevicesCheck(camId,micId,speakerId);
        if(isChoosedLogout) {   //打开设置页面后 再出现当前所选设备丢失，不给进入
            return;
        }
        if(!this.state.logout||Plaso.isStudent()){
            Plaso.hideTop()
            this.store.currentCamera = this.state.currentCamera;
            this.store.currentMic = this.state.currentMic;
            this.store.currentSpeaker = this.state.currentSpeaker;
            this.store.currentDevice = [this.state.currentCamera,this.state.currentMic,this.state.currentSpeaker];
            this.props.playLive()
        }
    }

    getDevice() {           //获取设备及设备检测信息
        var me = this;
        var cameraArr = [],
            micArr = [],
            speakerArr = [],
            currentCamera,currentMic,currentSpeaker;
        var logout = false;   //设备不全？
        if(Plaso.devices.videoinput){  //摄像头
            Plaso.devices.videoinput.forEach(e=>{
                e.value = e.deviceId;
                e.text = e.label;
                if(e.deviceId != 'communications'){
                    cameraArr.push(e);
                }
            })
            if(this.store.currentCamera){
                currentCamera = this.store.currentCamera;
            }else{
                currentCamera = cameraArr[cameraArr.length-1];
            }
        }else{
            if(this.props.checkLogin[1]){
                logout = true;
            }
        }
        if(Plaso.devices.audioinput){  //麦克风
            Plaso.devices.audioinput.forEach(e=>{
                e.value = e.deviceId;
                e.text = e.label;
                if(e.deviceId != 'communications'){
                    micArr.push(e);
                }
            })
            if(this.store.currentMic){
                currentMic = this.store.currentMic;
            }else{
                currentMic = micArr[0];
            }
        }else{
            if(this.props.checkLogin[0]){
                logout = true;
            }
        }
        if(Plaso.devices.audiooutput){          //扬声器
            Plaso.devices.audiooutput.forEach(e=>{
                e.value = e.deviceId;
                e.text = e.label;
                if(e.deviceId != 'communications'){
                    speakerArr.push(e);
                }
            })
            if(this.store.currentSpeaker){
                currentSpeaker = this.store.currentSpeaker;
            }else{
                currentSpeaker = speakerArr[0];
            }
        }else{
            if(this.props.checkLogin[2]){
                logout = true;
            }
        }
        this.setState({
            cameraArr: cameraArr,
            currentCamera:currentCamera,
            micArr: micArr,
            currentMic:currentMic,
            speakerArr:speakerArr,
            currentSpeaker:currentSpeaker,
            logout:logout
        });
    }
    attachSinkId(element,sinkId){
        if (typeof element.sinkId !== 'undefined') {
            element.setSinkId(sinkId)
            .then(function() {
                console.log('Success, audio output device attached: ' + sinkId);
            })
            .catch(function(error) {
                var errorMessage = error;
                if (error.name === 'SecurityError') {
                    errorMessage = 'You need to use HTTPS for selecting audio output ' +
                    'device: ' + error;
                }
                console.error(errorMessage);
            });
        } else {
            console.warn('Browser does not support output device selection.');
        }
    }
    setUpimeDevices(camId,micId,speakerId){
        var media=upime._getMedia();
        camId = camId?camId:this.state.currentCamera.deviceId;
        micId = micId?micId:this.state.currentMic.deviceId;
        speakerId = speakerId?speakerId:this.state.currentSpeaker.deviceId;
        media._setDevices(camId,micId,speakerId);
    }
    handleCameraChange(cam) {
        if(!this.props.checkVideo){
            return;
        }
        this.setState({
			currentCamera: cam
        })
        this.store.currentCamera = cam;
        if(this.props.isShowBtn){
            return;
        }
        this.setUpimeDevices(cam.deviceId);
    }
    handleMicChange(mic) {
        this.setState({
            currentMic: mic
        })
        this.store.currentMic = mic;
        this.creatAudio(mic.deviceId)
        if(this.props.isShowBtn){
            return;
        }
    }
    handleSpeakerChange(speaker){
        this.setState({
            currentSpeaker: speaker
        })
        this.store.currentSpeaker = speaker;
        this.attachSinkId(this._audiooutput,speaker.deviceId);
        this.attachSinkId(this._music,speaker.deviceId);
        if(this.props.isShowBtn){
            return;
        }
        if(this.props.clsType == "liveClass"){
            this.setUpimeDevices(null,null,speaker.deviceId);
        }

    }
    checkMusic() {
        this._music.play();
    }
    componentDidMount() {
        this.getDevice();
        var mic = this.store.currentMic;
        var micId = mic?mic.deviceId:'';
        this.creatAudio(micId)
    }
    componentWillUnmount() {
        this.audioCtx2 && this.audioCtx2.close();
        if(this.drawVisual) clearTimeout(this.drawVisual);
        if(this.currentVolume){
            this.currentVolume = null;
        }
    }
    render() {
        var cameraList = [],
            state = this.state,
            vlines = [],
            closeBtn = '',
            bottomBtns = [],currentC;
        var isToggle = this.props.clsType == "liveClass";
        if(this.state.currentCamera){
            var label = this.state.currentCamera.label;          //若出现MediaDeviceInfo.label为空字符串的情况，解决办法
            currentC = label?label:'默认';
        }
        if(this.props.isShowBtn){
            if(!this.state.logout||Plaso.isStudent()){
                bottomBtns = <div className={lcns(["enterBtns"])}>
                    <button className={lcns(["enterBtn"])} onClick={this.close.bind(this)}>退出课堂</button>
                    <button className={lcns(["enterBtn","ok"])} onClick={this.success.bind(this)}>{getTrans("join_class"/*进入课堂*/)}</button>
                </div>
            }else{
                bottomBtns = <button className={lcns(["enterBtn"])} onClick={this.close.bind(this)}>退出课堂</button>
            }
        }else{
            closeBtn = <div className={lcns(["close"])}><Icon className={lcns(["close-icon"])} icon='icon-close' onClick={this.close.bind(this)}/></div>;
        }
        for(var i=0; i<27; i++) {
            vlines.push(<li key={i} className={lcns(["vline"])} ref={`vline${i}`}></li>)
        }
        var musicPath = 'https://www.plaso.cn/static/resource/kongka.mp3';
        var currentMic = state.currentMic,
            currentSpeaker = state.currentSpeaker;
        var miclabel = currentMic?currentMic.label:'';
        var speakerlabel = currentSpeaker?currentSpeaker.label:'';
        return (
            <div className={lcns(["setting"])}>
                <audio ref={this.audiooutput}></audio>
                <audio src={musicPath} ref={this.music}></audio>
                <div className={lcns(["setting-top"])}>
                    {closeBtn}
                    <p className={lcns(["title"])}>{getTrans("setting"/*设置*/)}</p>
                </div>
                <div className={lcns(["setting-c"])}>
                    <div className={lcns(["sc"])}>
                        <SelectComp
                            title={getTrans("camera"/*摄像头*/)}
                            listData={this.state.cameraArr}
                            onChange={this.handleCameraChange.bind(this)}
                            selectedvalue = {currentC}
                            defaultValue = {getTrans("no_camera"/*没有检测到摄像头*/)}
                            zIndex = {3}
                            isToggle = {this.props.checkVideo}
                            arrowColor = {false}        //为解决区分下拉菜单箭头颜色，加入
                            isShowBtn = {this.props.isShowBtn}
                        />
                    </div>
                    <div className={lcns(["sc"])}>
                        <SelectComp
                            title={getTrans("mic"/*麦克风*/)}
                            listData={this.state.micArr}
                            onChange={this.handleMicChange.bind(this)}
                            selectedvalue={miclabel}
                            defaultValue={getTrans("no_mic"/*没有检测到麦克风*/)}
                            zIndex = {2}
                            isToggle = {true}
                            arrowColor = {true}         //下拉菜单箭头根据需求及场景改变颜色
                            isShowBtn = {this.props.isShowBtn}
                        />
                    </div>
                    <div className={lcns(["vm"])}>
                        <Icon className={lcns(["vm-icon"])} icon='icon-icon5'/>
                        <ul className={lcns(["vline-w"])}>
                            {vlines}
                        </ul>
                    </div>
                    <div className={lcns(["sc","speaker"])}>
                        <SelectComp
                            title={getTrans("speakers"/*扬声器*/)}
                            listData={this.state.speakerArr}
                            onChange={this.handleSpeakerChange.bind(this)}
                            selectedvalue={speakerlabel}
                            defaultValue={getTrans("no_speaker"/*没有检测到扬声器*/)}
                            zIndex = {1}
                            isToggle = {isToggle}
                            arrowColor = {false}
                            isShowBtn = {this.props.isShowBtn}
                        />
                    </div>
                    <div className={lcns(["speaker"])}>
                        <div className={lcns(["testmic"])} onClick={this.checkMusic.bind(this)}>
                            <Icon className={lcns(["testmic-icon"])} icon='icon-wwww'/>
                            <span>{getTrans("test_speaker"/*测试扬声器*/)}</span>
                        </div>
                    </div>
                    {bottomBtns}
                </div>
            </div>
        );
    }
}
module.exports=setting;
