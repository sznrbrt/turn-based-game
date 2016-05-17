'use strict';

const PORT = 3000;

var express = require('express');
var morgan = require('morgan');
var http = require('http');
var path = require('path');
var poker = require('poker-evaluator');

var app = express();

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

var server = http.createServer(app);

var io = require('socket.io')(server);

var userCount = 0;
var usedCards = [];
var hands = [];
var gameStarted = false;
var usersInGame = 0;

io.on('connection', function(socket) {

	userCount++;
	if (userCount > 0 && userCount < 11) {
		io.emit('playerNum', userCount);
		console.log(userCount);
	}

	if (userCount === 10) {
		gameStarted = true;
		io.emit('gameStart', gameStarted);
	}

	socket.on('launchGame', function() {
		gameStarted = true;
		io.emit('gameStart', gameStarted);
		for(var i = 0; i < userCount; i++) {
			hands.push(createHand());
		}
	})

	socket.on('dealMe', function() {
		var myHand = hands[0];
		hands.shift();
		usersInGame ++;
		socket.emit('myHand', myHand);
	})

	socket.on('disconnect', function() {
		userCount--;
		io.emit('playerNum', userCount);
		console.log('decrease', userCount);
	});
});

function createHand() {
	function createCard () {
		var cards = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
		var colors = ['s', 'd', 'h', 'c'];

		var card = cards[Math.floor(Math.random() * cards.length)] + colors[Math.floor(Math.random() * colors.length)];

		if(usedCards.indexOf(card) === -1) {
			usedCards.push(card);
			return card;
		} else {
			return createCard()
		}
	}


	var hand = [createCard(), createCard(), createCard(), createCard(), createCard()];

	return hand;
}

server.listen (PORT, err => {
	console.log(err || `Server listening on port ${PORT}`);
});
