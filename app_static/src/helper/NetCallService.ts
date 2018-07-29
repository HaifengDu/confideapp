import { INetCallListener } from "../interface/action/INetCallListener";

class NetImService {

    private static readonly appid = "45c6af3c98409b18a84451215d0bdd6e";
    private static _instance: NetImService;

    private constructor() {
    }

    public getImInstance(name:string,token:string){
        let NIM = (<any>window).SDK.NIM;
        const nim = NIM.getInstance({
            // debug: true,
            appKey: NetImService.appid,
            account: name, //"duhaifeng1@126.com",
            token: token, //'df8c6b8e62db3f74b8c8055c4e255f0c',
            onconnect: this.onConnect.bind(this),
            onwillreconnect: this.onWillReconnect.bind(this),
            ondisconnect: this.onDisconnect.bind(this),
            onerror: this.onError.bind(this)
        });
        return nim;
    }

    static createInstance() {
        NetImService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

    private onConnect(){
        console.log('连接成功');
    }

    private onWillReconnect(obj:{retryCount:number,duration:number}) {
        // 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
        console.log('即将重连');
        console.log(obj.retryCount);
        console.log(obj.duration);
    }

    private onDisconnect(error:any) {
        // 此时说明 `SDK` 处于断开状态，开发者此时应该根据错误码提示相应的错误信息，并且跳转到登录页面
        let that = this;
        console.log('连接断开');
        if (error) {
          switch (error.code) {
            // 账号或者密码错误, 请跳转到登录页面并提示错误
            case 302:
            //调整
            break;
            // 被踢, 请提示错误后跳转到登录页面
            case 'kicked':
              let map = {
                PC: '电脑版',
                Web: '网页版',
                Android: '手机版',
                iOS: '手机版',
                Mac: '电脑版',
                WindowsPhone: '手机版'
              };
              let str = error.from;
              (<any>new Date()).format()
              console.warn(
                '你的帐号于' +
                (<any>new Date()).format("yyyy-MM-dd hh:mm:ss") +
                  '被' +
                  (map[str] || '其他端') +
                  '踢出下线，请确定帐号信息安全!'
              );
              break;
            default:
              break;
          }
        }
    }

    private onError(error:any) {
        console.log('错误信息' + error);
    }
}


export default class NetCallService{
    private static _instance: NetCallService;

    private Netcall:any;
    private netcall:any;
    private timeoutFlag:number;
    private channelId:any;
    private beCalling = false;
    private beCalledInfo:any;
    private netImService = NetImService.getInstance();
    private netCallListener:INetCallListener;
    private pushConfig = {
        enable: true,
        needBadge: true,
        needPushNick: true,
        pushContent: '',
        custom: '测试自定义数据',
        pushPayload: '',
        sound: ''
    };
    private sessionConfig = {
        videoQuality: this.Netcall.CHAT_VIDEO_QUALITY_HIGH,
        videoFrameRate: this.Netcall.CHAT_VIDEO_FRAME_RATE_15,
        videoBitrate: 0,
        recordVideo: false,
        recordAudio: false,
        highAudio: false,
        bypassRtmp: false,
        rtmpUrl: '',
        rtmpRecord: false,
        splitMode: this.Netcall.LAYOUT_SPLITLATTICETILE
    };
    /**
     * NOTE:不私有
     * @param name 
     * @param token 
     */
    constructor(name:string,token:string){
        let NIM = (<any>window).SDK.NIM;
        if(!NIM){
            console.log("初始化im出错，没有NIM对象");
            return;
        }
        if(!(<any>window).WebRTC){
            console.log("浏览器不支持webrtc");
            return;
        }
        this.Netcall = (<any>window).WebRTC;
        NIM.use(this.Netcall);
        const nim = this.netImService.getImInstance(name,token);
        this.createNetCallInstance(nim);
    }

    /**
     * 拨号
     * @param name 
     */
    public call(name:string,listener:INetCallListener){
        this.netCallListener = listener;
        const netcall = this.netcall;
            netcall
                .call({
                    type: this.Netcall.NETCALL_TYPE_AUDIO,
                    account: name,
                    pushConfig: this.pushConfig,
                    sessionConfig: this.sessionConfig,
                    webrtcEnable: true
                })
                .then((obj:any) => {
                    // 成功发起呼叫
                    this.netCallListener.calling();
                    console.log('call success', obj);
                })
                .catch((err:any) => {
                    if(this.netCallListener&&this.netCallListener.connecterror){
                        this.netCallListener.connecterror()
                    }
                    // 被叫不在线
                    if (err.code === 11001) {
                        console.log('callee offline', err);
                    }
                });
            // 设置超时计时器
            this.timeoutFlag = setTimeout(function() {
                if (!netcall.callAccepted) {
                    console.log('超时未接听, hangup');
                    this.hangup();
                }
            }, 60 * 1000);
    }

    /**
     * 挂断
     */
    public hangup(){
        this.beCalling = false;
        this.beCalledInfo = null;
        this.netcall.hangup();
        this.stopDeviceAudioIn();
        this.stopDeviceAudioOut();
        if(this.netCallListener&&this.netCallListener.close){
            this.netCallListener.close();
        }
    }

    public accept(){
        this.beCalling = true;
        this.netcall
            .response({
                accepted: true,
                beCalledInfo: this.beCalledInfo,
                sessionConfig: this.sessionConfig
            }).then((res:any)=>{
                this.callAccepted(res);
            })
            .catch(function(err:any) {
                this.reject();
                console.log('接听失败', err);
            });
    }

    private createNetCallInstance(nim:any){
        this.netcall = this.Netcall.getInstance({
            nim: nim,
            container: document.getElementById('container'),
            remoteContainer: document.getElementById('remoteContainer'),
            // 是否开启日志打印
            debug: true
        });
        this.initNetcallEvent();
    }
    private initNetcallEvent(){
        this.netcall.on("callAccepted",this.callAccepted.bind(this));
        this.netcall.on("callRejected",this.callRejected.bind(this));
        this.netcall.on("signalClosed",this.signalClosed.bind(this));
        this.netcall.on("rtcConnectFailed",this.rtcConnectFailed.bind(this));
        this.netcall.on("beCalling",this.beCallingCb.bind(this));
        this.netcall.on("hangup",this.onHandup.bind(this));
        this.netcall.on("remoteTrack",this.onRemoteTrack.bind(this));
        this.netcall.on("control",this.onControl.bind(this));
    }

    private callAccepted(obj:any){
        this.startDeviceAudioIn().then(()=>{
            return this.netcall.startRtc();
        }).then(()=>{
            clearTimeout(this.timeoutFlag);
            return this.startDeviceAudioOut();
        }).then(()=>{
            if(this.netCallListener){
                this.netCallListener.accept();
            }
        }).catch((err:any)=>{
            console.log("连接出错");
        });
    }

    private callRejected(obj:any){
        console.log("对方拒绝");
        this.netCallListener.reject();
        clearTimeout(this.timeoutFlag);
    }

    private signalClosed(obj:any){
        this.hangup();
    }

    private rtcConnectFailed(){
        clearTimeout(this.timeoutFlag);
        this.hangup();
    }

    private beCallingCb(obj:any, scene:any){
        console.log("on be calling:", obj);
        let channelId = obj.channelId;
        // tslint:disable-next-line:curly
        if (obj.channelId === this.channelId) return;
        if(this.netcall.calling || this.beCalling){
            let tmp:any = { command: this.Netcall.NETCALL_CONTROL_COMMAND_BUSY };
            if (scene === 'p2p') {
                tmp.channelId = channelId;
            }

            console.log("通知呼叫方我方忙碌");
           this. netcall.control(tmp);
           return;
        }
        this.channelId = obj.channelId;
        this.beCalling = true;
        this.timeoutFlag = setTimeout(function () {
            // tslint:disable-next-line:curly
            if (!this.timeoutFlag) return;
            console.log("呼叫方可能已经掉线，挂断通话");
            this.timeoutFlag = null;
            this.reject();
        }.bind(this), 60 * 1000);
        this.beCalledInfo = obj;
    }

    public reject(auto=false){
        // tslint:disable-next-line:curly
        if (!this.beCalling) return;
        this.netcall.response({
            accepted: false,
            beCalledInfo: this.beCalledInfo
        }).then(function(){
            this.beCalledInfo = null;
            this.beCalling = false;
            if(!auto&&this.netCallListener){
                this.netCallListener.close();
            }
        }.bind(this)).catch(function (err:any) {
            // 自己断网了
            if(this.netCallListener){
                this.netCallListener.connecterror();
            }
            this.beCalledInfo = null;
            this.beCalling = false;
        }.bind(this));
    }

    private onHandup(){
        this.netCallListener.handup();
        this.beCalling = false;
        this.beCalledInfo = null;
        this.stopDeviceAudioIn();
        this.stopDeviceAudioOut();
    }

    private onControl(obj:any){
        if (this.netcall.notCurrentChannelId(obj)) {
            console.log("非当前通话的控制信息");
            return;
        }

        //其他暂不处理
        let type = obj.type;
        switch (type) {
            case this.Netcall.NETCALL_CONTROL_COMMAND_BUSY:
            this.hangup();
            clearTimeout(this.timeoutFlag);
            break;
        }
    }

    private startDeviceAudioIn() {
        console.log("开启麦克风");
        return this.netcall.startDevice({
            // 开启麦克风输入
            type: this.Netcall.DEVICE_TYPE_AUDIO_IN
        }).then(function () {
            console.log("开启麦克风成功，通知对方我方开启了麦克风");
            // 通知对方自己开启了麦克风
            this.netcall.control({
                command: this.Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_ON
            })
        }.bind(this)).catch(function () {
            console.log("开启麦克风失败");
            this.netcall.control({
                command: this.Netcall.NETCALL_CONTROL_COMMAND_SELF_AUDIO_INVALID
            });
        }.bind(this));
    };

    private startDeviceAudioOut(){
        return this.netcall.startDevice({
            type: this.Netcall.DEVICE_TYPE_AUDIO_OUT_CHAT
        }).then(function () {
            console.log("开启扬声器成功");
        }.bind(this)).catch(function () {
            console.log("开启扬声器失败");
        }.bind(this));
    }

    private stopDeviceAudioIn(){
        return this.netcall.stopDevice(this.Netcall.DEVICE_TYPE_AUDIO_IN).then((res:any)=>{
            this.netcall.control({
                command: this.Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_OFF
            });
        });
    }

    private stopDeviceAudioOut(){
        this.netcall.stopDevice(this.Netcall.DEVICE_TYPE_AUDIO_OUT_LOCAL);
        this.netcall.stopDevice(this.Netcall.DEVICE_TYPE_AUDIO_OUT_CHAT);
    }

    private onRemoteTrack(){
        this.netcall.startDevice({
            type: this.Netcall.DEVICE_TYPE_AUDIO_OUT_CHAT
        }).catch((err:any) => {
            if(this.netCallListener&&this.netCallListener.close){
                this.netCallListener.close();
            }
            console.log('播放对方的声音失败')
            console.error(err)
        });
    }

    public static getInstance(){
        return this._instance;
    }

    public static createInstance(name:string,token:string) {
        return this._instance || (this._instance = new NetCallService(name,token));
    }
}
