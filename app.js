var express = require('express'); //express 모듈요청
var app = express(); //app을 express 프레임워크로 킴
const ejs = require("ejs"); //ejs 모듈 요청

var http = require('http');
var path = require('path');
var static = require('serve-static');

const bodyPaser = require('body-parser');//POST로 받기위해 body-parser 요청
const bodyParser = require("body-parser");

var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
const axios = require("axios");
const cheerio = require("cheerio");
var mysql = require('mysql');
const request = require('request');
const convert = require('xml-js');

'use strict';
const tabletojson = require("tabletojson").Tabletojson; 




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


// view engine setup
app.set("view engine","ejs"); //app에 view engine을 설치. ejs를 템플릿으로
app.use(express.static(__dirname+'/')); //view 폴더 경로는 프로젝트 폴더.(__dirname이 폴더위치)
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false})); //url인코딩 안함
app.use(bodyParser.json());//JSON 타입으로 파싱하게 설정


app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
