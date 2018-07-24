declare var wx:any;
let recordTimer:number;
let START:number;
let END:number;
let isRecording = false;
export function startRecord(){
    if(!isRecording){
        START = new Date().getTime();
        recordTimer = setTimeout(function(){
            wx.startRecord({
                success: function(){
                    isRecording = true;
                },
                cancel: function () {
                    alert('用户拒绝授权录音');
                }
            });
        },300);
    }
}


export function stopRecord(){
    return new Promise(function(resolve,reject){
        END = new Date().getTime();
        isRecording = false;
        if((END - START) < 300){
            END = 0;
            START = 0;
            //小于300ms，不录音
            clearTimeout(recordTimer);
            reject(reject);
        }else{
            wx.stopRecord({
                success: function (res:any) {
                    const localId = res.localId;
                    // wx.uploadVoice({
                    //     localId:localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                    //     isShowProgressTips: 0, // 默认为1，显示进度提示
                    // });
                    wx.uploadVoice({
                        localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                        isShowProgressTips: 1, // 默认为1，显示进度提示
                        success: function (res:any) {
                            const serverId = res.serverId; // 返回音频的服务器端ID
                            resolve({
                                serverId,
                                localId
                            });
                        },fail:function(err:any){
                            alert(JSON.stringify(err))
                            reject(err);
                        }
                    });
                },
                fail: function (res:any) {
                    alert(JSON.stringify(res));
                }
            });
        }
    });
}

export function playRecord(id:string){
    return new Promise(function(resolve,reject){
        wx.playVoice({localId: id});
        // 结束
        wx.onVoicePlayEnd({
            success: function (res:any) {
                //
            }
        });
    });
}