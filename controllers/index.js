const axios = require("axios");
const cheerio = require("cheerio");
const tabletojson = require("tabletojson").Tabletojson; 


function basicAPI(req, res) {
    // res.status(200).json({
    //     "success":true
    //   });
    res.redirect('basic.html');
    console.log("index router clear");
}

function GetTestAPI(req, res) {
    const message="this is message";
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



function KorHistoryAPI(req, res, next) {
    console.log("index/KorHistory router start");
    //시험일정

    tabletojson.convertUrl(
        'http://www.historyexam.go.kr/pageLink.do?link=examSchedule',
        function (tablesAsJson) {
            res.status(200).json({
                tablesAsJson
            });
            // console.log(tablesAsJson[1]);
        }
    );
    // let url = 'http://www.historyexam.go.kr/pageLink.do?link=examSchedule';

    // axios.get(url).then(html => {
    //     let ulList = [];
    //     const $ = cheerio.load(html.data);
    //     const $bodyList = $("div.right_contents").children("table tbody");
    //     //each : list 마다 함수 실행, forEach와 동일
    //     $bodyList.each(function (i, elem) {
    //         // var tabledata=$(this).find("th").text();
    //         // console.log("th : "+tabledata );
    //         ulList[i] = {
    //         //     //find : 해당 태그가 있으면 그 요소 반환
    //             title: $(this).find('tr').text(),
    //         //     // url: $(this).find('strong.news-tl a').attr('href'),
    //         //     // image_url: $(this).find('p.poto a img').attr('src'),
    //         //     // image_alt: $(this).find('p.poto a img').attr('alt'),
    //         //     // summary: $(this).find('p.lead').text().slice(0, -11),
    //         //     // date: $(this).find('span.p-time').text()
    //         };
    //     });
    //     const data = ulList.filter(n=>n.title);
    //     //json으로 변환하여 app으로 전송
    //     return res.json(data);
    // })
}


// 'use strict';
// tabletojson.convertUrl(
//   'https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes',
//   function(tablesAsJson) {
//       console.log(tablesAsJson[1]);
//   }
// );











//------------------------------------------------------------------
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
   

module.exports = {
    basicAPI: basicAPI,
    GetTestAPI: GetTestAPI,
    PostTestAPI: PostTestAPI,
    HtmlTestAPI: HtmlTestAPI,
    KorHistoryAPI:KorHistoryAPI,
}
