var express = require('express');
var fs = require('fs');
var uuid = require('node-uuid');
var empData = require('./data/usersData');
var roomData = require('./data/rooms');
var _ = require('lodash');
// Routing config
var router = express.Router();
module.exports = router;
router.use(function(req,res,next){
  if (req.user.admin) {
    next();
    return;
  }
  res.redirect('/login');
});
router.get('/rooms', function(req, res) {
    //res.writeHead(200, { 'Content-Type': 'text/html' });
    //fs.createReadStream('./public/admin/rooms.html', 'utf8').pipe(res);
    res.render('rooms.jade', {
        roomData: roomData
    });
});
// Delete Section *****
router.get('/rooms/delete/:id', function(req, res) {
    roomData = roomData.filter((item) => {
        return item.id !== req.params.id
    });
    res.redirect(req.baseUrl + '/rooms');

});
// Edit Section ******
router.route('/rooms/edit/:id').all(function(req, res, next) {
    var room = _.find(roomData, function(item) {
        return item.id === req.params.id;
    });
    if (!room) {
        res.sendSatus(404);
        return;
    }
    res.locals.room = room
    next();
}).get(function(req, res) {
    res.render('edit');

}).post(function(req, res) {
    res.locals.room.name = req.body.name;
    res.redirect(req.baseUrl + '/rooms');

});
// Add Section ******
router.get('/add', function(req, res) {
    res.render('add');
});
router.post('/add', function(req, res) {
    var room = {
        name: req.body.name,
        id: uuid.v4()
    };
    roomData.push(room);
    res.redirect(req.baseUrl + '/rooms');
});

// VR Contents
router.get('/vr',function(req,res){
  res.writeHead(200, { "Content-Type": "text/html" });
  fs.createReadStream(__dirname + "/vr/finalBuild.html","utf8").pipe(res);

});
router.get('/3d',function(req,res){
  res.writeHead(200, { "Content-Type": "text/html" });
  fs.createReadStream(__dirname + "/3d/index.html","utf8").pipe(res);

});
