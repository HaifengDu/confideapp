const audioDir = "../../static/auidos/";
import {Howl} from "howler";
export interface IAudioFile{
    connect:string,
    ring:string,
    noresponse:string,
    reject:string,
    busy:string
}
export const audioFile:IAudioFile = {
    connect:"avchat_connecting.mp3",
    ring:"avchat_ring.mp3",
    noresponse:"avchat_no_response.mp3",
    reject:"avchat_peer_reject.mp3",
    busy:"avchat_peer_busy.mp3"
};
export function play(file:keyof IAudioFile,isloop=false){
    const path = `${audioDir}${audioFile[file]}`;
    const sound = new Howl({
        src: [path],
        loop: isloop,
    });
    const duration = sound.duration();
    const promise = new Promise((resolve,reject)=>{
        try{
            sound.play();
        }catch(e){
//
        }
        setTimeout(function(){
            resolve();
        },duration);
    });
    return {sound,promise};
}

export function stopPlay(sound:Howl){
    if(!sound){
        return sound;
    }
    let tempSound:Howl = sound;;
    try {
        tempSound = sound.stop();
    } catch (error) {
        //
    } 
    return tempSound;
}