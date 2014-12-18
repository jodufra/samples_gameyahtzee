var app = require('express')();
var fs = require('fs');
var options = {
	//	key: fs.readFileSync('/home/vagrant/grp31/site/app/keys/server.key'),
	//	cert: fs.readFileSync('/home/vagrant/grp31/site/app/keys/server.crt')
	key: fs.readFileSync('/var/www/html/laravel/app/keys/server.key'),
	cert: fs.readFileSync('/var/www/html/laravel/app/keys/server.crt')
};
var https = require('https').Server(options, app);

var io = require('socket.io')(https);
//var redis = require('socket.io-redis');
//io.adapter(redis({ host: 'localhost', port: 6379 }));

console.log('Yahtzee RT Server started ... Loading Modules:');
exports.io = io;

var firstClient = true;
io.on('connection', function(socket) {
	if (firstClient) {
		console.log('First Client Connected! - '+ socket.id);
		console.log('Loading Modules');
		firstClient = false;
	}else{
		console.log('Client Connected! - '+ socket.id);
	}

	require('./routes/test')(io, socket);
	require('./routes/chat')(io, socket);

	socket.on('disconnect', function() {
		console.log('Client Disconnected! - '+ socket.id);
	});
});

https.listen(3000, function(){
	console.log("Listening on *:3000");
})