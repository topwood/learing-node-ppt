var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/customer', function(req, res){
res.send('customer page');
});
app.get('/admin', function(req, res){
res.send('admin page');
});

app.listen(8888);