var      csv = require('fast-csv'),
          fs = require('fs'),
        args = process.argv,
   startTime = Date.now();

var fileName = args[2];
var readStream = fs.createReadStream(fileName);

function exitMessage() {
	var endTime = Date.now();
	var runTime = (endTime - startTime)/1000
	console.log(`Processing completed in ${runTime}s.`);
}

csv
    .fromStream(readStream, { headers: true})
    .on("data", function(row){
        console.log(row);
    })
    .on("end", function() {
        exitMessage();
    })
