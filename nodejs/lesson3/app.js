
// 引入依赖
var express = require('express');
// var utility = require('utility');
var superagent = require('superagent');
var cheerio = require('cheerio');

// 建立 express 实例
var app = express();
app.get('/', function (req, res, next) {
    // 用 superagent 去抓取 https://cnodejs.org/ 的内容
    superagent.get('https://cnodejs.org/')
        .end(function (err, sres) {
            // console.log(sres);

            // 常规的错误处理
            if (err) {
                return next(err);
            }
            // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
            // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
            // 剩下就都是 jquery 的内容了
            var $ = cheerio.load(sres.text);
            var items = [];
            $('#topic_list .cell').each(function (idx, element) {
                var elementTitle = $(element).find('.topic_title')[0];
                var elementUser = $(element).find('.user_avatar')[0];
                console.log(elementUser);

                items.push({
                    title: $(elementTitle).attr('title'),
                    href: $(elementTitle).attr('href'),
                    user: $(elementUser).attr('href')
                });
            });

            res.send(items);
        });
});

app.listen(3000, function (req, res) {
    console.log('app is running at port 3000');
});