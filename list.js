var http = require("http");
var fs = require("fs");

var wizard = fs.readFileSync("wizard.html").toString();

http.createServer(function(req, res) {
	if(req.url == "/") {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(wizard);
	} else {

	}
}).listen(8080);