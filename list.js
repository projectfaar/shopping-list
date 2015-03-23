var http = require("http");
var fs = require("fs");
var querystring = require("querystring");

var wizard = fs.readFileSync("wizard.html").toString();

http.createServer(function(req, res) {
	if(req.url == "/") {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(wizard);
	} else if(req.url.slice(0, "/fetch/".length) == "/fetch/") {
		var data = JSON.parse(querystring.unescape(req.url.slice("/fetch/".length)));

		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end("JSONPCallback("+JSON.stringify(data)+")");
	} else {
		console.log("Unknown endpoint "+req.url);
		console.log(req.url.slice(0, "/fetch/".length));
	}
}).listen(8888);