'use strict';

const PORT = 3000;

var express = require('express');
var morgan = require('morgan');
var http = require('http');
var path = require('path');
var poker = require('poker-evaluator');
var PokerEvaluator = require("poker-evaluator");

var app = express();

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	if(!gameStarted)
		res.sendFile(path.join(__dirname, 'index.html'));
	else
		res.sendFile(path.join(__dirname, 'occupied.html'));
});

var server = http.createServer(app);

var io = require('socket.io')(server);

var userCount = 0;
var usedCards = [];
var hands = [];
var gameStarted = false;
var usersInGame = 0;
var handranks = [];
var winnerHandIdx = null;
var winningHandRank = 0;
var winningHandName = null;

io.on('connection', function(socket) {
	initGame();
	function initGame() {
		// userCount = 0;
		usedCards = [];
		hands = [];
		gameStarted = false;
		usersInGame = 0;
		handranks = [];
		winnerHandIdx = null;
		winningHandRank = 0;

		userCount++;
		if (userCount > 0 && userCount < 10) {
			io.emit('playerNum', userCount);
			console.log(userCount);
		}

		if (userCount === 9) {
			gameStarted = true;
			io.emit('gameStart', gameStarted);
		}

		socket.on('launchGame', function() {
			gameStarted = true;
			io.emit('gameStart', gameStarted);
			for(var i = 0; i < userCount; i++) {
				hands.push(createHand());
			}
			console.log('hands:', hands);
			handranks = hands.map((hand) => {
				return PokerEvaluator.evalHand(hand);
			})
			for(var z = 0; z < handranks.length; z++) {
				console.log('handranks:', handranks[z]);
				if(handranks[z].handRank > winningHandRank){
					winningHandRank = handranks[z].handRank;
					winnerHandIdx = z;
					winningHandName = handranks[z].handName;
				}
			}
			console.log('winnerHandIdx', winnerHandIdx);
		})

		socket.on('dealMe', function() {
			var myHand = hands[0];
			hands.shift();
			socket.emit('myHand', myHand);
			usersInGame ++;
			if(usersInGame === userCount) {
				io.emit('turnEnded', null)
			}
		})

		socket.on('myHand', (handArr) => {
			var rankOfMyHand = PokerEvaluator.evalHand(handArr).handRank;
			var result = null;
			if(rankOfMyHand === winningHandRank) result = 'win';
			else result = 'lose';
			socket.emit('result', {"result":result, 'winner': winningHandName});
		})

		socket.on('restart', (val) => {
			if(val) initGame();
		})


		socket.on('disconnect', function() {
			userCount--;
			io.emit('playerNum', userCount);
		});
	}

});

function createHand() {
	function createCard () {
		var cards = ['A','2','3','4','5','6','7','8','9','J','Q','K'];
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
