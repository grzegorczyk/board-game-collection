function erstesSkript(callback) {
    fetch('games.json')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('table-body');

            data.forEach((game, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td class="number">${index + 1}</td>
                <td class="name ${!game.name ? 'disable' : ''}">${game.name ? game.name : 'na'}</td>
                <td class="minPlayer ${!game.minPlayer ? 'disable' : ''}">${game.minPlayer ? game.minPlayer : 'na'}</td>
                <td class="maxPlayer ${!game.maxPlayer ? 'disable' : ''}">${game.maxPlayer ? game.maxPlayer : 'na'}</td>
                <td class="duration ${!game.duration ? 'disable' : ''}">${game.duration ? game.duration : 'na'}</td>
                <td class="privateRating ${!game.privateRating ? 'disable' : ''} badge badgePrivateRatingCount-${game.privateRatingCount ? game.privateRatingCount : 'na'}">${game.privateRating ? game.privateRating : '0'}</td>
                <td class="bggRating ${!game.bggRating ? 'disable' : ''}">${game.bggRating ? game.bggRating : '0'}</td>
                <td class="bggLink ${!game.bggLink ? 'disable' : ''}"><a href="${game.bggLink}" title="${game.name ? game.name : 'na'} on BGG">Link</a></td>
                <td class="place ${!game.place ? 'disable' : ''}">${game.place ? game.place : 'na'}</td>
            `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));

    setTimeout(function() {
        console.log("Erstes Skript abgeschlossen");
        callback(); // Aufruf der Callback-Funktion
    }, 2000);
}

function zweitesSkript() {
    var options = {
        valueNames: [ 'name', 'maxPlayer', 'duration', 'privateRating', 'bggRating' ]
    };

    var userList = new List('games-list', options);
    console.log("Zweites Skript wird ausgeführt");
}

// Aufruf des ersten Skripts mit einer Callback-Funktion
erstesSkript(zweitesSkript);

function filterTable() {
    // Holen Sie den Eingabewert
    var input = document.getElementById("filterInput").value;
    var filterValue = parseInt(input, 10);

    // Update the URL with the filter value
    var newUrl = new URL(window.location.href);
    newUrl.searchParams.set('filter', filterValue);
    window.history.pushState({}, '', newUrl);

    applyFilter(filterValue);
}

function applyFilter(filterValue) {
    // Holen Sie die Tabelle und die Zeilen
    var table = document.getElementById("mainTable");
    var tr = table.getElementsByTagName("tr");

    // Iteriere über alle Tabellenzeilen (außer der Kopfzeile)
    for (var i = 1; i < tr.length; i++) {
        var tdMin = tr[i].getElementsByClassName("minPlayer")[0];
        var tdMax = tr[i].getElementsByClassName("maxPlayer")[0];

        if (tdMin && tdMax) {
            var minValue = parseInt(tdMin.textContent || tdMin.innerText, 10);
            var maxValue = parseInt(tdMax.textContent || tdMax.innerText, 10);

            // Überprüfen, ob die Zeile angezeigt werden soll
            if (filterValue >= minValue && filterValue <= maxValue) {
                tr[i].style.display = "";  // Zeige die Zeile
            } else {
                tr[i].style.display = "none";  // Verstecke die Zeile
            }
        }
    }
}

function getFilterFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('filter');
}

// Beim Laden der Seite den Filter anwenden
window.onload = function() {
    var filterValue = getFilterFromUrl();
    if (filterValue) {
        document.getElementById("filterInput").value = filterValue;
        applyFilter(parseInt(filterValue, 10));
    }
};


// Funktion zum Laden einer externen JSON-Datei
function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'games.json', true); // Pfad zur externen JSON-Datei
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == 200) {
            callback(JSON.parse(xobj.responseText));
        }
    };
    xobj.send(null);
}

// Funktion zum Zufällige Auswahl eines Spiels basierend auf der Spieleranzahl
function chooseGame(gamesData, numPlayers, selectedPlace) {
    var validGames = gamesData.filter(function(game) {
        if (selectedPlace !== "random") {
            return game.maxPlayer >= numPlayers &&
                game.minPlayer <= numPlayers &&
                game.place === selectedPlace;
        } else {
            return game.maxPlayer >= numPlayers &&
                game.minPlayer <= numPlayers;
        }
    });

    if (validGames.length === 0) {
        return "no game available for the specified number of players.";
    }

    var randomIndex = Math.floor(Math.random() * validGames.length);
    return validGames[randomIndex];
}

// Funktion, die beim Klick auf den Button aufgerufen wird
function selectGame() {
    var numPlayers = parseInt(document.getElementById("playerCount").value);
    var selectedPlace = document.getElementById("gamePlace").value;
    loadJSON(function(gamesData) {
        var selectedGame = chooseGame(gamesData, numPlayers, selectedPlace);
        document.getElementById("selectedGame").innerHTML = "the random game for " + numPlayers + " players is:<br><br> <b>" + selectedGame.name + "</b>" + selectedGame.minPlayer + " - " + selectedGame.maxPlayer + " player<br>" + selectedGame.duration + " min<br>" + selectedGame.privateRating + " rating<br>" + selectedGame.bggRating + " bgg rating<br><a href='" + selectedGame.bggLink + "' target='_blank'>bgg link</a><br>at " + selectedGame.place;
    });
}

// Den Button mit der Funktion verknüpfen
document.getElementById("selectGameButton").addEventListener("click", selectGame);
