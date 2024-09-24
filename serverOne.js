var http = require('http'); 

var server = http.createServer(function (req, res) {   
    if (req.url == '/data') { //check the URL of the current request
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ message: "Hello World"}));  
        res.end();  
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('404 Not Found');
        res.end();
    }
});

server.listen(5678);

console.log('Node.js web server at port 5678 is running..')
