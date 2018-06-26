import * as express from "express";
import { body,query, validationResult, Result } from 'express-validator/check';
import RecommendService from "../controller/Recommend";
import ErrorMsg from "../model/ErrorMsg";

const recommendCtrl = RecommendService.getInstance();
const router = express.Router();

router.get("/home",function(req,res){
    recommendCtrl.getHomeRecommend().then(data=>{
        res.json({
            data,...new ErrorMsg(true)
        })
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

export = router;