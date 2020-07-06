const axios = require("axios");
const cheerio = require("cheerio");
'use strict';
const tabletojson = require("tabletojson").Tabletojson; 

//html 동기로 가져오기
// const getHtml = async () => {
//   try {
//     return await axios.get("https://www.yna.co.kr/sports/all");
//   } catch (error) {
//     console.error(error);
//   }
// };
// getHtml()
//   .then(html => {
//     let ulList = [];
//     const $ = cheerio.load(html.data);
//     const $bodyList = $("div.list-type038 ul").children("li");

//     $bodyList.each(function(i, elem) {
//       ulList[i] = {
//           title: $(this).find('a strong.tit-news').text(),
//       };
//     });

//     const data = ulList.filter(n => n.title);
//     return data;
//   })
//   .then(res => console.log(res));

//테이블 값 가져오기
// 'use strict';
// const tabletojson = require("tabletojson").Tabletojson; 
// tabletojson.convertUrl(
//   'https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes',
//   function(tablesAsJson) {
//       console.log(tablesAsJson[1]);
//   }
// );


//cheerio test
// $ = cheerio.load(html.toString());
// var data = [];
// $('table tr td table tr').each(function (i, td) {

//     var children = $(this).children();
//     var itemNum = children.eq(0);
//     var itemName = children.eq(1);
// });



var mysql = require('mysql');
var db_info = {
    host: 'localhost',
    port:'3306',
    user: 'root',
    password: 'password',
    database: 'project'
}

var connection = mysql.createConnection(db_info);


// connection.query("insert into user_info values('3','user3','password','email3@email.com','공대','컴퓨터공학과','.');",function(err, results, fields) {
//   console.log("insert!");
//   console.log(arguments);

// });

// connection.query("select * from user_info;",function(err, results, fields) {
//   console.log("select!");
//   for(var i =0; i<results.length; i++){
//     console.log(results[i]);
//   }
// });


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
      return 'insert end';
  // }
}


var time=[];
var s_date=[];
var e_date=[];
var d_date=[];
var r_date=[];
var KorHistory = function() {
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
          var sql = "insert into certificate(time, name, type, organizer) values(?,?,?,?);";
          var params = [time[i], '한국사능력검정시험', '자격증', '.'];
          connection.query(sql, params, function (err, results) {
            if(err){console.log("err"); throw err;}
            else { console.log("aaa");}
          }
          )
      }
      //dbinsert 
      console.log("time end");

  });
  console.log("table end");
}


KorHistory();



// connection.end();