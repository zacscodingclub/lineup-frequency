var      csv = require('fast-csv'),
          fs = require('fs'),
        args = process.argv,
       index = 0,
     players = {},
   startTime = Date.now();

var fileName = args[2];
var readStream = fs.createReadStream(fileName);

function exitMessage() {
	var endTime = Date.now();
	var runTime = (endTime - startTime)/1000
	console.log(`Processing completed in ${runTime}s. Index: ${index}`);
}

function getRegex(fileName) {
    if(fileName.includes("nhl")) {
        return /C\W|W\W|D\W|G\W|UTIL\W/g;
    } else if (fileName.includes("nfl")) {
        return /QB\W|RB\W|WR\W|TE\W|FLEX\W/g;
    }

}

function getPlayersFromLineup(lineup, player) {
    var regex = getRegex(fileName);
    var splitLineup = lineup.split(regex);
    var newLineup = splitLineup.slice(1,splitLineup.length);
    newLineup.push(player);
    return newLineup
}

function addPlayerToPlayers(player) {
    if (players[player]) {
        players[player] ++;
    } else {
        players[player] = 1;
    }
}

function processLineup(lineup){
    var processedLineup = lineup.map(Function.prototype.call, String.prototype.trim);

    processedLineup.forEach(function(player){
        if (player) {
            addPlayerToPlayers(player);
        }
    });
}

function sortProperties(obj) {
    var sortable=[];
    for(var key in obj)
        if(obj.hasOwnProperty(key))
            sortable.push([key, obj[key]]);

    sortable.sort(function(a, b) {
      return a[1]-b[1];
    });

    return sortable.reverse();
}

function printOutput(players) {
    var counter = 1;
    players.forEach(function(player) {
        console.log(`${counter}. ${player[0]}, ownership%: ${player[1]/index}`)
        counter++;
    });
}

csv
    .fromStream(readStream, { headers: true})
    .on("data", function(row){
        var rowLineup = getPlayersFromLineup(row.Lineup, row.Player);
        processLineup(rowLineup);
        index ++;
    })
    .on("end", function() {
        var sortedPlayers = sortProperties(players);

        printOutput(sortedPlayers);

        exitMessage();
    })



    // { Rank: '97',
    //   EntryId: '557626952',
    //   EntryName: 'SurlySue (4/8)',
    //   TimeRemaining: '0',
    //   Points: '47.2',
    //   Lineup: 'C Tyler Bozak C Connor McDavid W James van Riemsdyk W Patrick Maroon W Mitchell Marner D Morgan Rielly D Ivan Provorov G Anders Nilsson UTIL Jordan Eberle',
    //   '': '',
    //   Player: 'Andrej Sekera',
    //   '%Drafted': '2.60%',
    //   FPTS: '0' }
