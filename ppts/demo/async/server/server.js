var http = require('http');
var fs = require('fs');
var path = require('path');
var port = 8000;

http.createServer(function(req, res){
	res.setHeader("Access-Control-Allow-Origin","*");
	fs.readFile(path.join(__dirname,'test.txt'),function(err,data){
		console.log('读取文件完成');
		res.end(data);
	});
	console.log('发起读取文件');
    
}).listen(port);


console.log("server started on port " + port);