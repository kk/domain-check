readFile = './wordlist.txt'
appendFile = './untaken.txt'

extension = '.io'        // change this to the desired domain extension


var RateLimiter = require('limiter').RateLimiter;
var limiter = new RateLimiter(35, 'second', true);   // please limit the amount of requests per timeframe appropriately

var whois = require('whois-json');
var fs = require('fs');
const readline = require('readline');
var lineReader = require('line-reader');
var stream = require('stream');
const dns = require('dns');

var instream = fs.createReadStream(readFile);
var outstream = new stream;
var rl = readline.createInterface(instream, outstream);

//////////////////////////////////////

function checkAvailable( url ) {
    dns.resolve4( url, function (err, addresses) {
        if (!err) {
                    console.log(url + " is taken");
        }
        else {
                if (err.code === 'ENOTFOUND') {
                    console.log (url + " is available!!!");
                    fs.appendFile(appendFile, url + "\r\n", function (err) {     
                        if (err) throw err;     
                    });
                }
            }
        })
}

rl.on('line', function(line) {
    limiter.removeTokens(1, function(err, remainingRequests) {
        checkAvailable( line + extension );
    })
});


rl.on('close', function() {
  console.log('complete');
});