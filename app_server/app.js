require("./extend");
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
// var connectmultiparty = require("connect-multiparty");
var timeout = require('connect-timeout');
var index = require('./routes/index');
var user = require("./build/routes/user");
var weixin = require("./build/routes/weixin");
var basedata = require("./build/routes/basedata");
var listener = require("./build/routes/listener");
var chat = require("./build/routes/chat");
var recommend = require("./build/routes/recommend");
var list = require("./build/routes/list");
require("./build/helper/mongoHelper");
var app = express();

app.use(timeout('30s'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.engine('.html', require('jade').__express);
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'x-requested-with,content-type,Rsa-word,proxy-cookie');

    if (req.url && req.url.startsWith("/dist")) {
        const maxAge = 30 * 60 * 24 * 365 * 1000;
        res.setHeader('Cache-Control', `max-age=${maxAge},public`);
        let expires = new Date();
        expires.setTime(expires.getTime() + 100 * 1000);
        res.setHeader('Expires', expires.toUTCString());
    } else {
        res.setHeader('Cache-Control', 'no-store');
    }
    if (req.method === "OPTIONS") {
        res.json({ success: true });
        res.end();
    } else {
        next();
    }
});
// app.use(connectmultiparty({
//     autoFiles: true,
//     maxFilesSize: 50 * 1024 * 1024
// }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'dkl091125',
    name: 'exs_sessionid',
    cookie: { maxAge: 80000 },
    resave: false,
    saveUninitialized: true,
}));
app.use('/static', express.static(path.join(__dirname, 'static'), { fallthrough: true }));
app.use('/files', express.static(path.join(__dirname, 'files'), { fallthrough: true }));

app.use('/', index);
app.use("/user", user);
app.use("/wx", weixin);
app.use("/base", basedata);
app.use("/listener", listener);
app.use("/chat", chat);
app.use("/recommend", recommend);
app.use("/list", list);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;