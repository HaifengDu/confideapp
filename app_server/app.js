var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var index = require('./routes/index');
var user = require("./build/routes/user");
var weixin = require("./build/routes/weixin");
var basedata = require("./build/routes/basedata");
var listener = require("./build/routes/listener");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.engine('.html', require('jade').__express);
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'dkl091125',
    name: 'toke_session',
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