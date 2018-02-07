var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var uuid = require('node-uuid');
var empData = require('./data/usersData');
var roomData = require('./data/rooms');
var _ = require('lodash');
var port = process.env.port || 1992;

var app = new express();

app.use('/assets', express.static(__dirname + '/public'));
app.use('/', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.set('views', './views');
app.set('view engine', 'jade');


// create application/x-www-form-urlencoded parser
//app.use(bodyParser.urlencoded({ extended: true }));
// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })



app.get('/', function (req, res) {
    res.send("Hello World ..!");
});

app.get('/admin/rooms', function (req, res) {
    //res.writeHead(200, { 'Content-Type': 'text/html' });
    //fs.createReadStream('./public/admin/rooms.html', 'utf8').pipe(res);
    res.render('rooms.jade', { roomData: roomData });
});
app.get('/admin/rooms/delete/:id',function(req,res){
  roomData = roomData.filter((item)=>{
    return item.id !== req.params.id
  });
  res.redirect('/admin/rooms');

});
app.get('/admin/rooms/edit/:id',function(req,res){
  var room = _.find(roomData,function(item){
    return item.id === req.params.id;
  });
  if (!room) {res.sendSatus(404);}

  res.render('edit',{room:room});

});
app.post('/admin/rooms/edit/:id',urlencodedParser,function(req,res){
  var room = _.find(roomData,function(item){
    return item.id === req.params.id;
  });
  if (!room) {res.sendSatus(404);}
  room.name = req.body.name;
  res.redirect('/admin/rooms');

});

app.get('/home', function (req, res) {
    res.writeHead(200, {'Content-Type':'text/html'});
    fs.createReadStream(__dirname + '/public/index.html','utf8').pipe(res);
});

app.get('/admin/add', function (req, res) {
    res.render('add');
});
app.post('/admin/add',urlencodedParser,function (req, res) {
    var room = {name:req.body.name,id:uuid.v4()};
    roomData.push(room);
    res.redirect('/admin/rooms');
});


app.get('/test', function (req, res) {
    //res.writeHead(200, { "Content-Type": "text/html" });
    //fs.createReadStream(__dirname + "/views/test.html","utf8").pipe(res);
    res.render('test', { empData: empData });
});
app.get('/jade2html', function (req, res) {
    res.render('test', { empData: empData }, function (error, html) {
        console.log(html);
    });
});
app.listen(port, function () {
    console.log("Baraa Server up and Running ...");
});
