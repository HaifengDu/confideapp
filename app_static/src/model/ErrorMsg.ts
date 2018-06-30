import { IError } from "../interface/IError";

export default class ErrorMsg implements IError{
    constructor(public success=false,public message?:string){

    }
    public toString(){
        return `{"success":${this.success},"message":${this.message||""}}`;
    }
}