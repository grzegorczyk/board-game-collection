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
