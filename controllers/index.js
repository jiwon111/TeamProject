const axios = require("axios");
const cheerio = require("cheerio");
const tabletojson = require("tabletojson").Tabletojson;
const request = require('request');
const convert = require('xml-js');
var mysql = require('mysql');

function basicAPI(req, res) {
    res.render('index',{});
}
    
function searchAPI(req, res) {
    var request = req.query.searchKey;
    console.log(request);
    res.render('search',{request});
}

function mypageAPI(req,res){
    res.render('mypage',{});
}

function joinAPI(req,res){
    res.render('join',{});
}

function loginAPI(req,res){
    res.render('login',{});
}

function boardAPI(req,res){
    res.render('board',{});
}

function testAPI(req,res){
    res.render('test',{});
}

function test2API(req,res){
    res.render('test2',{});
}

function join2API(req,res){
    var result = req.body
    console.log(result);
    res.render('join2',{result});
}

function submitAPI(req,res){
    var request = req.body;
    console.log(request);
}




//한국사------------------------------------------------------------------

var StringToDate = function(str){
    var y = str.split("년 ")[0];
    var md = str.split("년 ")[1];
    var m = md.split("월 ")[0];
    var d = md.split("월 ")[1].split("일")[0];
    // console.log(y +"/"+ m+ "/"+ d);
    // var date = new Date(y,m,d).toUTCString();
    var date = y+"-"+m+"-"+d;
    console.log(date);
    return date;
  }
  
  var InsertCertificate = function(time){
    // for (var j = 0; j < 5; j++) {
        // console.log(i);
        var sql = "insert into certificate(time, name, type, organizer) values(?,?,?,?);";
        var params = [time, '한국사능력검정시험', '자격증', '.'];
        connection.query(sql, params, function (err, results) {
            console.log("aa");
        });
    // }
  }
  
  
  var time=[];
  var s_date=[];
  var e_date=[];
  var d_date=[];
  var r_date=[];

//   var KorHistory = function() {
function KorHistoryAPI(req, res) {
    console.log("index/KorHistory router start");
    //시험일정
    //테이블가져오기
  
    var url = 'http://www.historyexam.go.kr/pageLink.do?link=examSchedule';
    tabletojson.convertUrl(url).then(function (tablesAsJson) {
        var TableList=tablesAsJson[0];
        for (var i = 0; i < 5; i++) {
            
            var table = TableList[i];
            
            time[i] = table.구분;
            
            var s2e = table.접수기간;
            var start = s2e.split(" ~ ")[0];
            var end = s2e.split(" ~ ")[1];
            s_date[i] = StringToDate(start);
            e_date[i] = StringToDate(end);

            var examday = table.시험일시;
            d_date[i] = StringToDate(examday);

            var resultday = table.합격자발표;
            r_date[i] = StringToDate(resultday);

            //dbinsert 
            var sql = "insert into certificate(time, name, type, organizer) values(?,?,?,?);";
            var params = [time[i], '한국사능력검정시험', '자격증', '.'];
            connection.query(sql, params, function (err, results) {
                if (err) { console.log("err"); throw err; }
                else { console.log("insert success"); }
            });

            sql="insert into certificate_date(name, d_day, apply_start, apply_end, result_release) values(?,?,?,?,?);";
            params = ['한국사능력검정시험', d_date[i], s_date[i], e_date[i], r_date[i]];
            connection.query(sql, params, function (err, results) {
                if (err) { console.log("err"); throw err; }
                else { console.log("insert success 2"); }
            });


        }
        console.log("time end");
    });
}















//토익------------------------------------------------------------------
//토익 일정
function ToeicCalendarAPI(req, res, next) {
    console.log("index/ToeicCalendar router start");
    //시험일정

    tabletojson.convertUrl(
        'https://appexam.ybmnet.co.kr/toeic/info/receipt_schedule.asp',
        function (tablesAsJson) {
            res.status(200).json({
                tablesAsJson
            });
            // console.log(tablesAsJson[0][0]);
        }
    );
}

//토익 수수료
function ToeicReceiptAPI(req, res, next) {
    console.log("index/ToeicReceipt router start");
    //시험일정

    tabletojson.convertUrl(
        'https://appexam.ybmnet.co.kr/toeic/receipt/receipt.asp',
        function (tablesAsJson) {
            res.status(200).json({
                tablesAsJson
            });
            // console.log(tablesAsJson[0][0]);
        }
    );
}












//큐넷------------------------------------------------------------------
//기술사 시험 시행일정 조회
function EngineerCalendarAPI(req, res, next){
  console.log("index/EngineerCalendar router start");

  var requestUrl = 'http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getPEList?serviceKey=hF0yNmEeBbUo9AfcpeOObbn3XMqzqbO%2BAM45bdxziuTwH8fiUa6DuS6DHcgvWG2BIYovlkYGfXEW9Faj7BXmxQ%3D%3D&'

  request.get(requestUrl, (err, res, body)=> {

     if(err) {
           console.log(`err => ${err}`)
     }
    else {
        if(res.statusCode == 200) {
                  var result = body
                  console.log(`body data => ${result}`)
                  var xmlToJson = convert.xml2json(result, {compact: true, spaces: 4});
                  console.log(`xml to json => ${xmlToJson}`)
         }
     }
  });
}

//기능장 시험 시행일정 조회
function FunctionalCalendarAPI(req, res, next){
  console.log("index/FunctionalCalendar router start");

  var requestUrl = 'http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getMCList?serviceKey=hF0yNmEeBbUo9AfcpeOObbn3XMqzqbO%2BAM45bdxziuTwH8fiUa6DuS6DHcgvWG2BIYovlkYGfXEW9Faj7BXmxQ%3D%3D&'

  request.get(requestUrl, (err, res, body)=> {

     if(err) {
           console.log(`err => ${err}`)
     }
    else {
        if(res.statusCode == 200) {
                  var result = body
                  console.log(`body data => ${result}`)
                  var xmlToJson = convert.xml2json(result, {compact: true, spaces: 4});
                  console.log(`xml to json => ${xmlToJson}`)
         }
     }
  });
}

//기사, 산업기사 시험 시행일정 조회
function IndustrialEngineerCalendarAPI(req, res, next){
  console.log("index/IndustrialEngineerCalendar router start");

  var requestUrl = 'http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getEList?serviceKey=hF0yNmEeBbUo9AfcpeOObbn3XMqzqbO%2BAM45bdxziuTwH8fiUa6DuS6DHcgvWG2BIYovlkYGfXEW9Faj7BXmxQ%3D%3D&'

  request.get(requestUrl, (err, res, body)=> {

     if(err) {
           console.log(`err => ${err}`)
     }
    else {
        if(res.statusCode == 200) {
                  var result = body
                  console.log(`body data => ${result}`)
                  var xmlToJson = convert.xml2json(result, {compact: true, spaces: 4});
                  console.log(`xml to json => ${xmlToJson}`)
         }
     }
  });
}

//기능사 시험 시행일정 조회
function TechnicianCalendarAPI(req, res, next){
  console.log("index/TechnicianCalendar router start");

  var requestUrl = 'http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getCList?serviceKey=hF0yNmEeBbUo9AfcpeOObbn3XMqzqbO%2BAM45bdxziuTwH8fiUa6DuS6DHcgvWG2BIYovlkYGfXEW9Faj7BXmxQ%3D%3D&stdt=2020&'

  request.get(requestUrl, (err, res, body)=> {

     if(err) {
           console.log(`err => ${err}`)
     }
    else {
        if(res.statusCode == 200) {
                  var result = body
                  console.log(`body data => ${result}`)
                  var xmlToJson = convert.xml2json(result, {compact: true, spaces: 4});
                  console.log(`xml to json => ${xmlToJson}`)
         }
     }
  });
}

//종목별 응시수수료 조회>요청변수 종목코드? >http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getFeeList?serviceKey=hF0yNmEeBbUo9AfcpeOObbn3XMqzqbO%2BAM45bdxziuTwH8fiUa6DuS6DHcgvWG2BIYovlkYGfXEW9Faj7BXmxQ%3D%3D&jmcd=1320&

//종목별 시행일정 목록 조회> 종목코드? >http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getJMList?serviceKey=hF0yNmEeBbUo9AfcpeOObbn3XMqzqbO%2BAM45bdxziuTwH8fiUa6DuS6DHcgvWG2BIYovlkYGfXEW9Faj7BXmxQ%3D%3D&jmcd=1320&

//국가전문자격 시험 시행일정 정보>http://openapi.q-net.or.kr/api/service/rest/InquiryTestDatesNationalProfessionalQualificationSVC/getList?serviceKey=hF0yNmEeBbUo9AfcpeOObbn3XMqzqbO%2BAM45bdxziuTwH8fiUa6DuS6DHcgvWG2BIYovlkYGfXEW9Faj7BXmxQ%3D%3D&seriesCd=21&
































//DB---------------------------------------------------------
var db_info = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'password',
    database: 'project'
}

var connection = mysql.createConnection(db_info);


function DBConnectAPI(req, res, next) {
    connection.query("select * from user_info", function (err, results, fields) {
        if (err) throw err;
        console.log("Connected!");
        var dataList = [];
        for (var i = 0; i < results.length; i++) {
            dataList.push(results[i]);
        }
        res.status(200).json({
            dataList
        });
    });
    // connection.end();
}

function DBInsertAPI(req, res, next) {
    console.log("insert!");
    connection.query("insert into user_info values('4','user4','password','email4@email.com','공대','컴퓨터공학과','.');", function (err, results) {
        // console.log(arguments);
        //insert 성공 확인
        if (results.affectedRows > 0) {
            console.log("1");
            res.redirect("/db");
            // res.status(200).json({ message: 'insert success' });
        } else {
            console.log("0");

            // res.status(200).json({ message: 'insert fail' });
        }

    });
}






module.exports = {
    basicAPI: basicAPI,
    searchAPI: searchAPI,
    mypageAPI: mypageAPI,
    joinAPI: joinAPI,
    loginAPI: loginAPI,
    boardAPI: boardAPI,
    testAPI: testAPI,
    test2API: test2API,
    join2API: join2API,
    submitAPI: submitAPI,

    KorHistoryAPI: KorHistoryAPI,
    
    ToeicCalendarAPI: ToeicCalendarAPI,
    ToeicReceiptAPI: ToeicReceiptAPI,
    
    EngineerCalendarAPI: EngineerCalendarAPI,
    FunctionalCalendarAPI: FunctionalCalendarAPI,
    IndustrialEngineerCalendarAPI: IndustrialEngineerCalendarAPI,
    TechnicianCalendarAPI: TechnicianCalendarAPI,

    DBConnectAPI: DBConnectAPI,
    DBInsertAPI: DBInsertAPI,
    
    // GetTestAPI: GetTestAPI,
    // PostTestAPI: PostTestAPI,
    // HtmlTestAPI: HtmlTestAPI,
}


//TEST------------------------------------------------------------------
// function GetTestAPI(req, res) {
//     const message = "this is message";
//     res.status(200).json(message);
//     console.log("index/test router clear");
// }

// function PostTestAPI(req, res) {
//     const user_message = req.body.message;
//     res.status(200).json({
//         "message": user_message
//     });
//     console.log("index/post_test router clear");
// }

// function HtmlTestAPI(req, res, next) {
//     console.log("index/html_test router start");
//     let url = 'https://www.yna.co.kr/sports/all';
//     axios.get(url).then(html => {
//         let ulList = [];
//         const $ = cheerio.load(html.data);
//         const $bodyList = $("div.list-type038 ul").children("li");
//         //each : list 마다 함수 실행, forEach와 동일
//         $bodyList.each(function (i, elem) {
//             ulList[i] = {
//                 //find : 해당 태그가 있으면 그 요소 반환
//                 title: $(this).find('a strong.tit-news').text(),
//                 // url: $(this).find('strong.news-tl a').attr('href'),
//                 // image_url: $(this).find('p.poto a img').attr('src'),
//                 // image_alt: $(this).find('p.poto a img').attr('alt'),
//                 // summary: $(this).find('p.lead').text().slice(0, -11),
//                 // date: $(this).find('span.p-time').text()
//             };
//         });
//         const data = ulList.filter(n => n.title);
//         //json으로 변환하여 app으로 전송
//         return res.json(data);
//     })
// }