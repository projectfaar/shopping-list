var http = require("http");
var fs = require("fs");
var net = require("net");
var querystring = require("querystring");

var wizard = fs.readFileSync("wizard.html").toString();

var wizardCounter = 0;
var wizards = {};

var masterToken = "CATSONRATS";

http.createServer(function(req, res) {
	if(req.url == "/") {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(wizard);
	} else if(req.url.slice(0, "/fetch/".length) == "/fetch/") {
		var data = JSON.parse(querystring.unescape(req.url.slice("/fetch/".length)));

		var response = null;

		if(data.type == "auth") {
			wizards[wizardCounter] = [];

			// TODO: prevent collisions, maybe
			response = {
				type: "auth",
				token: wizardCounter++
			};
		} else if(data.type == "add") {
			if(wizards[data.token]) {
				wizards[data.token].push(data.product);
			}

			response = {
				type: "add",
				product: data.product,
				success: true
			}
		} else if(data.type == "remove") {
			console.logo("TODO: remove");
		}

		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end("JSONPCallback("+JSON.stringify(response)+")");
	} else {
		console.log("Unknown endpoint "+req.url);
		console.log(req.url.slice(0, "/fetch/".length));
	}
}).listen(8888);

net.createServer(function(conn) {
	conn.on('data', function(d) {
		try {
			if(d.toString().split(",")[0] == masterToken) {
				var bits = d.toString().trim().split(",")[1];
				conn.write(JSON.stringify(wizards[bits]));
			}			
		} catch(e) {
			console.error(e);
		}
	})
}).listen(1337);