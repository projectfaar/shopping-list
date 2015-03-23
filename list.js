var http = require("http");
var fs = require("fs");
var querystring = require("querystring");

var wizard = fs.readFileSync("wizard.html").toString();

var wizardCounter = 0;
var wizards = {};

http.createServer(function(req, res) {
	console.log(wizards);

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