var fs = require('fs');
var morgan = require('morgan');



//log info ********
var accessLogStream = fs.createWriteStream(__dirname +'/access.log', {flags: 'a'})
module.exports =   morgan('combined', {stream: accessLogStream});
