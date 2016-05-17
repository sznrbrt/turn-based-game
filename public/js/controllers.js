'use strict';

var app = angular.module('pokerApp');

app.controller('mainCtrl', function(mySocket, $scope) {
	$scope.playerNum = 0;
	$scope.myHand = null;
	$scope.gameStarted = false;
	$scope.cardsForDisplay = [];

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
		console.log(myHand);
		$scope.myHand = myHand;
		$scope.cardsForDisplay = myHand.map((card) => {
			var cardC = card.split('').pop();
			var cardFV = card.split('').splice(0, (card.length -1)).join('');
			return {color: cardC, facevalue: cardFV};
		}).map((handObj) => {
			console.log('FV:', handObj.facevalue);
			if(handObj.facevalue === 'A') handObj.facevalue = '1';
			if(handObj.facevalue === 'J') handObj.facevalue = 'B';
			if(handObj.facevalue === '10') handObj.facevalue = 'A';
			if(handObj.facevalue === 'Q') handObj.facevalue = 'D';
			if(handObj.facevalue === 'K') handObj.facevalue = 'E';
			return handObj;
		}).map(createCardCode);
		console.log($scope.cardsForDisplay);
	})


	function createCardCode(cardObj) {
		if(cardObj.color === 's') return `&#x1F0A${cardObj.facevalue};`
		if(cardObj.color === 'h') return `&#x1F0B${cardObj.facevalue};`
		if(cardObj.color === 'c') return `&#x1F0C${cardObj.facevalue};`
		if(cardObj.color === 'd') return `&#x1F0D${cardObj.facevalue};`
	}

	// &#x1F0BB;

});
