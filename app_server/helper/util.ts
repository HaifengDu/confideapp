import * as express from 'express';
import * as Mongoose from "mongoose";

export function retryInsertMongo(count:number){
    let current = 0;
    return function insert<T extends Mongoose.Document>(model:Mongoose.Model<T>,docs:T[],callback?: (error: any, docs: T[]) => void){
        model.insertMany(docs,(err,docs)=>{
            if(err&&current++<count){
                setTimeout(function(){
                    insert(model,docs);
                    return;
                },2*1000);
            }
            callback(err,docs);
        });
    }
}
export function getClientIp(req:express.Request){
    return <string>req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress;
}

export function createNonceStr() {
    return Math.random().toString(36).substr(2, 15);
};