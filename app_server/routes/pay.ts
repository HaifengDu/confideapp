import * as express from "express";
import OrderService from "../controller/Order";
import ErrorMsg from "../model/ErrorMsg";
const orderService = OrderService.getInstance();
const router = express.Router();
router.post("/payaction",function(req,res){
    orderService.recieve(req).then(()=>{
        res.send(`<xml>
        <return_code><![CDATA[SUCCESS]]></return_code>
        <return_msg><![CDATA[OK]]></return_msg>
        </xml>`);
    },err=>{
        res.json(new ErrorMsg(false,err.message,err));
    }).catch(err=>{
        res.json(new ErrorMsg(false,err.message,err));
    });
});

export = router;