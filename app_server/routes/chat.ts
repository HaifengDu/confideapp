import * as express from "express";
import * as path from "path";
const router = express.Router();
router.get("/",function(req,res,next){
    res.sendFile(path.resolve("./views/chat.html"));
});

export = router;