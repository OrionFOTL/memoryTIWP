$(document).ready(function () {

	var flipSpeed = 300;

	var numberofCards = 20;
	var cards = [];						//tablica na wszystkie karty; wartość to identyfikator obrazka przypisanego karcie o danym indeksie
	var currentCards = [];				//tablica na obecnie odkrywaną parę kart
	var punkty = 0;
	var ruchy = 0;
	var pozostaleKarty = 20;

	var winners = [];

	start();

	function start() {
		cards = [];
		currentCards = [];
		punkty = 0;
		ruchy = 0;
		pozostaleKarty = numberofCards;
		$("#container").html("");							//czyszczenie diva z kartami
		$("#cardsNumber").text(numberofCards);				//update liczby kart
		generateCards();									//generowanie divów na karty
		assignCards();										//przypisanie każdej karcie obrazka
		$("#punkty").html("Twoje punkty: " + punkty);		//update punktów
		$("#ruchy").html(ruchy);							//update ruchów

		$(".card").on('click', function (e) {  				//przy kliknięciu na kartę

			var clickedCardId = parseInt($(this).attr('id'));

			//jesli kliknięta karta jest zakryta oraz odkryte są tylko jedna lub żadna karta
			if (currentCards.length < 2 && !cards[clickedCardId].uncovered) {

				//animacja odwaracania
				$(this).animate({ height: "toggle" }, {
					duration: flipSpeed,
					done: function () {						//ustawienie tła karty na przypisany obrazek
						$(this).css({ "background-image": "url(" + cards[clickedCardId].img + ".png)" });
					}
				});
				$(this).animate({ height: "toggle" }, flipSpeed);

				cards[clickedCardId].uncovered = true;								//ustaw kartę jako odkryta
				currentCards.push(cards[clickedCardId]);							//dodaj kartę do odkrytych
				currentCards[currentCards.length - 1].id = clickedCardId;

				//jeśli kliknięcie odkryło drugą kartę z kolei, sprawdź czy para kart ma ten sam owoc
				if (currentCards.length == 2) {
					if (currentCards[0].img == currentCards[1].img) {	 //para
						addScore(10);
						pozostaleKarty -= 2;
						currentCards = [];
						checkIfFinished();
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
	}

	function generateCards() {						//wygeneruj divy z kartami
		for (let i = 0; i < numberofCards; i++) {
			$("#container").append("<div class=\"cardContainer\"><div id=\"" + i + "\" class=\"card\"></div></div>");
		}
	}
	function assignCards() {						//przypisz kartom kolejno ID obrazków, po dwie karty na jeden ID
		for (let i = 0; i < numberofCards; i++) {
			cards.push({ img: Math.floor(i / 2), uncovered: false });
		}
		cards = shuffle(cards);						//pomieszaj karty
	}

	function resetFailedCards() {					//zasłoń ostatnią parę kart jeśli obrazki się nie zgadzały
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

	function checkIfFinished() {
		if (pozostaleKarty == 0) {
			winners.push({ name: prompt("Wygrałeś! Wpisz swoje imię:"), score: punkty });
			winners.sort(compareWinners);
			refreshScoreboard();
		}
	}

	function compareWinners(a, b) {				//funcja używana przez winners.sort() do sortowania wyników
		return b.score - a.score;
	}

	function refreshScoreboard() {
		$("#scoreboard").empty();
		for (let i = 0; i < winners.length; i++) {
			$("#scoreboard").append("<li>" + winners[i].name + ": " + winners[i].score + " punktów</li>");
		}
		prepareDownload();
	}

	$("#cardLess").click(function (e) {
		if (parseInt($("#cardsNumber").text()) > 2) {
			numberofCards -= 2;
			$("cardsNumber").text(numberofCards);
			start();
		}
	});
	$("#cardMore").click(function (e) {
		if (parseInt($("#cardsNumber").text()) < 32) {
			numberofCards += 2;
			$("#cardsNumber").text(numberofCards);
			start();
		}
		else alert("Brakuje obrazków aby zrobić więcej kart!")
	});

	$("#restart").click(function (e) {
		start();
	});

	function prepareDownload() {					//zapis wyników do pliku
		var eksportVals = "";
		for (let i = 0; i < winners.length; i++) {
			eksportVals += i + 1 + ". " + winners[i].name + ": " + winners[i].score + " punktów\n";
		}
		$("#eksport").attr('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(eksportVals));
		$("#eksport").attr('download', 'wyniki.txt');
		$("#eksport").text('Zapisz wyniki do pliku!');
	}
});

function shuffle(array) {							//tasowanie kart
	var currentIndex = array.length, temporaryValue, randomIndex;
	//jeśli są jeszcze nieprzetasowane elementy
	while (0 !== currentIndex) {

		// weź nieprzetasowany element
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// zamień z bieżącym elementem
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}