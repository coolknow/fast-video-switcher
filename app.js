var express = require('express');
var fs = require('fs');
var path = require('path');
var app = express();

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

var filtered_results = [];

walk(__dirname, function(err, results) {
  if (err) throw err;
  for (var i=0;i<results.length;i++){
    var string = results[i];
    var stringlength = string.length;
    if(string.substring(stringlength-4, stringlength) === ".mp4"){
      filtered_results.push(results[i].substring(27,));
    }
  }
});

var pointer = 0;


// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     next();
// })

app.get('/', function (req, res) {
  console.log(filtered_results);
  res.send("服务器启动成功");
})

app.get('/list', function (req, res) {
  pointer = pointer + 1;
  let callback = req.query.callback;
  let data = { addr: filtered_results};
  console.log("页面加载"+pointer);
  res.send(callback + '(' + JSON.stringify(data) + ')');
})

var server = app.listen(8081, function () {
  console.log("启动成功");
})
