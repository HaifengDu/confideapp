export default class FileReaderHelper {
    static readFile(file:Blob,index?:number){
        return new Promise(function(resolve,reject){
            let fr: FileReader = new FileReader;
            fr.onload = function (ev: any) {
                resolve({result:ev.target.result,index});
            }
            fr.onerror = function(){
                reject();
            }
            fr.readAsDataURL(file);
        });
    }

    static readFiles(files:Blob[]){
        const promises = files.map((file,index)=>this.readFile(file,index));
        return Promise.all(promises).then((arr:any[])=>{
            const sortArr = arr.sort(item=>item.index);
            return sortArr.map(item=>item.result);
        });
    }
}