$(document).ready(function () {

	var numberofCards = 20;
	var cards = [];
	var currentCards = [];
	var punkty = 0;

	for (let i = 0; i < numberofCards; i++) {
		$("#container").append("<div class=\"cardContainer\"><div id=\"" + i + "\" class=\"card\"></div></div>");
	}

	for (let i = 0; i < numberofCards; i++) {
		cards.push({ img: Math.floor(i / 2), uncovered: false });
	}
	cards = shuffle(cards);

	$(".card").click(function (e) {  //przy kliknięciu na kartę

		var clickedCardId = parseInt($(this).attr('id'));

		//jesli kliknięta karta jest zakryta oraz odkryte są tylko jedna lub żadna karta
		if (currentCards.length < 2 && !cards[clickedCardId].uncovered) {

			$(this).animate({ height: "toggle" }, {
				done: function () {
					$(this).css({ "background-image": "url(" + cards[clickedCardId].img + ".png)" });
				}
			});
			//pokaż obrazek na karcie
			$(this).animate({ height: "toggle" });
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
		$("#punkty").html(punkty);
		if (zmiana > 0) {
			$("#punkty").animate({ fontSize: "150%", color: "green" }, 200, function () {
				$("#punkty").animate({ fontSize: "100%", color: "black" }, 200)
			});
		} else {
			$("#punkty").animate({ fontSize: "150%", color: "red" }, 200, function () {
				$("#punkty").animate({ fontSize: "100%", color: "black" }, 200)
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