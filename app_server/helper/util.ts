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