var express = require('express');
var fs = require('fs');
var path = require('path');
var app = express();

var pointer = 0;

var filtered_results = [];
var filtered_results_addtime = [];

function getAllFilePaths(dir) {
  const filePaths = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);
    if (fileStat.isDirectory()) {
      // 如果是子目录，递归调用 getAllFilePaths 函数
      filePaths.push(...getAllFilePaths(filePath));
    } else {
      // 否则，将文件路径添加到结果数组中
      filePaths.push(filePath);
    }
  }
  return filePaths;
}

function getFileCreationTime(filePath) {
  const stats = fs.statSync(filePath);
  return stats.birthtime;
}

// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     next();
// })

app.get('/', function (req, res) {
  console.log(filtered_results);
  res.send("服务器启动成功");
})

app.get('/list', function (req, res) {
  const filePaths = getAllFilePaths(__dirname);
  for (var i=0;i<filePaths.length;i++){
    var string = filePaths[i];
    var stringlength = string.length;
    if(string.substring(stringlength-4, stringlength) === ".mp4"){
      if (filtered_results.indexOf(filePaths[i].substring(27,)) === -1) {
        filtered_results.push(filePaths[i].substring(27,));
        filtered_results_addtime.push(getFileCreationTime(filePaths[i]));
      }
    }
  }
  // console.log(filtered_results);
  pointer = pointer + 1;
  let callback = req.query.callback;
  let data = { addr: filtered_results, time:filtered_results_addtime };
  console.log("页面加载"+pointer);
  res.send(callback + '(' + JSON.stringify(data) + ')');
})

var server = app.listen(8081, function () {
  console.log("启动成功");
})
