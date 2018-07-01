class NetImService {

    private static readonly appid = "45c6af3c98409b18a84451215d0bdd6e";
    private static _instance: NetImService;

    private constructor() {
    }

    public getImInstance(name:string,token:string){
        var NIM = (<any>window).SDK.NIM;
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
        var that = this;
        console.log('连接断开');
        if (error) {
          switch (error.code) {
            // 账号或者密码错误, 请跳转到登录页面并提示错误
            case 302:
            //调整
            break;
            // 被踢, 请提示错误后跳转到登录页面
            case 'kicked':
              var map = {
                PC: '电脑版',
                Web: '网页版',
                Android: '手机版',
                iOS: '手机版',
                Mac: '电脑版',
                WindowsPhone: '手机版'
              };
              var str = error.from;
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
    private Netcall:any;
    private netcall:any;
    private timeoutFlag:number;
    private channelId:any;
    private beCalling = false;
    private beCalledInfo:any;
    private netImService = NetImService.getInstance();
    constructor(private name:string,private token:string){
        var NIM = (<any>window).SDK.NIM;
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
        }).catch((err:any)=>{
            console.log("连接出错");
        });
    }

    private callRejected(obj:any){
        console.log("对方拒绝");
        clearTimeout(this.timeoutFlag);
    }

    private signalClosed(obj:any){
        this.netcall.hangup();
        this.stopDeviceAudioIn();
        this.stopDeviceAudioOut();
    }

    private rtcConnectFailed(){
        clearTimeout(this.timeoutFlag);
        this.beCalling = false;
        this.beCalledInfo = null;
        this.netcall.hangup();
    }

    private beCallingCb(obj:any, scene:any){
        console.log("on be calling:", obj);
        var channelId = obj.channelId;
        if (obj.channelId === this.channelId) return;
        if(this.netcall.calling || this.beCalling){
            var tmp:any = { command: this.Netcall.NETCALL_CONTROL_COMMAND_BUSY };
            if (scene === 'p2p') {
                tmp.channelId = channelId;
            }

            console.log("通知呼叫方我方不空");
           this. netcall.control(tmp);
           return;
        }
        this.channelId = obj.channelId;
        this.beCalling = true;
        this.timeoutFlag = setTimeout(function () {
            if (!this.timeoutFlag) return;
            console.log("呼叫方可能已经掉线，挂断通话");
            this.timeoutFlag = null;
            this.reject();
        }.bind(this), 62 * 1000);
        this.beCalledInfo = obj;
    }

    private reject(){
        if (!this.beCalling) return;
        this.netcall.response({
            accepted: false,
            beCalledInfo: this.beCalledInfo
        }).then(function () {
            this.beCalledInfo = null;
            this.beCalling = false;
        }.bind(this)).catch(function (err:any) {
            // 自己断网了
            this.beCalledInfo = null;
            this.beCalling = false;
        }.bind(this));
    }

    private onHandup(){
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
        var type = obj.type;
        switch (type) {
            case this.Netcall.NETCALL_CONTROL_COMMAND_BUSY:
            this.netcall.hangup();
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
        }).catch(function(err:any) {
            console.log('播放对方的声音失败')
            console.error(err)
        });
    }
}
