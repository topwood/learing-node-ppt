var http = require("http");

http.createServer(function(request, response) {
    
     response.writeHead(200, {"Content-Type": "text/plain"});
     var numOutput = new Number(Math.random()*100).toFixed(0);
     // Write the random number to response
     response.write(numOutput);
     response.end();
}).listen(8888);

console.log("Random Number Generator Running on port 8888...");