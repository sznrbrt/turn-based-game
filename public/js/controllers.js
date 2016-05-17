'use strict';

var app = angular.module('pokerApp');

app.controller('mainCtrl', function(mySocket, $scope) {
	$scope.playerNum = 0;
	$scope.myHand = null;
	$scope.gameStarted = false;
	$scope.cardsForDisplay = [];
	$scope.handStore = [];
	$scope.isFinished = false;
	$scope.result = null;

	mySocket.on('playerNum', function(playerNum) {
		$scope.playerNum = playerNum;
		console.log(playerNum);
	})

	mySocket.on('gameStart', function() {
		console.log('gameStarted');
		$scope.gameStarted = true;
	})

	$scope.startGame = function() {
		mySocket.emit('launchGame', null);
	}
	$scope.dealMe = function() {
		mySocket.emit('dealMe', null);
	}

	mySocket.on('myHand', function(myHand) {
		$scope.handStore = myHand.map((card) => {
			var cardC = card.split('').pop();
			var cardFV = card.split('').splice(0, (card.length -1)).join('');
			if(cardFV === '10') cardFV = 'T';
			return cardFV + cardC;
		});
		console.log($scope.handStore);
		$scope.myHand = myHand;
		$scope.cardsForDisplay = myHand.map((card) => {
			var cardC = card.split('').pop();
			var cardFV = card.split('').splice(0, (card.length -1)).join('');
			return {color: cardC, facevalue: cardFV};
		}).map((handObj) => {
			if(handObj.facevalue === 'A') handObj.facevalue = '1';
			if(handObj.facevalue === 'J') handObj.facevalue = 'B';
			if(handObj.facevalue === '10') handObj.facevalue = 'A';
			if(handObj.facevalue === 'Q') handObj.facevalue = 'D';
			if(handObj.facevalue === 'K') handObj.facevalue = 'E';
			return handObj;
		}).map(createCardCode);
	})

	mySocket.on('turnEnded', function() {
		console.log();
		mySocket.emit('myHand', $scope.handStore);
	})

	mySocket.on('result', function(result) {
		$scope.isFinished = true;
		if(result.result === 'win')
			$scope.result = 'You Win!'
			$scope.winnerHandName = result.winner;
		if(result.result === 'lose')
			$scope.result = 'You lose!'
			$scope.winnerHandName = result.winner;
			console.log($scope.winnerHandName);
	})


	function createCardCode(cardObj) {
		if(cardObj.color === 's') return `<span style="color:black">&#x1F0A${cardObj.facevalue};</span>`
		if(cardObj.color === 'h') return `<span style="color:red">&#x1F0B${cardObj.facevalue};</span>`
		if(cardObj.color === 'c') return `<span style="color:red">&#x1F0C${cardObj.facevalue};</span>`
		if(cardObj.color === 'd') return `&#x1F0D${cardObj.facevalue};`
	}

	$scope.restart = function() {
		mySocket.emit('restart', true);
		window.location.reload();
	}

});
