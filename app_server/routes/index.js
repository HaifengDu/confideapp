var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
    // res.render('index', { title: 'Express' });
    res.sendFile(path.resolve(__dirname, "../views/index.html"));
});

router.get("/netcall", function(req, res, next) {
    res.sendFile(path.resolve(__dirname, "../views/netcall.html"));
});

module.exports = router;