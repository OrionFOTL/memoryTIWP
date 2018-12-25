$(document).ready(function () {

	var flipSpeed = 300;

	var numberofCards = 20;
	var cards = [];
	var currentCards = [];
	var punkty = 0;
	var ruchy = 0;

	generateCards();
	assignCards();
	$("#cardsNumber").text(numberofCards);

	function generateCards() {
		for (let i = 0; i < numberofCards; i++) {
			$("#container").append("<div class=\"cardContainer\"><div id=\"" + i + "\" class=\"card\"></div></div>");
		}
	}
	function assignCards() {
		for (let i = 0; i < numberofCards; i++) {
			cards.push({ img: Math.floor(i / 2), uncovered: false });
		}
		cards = shuffle(cards);
	}

	$(".card").click(function (e) {  //przy kliknięciu na kartę

		var clickedCardId = parseInt($(this).attr('id'));

		//jesli kliknięta karta jest zakryta oraz odkryte są tylko jedna lub żadna karta
		if (currentCards.length < 2 && !cards[clickedCardId].uncovered) {

			$(this).animate({ height: "toggle" }, {
				duration: flipSpeed,
				done: function () {
					$(this).css({ "background-image": "url(" + cards[clickedCardId].img + ".png)" });
				}
			});
			//pokaż obrazek na karcie
			$(this).animate({ height: "toggle" }, flipSpeed);
			cards[clickedCardId].uncovered = true;											  //ustaw kartę jako odkryta
			currentCards.push(cards[clickedCardId]);										  //dodaj kartę do odkrytych
			currentCards[currentCards.length - 1].id = clickedCardId;
			if (currentCards.length == 2) {												  //jeśli odkryto już parę kart
				if (currentCards[0].img == currentCards[1].img) {	 //para
					addScore(10);
					currentCards = [];
				}
				else {												 //nie ma pary
					addScore(-5);
					timeout = setTimeout(resetFailedCards, 1300);
				}
				ruchy++;
				$("#ruchy").html(ruchy);
			}
		}
	});

	function resetFailedCards() {
		$("#" + currentCards[0].id).removeAttr('style');
		$("#" + currentCards[1].id).removeAttr('style');
		cards[currentCards[0].id].uncovered = false;
		cards[currentCards[1].id].uncovered = false;
		currentCards = [];
	}
	function addScore(zmiana) {
		punkty += zmiana;
		$("#punkty").html("Twoje punkty: " + punkty);
		if (zmiana > 0) {
			$("#punkty").animate({ color: "#09ff00" }, 300, function () {
				$("#punkty").animate({ color: "black" }, 300)
			});
		} else {
			$("#punkty").animate({ color: "red" }, 300, function () {
				$("#punkty").animate({ color: "black" }, 300)
			});
		}
	}


});

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}