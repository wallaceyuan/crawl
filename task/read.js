/**
 * Created by Yuan on 2016/4/3.
 */
var requset = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

exports.category = function(url,callback){
    requset({url:url,encoding:null},function(err,res,body){
        if(err){
            return console.error(err);
        }
        //把gbk编码的buffer转成utf8编码的字符串
        body = iconv.decode(body,'gbk');
        //根据响应体转成DOM对象
        var $ = cheerio.load(body);
        var items = [];
        //找到所有的分类的A标签并进行转换
        $('.hd .title a').each(function(){
            var $me = $(this);
            //<a href="http://top.baidu.com/buzz?b=353&amp;c=10&amp;fr=topcategory_c10">玄幻奇幻</a>
            var item = {
                name:$me.text().trim(),
                url:$me.attr('href')
            }
            var params = regParams(item.url);
            item.id = params.b;
            items.push(item);
        });
        callback(null,items);
    });
}

function regParams(url){
    var obj = {};
    var reg = /([^?&=]*)=([^?&=]*)/g;
    url.replace(reg,function(src,$1,$2){
        obj[$1] = $2;
    });
    return obj;
}

exports.article = function(url,cid,callback){
    requset({url:url,encoding:null},function(err,res,body){
        if(err){
            return console.error(err);
        }
        //把gbk编码的buffer转成utf8编码的字符串
        body = iconv.decode(body,'gbk');
        //根据响应体转成DOM对象
        var $ = cheerio.load(body);
        var items = [];
        //找到所有的分类的A标签并进行转换
        $('.keyword a').each(function(){
            var $me = $(this);
            var item = {
                name:$me.text().trim(),
                url:$me.attr('href'),
                cid:cid
            }
            if(item.name != 'search'){
                items.push(item);
            }
        });
        callback(null,items);
    });
}