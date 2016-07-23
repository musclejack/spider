var cheerio = require('cheerio')
var fs = require('fs')
var superagent = require('superagent')
var async = require('async')
global.aUrls = [];
global.imgUrls = [];
var hash = {};
var num = 0;
var urlnum = 0;
var index = 0;
var indexnum = 0;
var imgnum = 0;
var oldArr ,newasync;
//连接
function connet(href,callback){
    if (!href) {
        return;
    }
    num ++ ;
    urlnum ++;
    indexnum ++;
    console.log('现在的并发数是', num, '，正在抓取第',urlnum ,'个，是',href,'头像数目',imgnum,'url队列数',global.aUrls.length);
    superagent.get(href)
        .end(function(err,sres){
            callback(null)
            finder(err,sres)
        })
}
//去重 
function contains(obj){
    if (hash[obj]) {return true}
    else{hash[obj] = true;
        return false}
}
function finder(err,sres){
    var $,$href, $img,$hrefother;
    //容错
    if(err){
        connet(global.aUrls.pop())
        return;
    }
    $ = null;
    $ = cheerio.load(sres.text);
    //获取连接，加入连接池
    $('.zm-invite-pager>span>a').each(function(idx,element){
        $href = $(element).attr('href');
        if(!contains('http://www.zhihu.com/topic/19550228/top-answers'+$href)){
            global.aUrls.push('http://www.zhihu.com/topic/19550228/top-answers'+$href)
        }
    })
    $('.question_link').each(function(idx,element){
        $href = $(element).attr('href');
        if(!contains('http://www.zhihu.com'+$href)){
            global.aUrls.push('http://www.zhihu.com'+$href)
        }
    })
    //获取头像，加入头像数组
    $('.zm-list-avatar').each(function(idx,element){
        $img = $(element).attr('src');
        if(!contains($img)){
            fs.appendFile('E:/test.html', '<img src = "'+$img+'"/>', function (data) {
                imgnum++;
            });
        } 
    })
    num -- 
}
//复制对象
function clone(origin) {
  let originProto = Object.getPrototypeOf(origin);
  return Object.assign(Object.create(originProto), origin);
}
//递归查询
var asyncFun = function(aUrlArr){
    oldArr = null;
    newasync = null;
    oldArr = aUrlArr.concat([]);
    newasync = clone(async);
    function promise (){
        return new Promise(function(resolve){
            newasync.mapLimit(oldArr,10,function(url,callback){
                            connet(url,callback)
                            },function (err, result) {
                                index ++;
                                console.log('第',index,'次递归,跑了',indexnum,'次')
                                indexnum = 0;
                                resolve(index)
                            })
        }) 
    }
   promise().then(
    function(){
        newasync = null;
        global.aUrls.splice(0,oldArr.length)
        asyncFun(global.aUrls)}
    )
}
//入口
superagent.get('http://www.zhihu.com/topic/19550228/top-answers')
    .end(function(err,sres){
        finder(err,sres);
        asyncFun(global.aUrls)
    })