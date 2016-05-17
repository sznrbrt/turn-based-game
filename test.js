var usedCards = [];

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
