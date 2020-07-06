const axios = require("axios");
const cheerio = require("cheerio");
const tabletojson = require("tabletojson").Tabletojson;
var mysql = require('mysql');

function basicAPI(req, res) {
    // res.status(200).json({
        //     "success":true
        //   });
        res.redirect('basic.html');
        console.log("index router clear");
    }
    
//TEST------------------------------------------------------------------
function GetTestAPI(req, res) {
    const message = "this is message";
    res.status(200).json(message);
    console.log("index/test router clear");
}

function PostTestAPI(req, res) {
    const user_message = req.body.message;
    res.status(200).json({
        "message": user_message
    });
    console.log("index/post_test router clear");
}

function HtmlTestAPI(req, res, next) {
    console.log("index/html_test router start");
    let url = 'https://www.yna.co.kr/sports/all';
    axios.get(url).then(html => {
        let ulList = [];
        const $ = cheerio.load(html.data);
        const $bodyList = $("div.list-type038 ul").children("li");
        //each : list 마다 함수 실행, forEach와 동일
        $bodyList.each(function (i, elem) {
            ulList[i] = {
                //find : 해당 태그가 있으면 그 요소 반환
                title: $(this).find('a strong.tit-news').text(),
                // url: $(this).find('strong.news-tl a').attr('href'),
                // image_url: $(this).find('p.poto a img').attr('src'),
                // image_alt: $(this).find('p.poto a img').attr('alt'),
                // summary: $(this).find('p.lead').text().slice(0, -11),
                // date: $(this).find('span.p-time').text()
            };
        });
        const data = ulList.filter(n => n.title);
        //json으로 변환하여 app으로 전송
        return res.json(data);
    })
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
    GetTestAPI: GetTestAPI,
    PostTestAPI: PostTestAPI,
    HtmlTestAPI: HtmlTestAPI,
    KorHistoryAPI: KorHistoryAPI,
    DBConnectAPI: DBConnectAPI,
    DBInsertAPI: DBInsertAPI,

}
