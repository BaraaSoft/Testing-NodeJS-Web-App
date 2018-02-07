var express = require('express');
var _ = require('lodash');
var uuid = require('node-uuid');
var roomsData = require('./data/rooms');
var messagesData = require('./data/messages');
var router = express.Router();
module.exports = router;

router.get('/rooms',function(req,res){
  res.json(roomsData);
});
router.route('/rooms/:id/messages').get(function(req,res){
  var roomId = req.params.id;
  var roomChats = messagesData.filter(function(chat){
    return chat.roomId === roomId;
  });
  console.log(roomChats);
  res.json(roomChats);

}).post(function(req,res){
  var newMessage = {
    text:req.body.text,
    roomId:req.params.id,
    userId:uuid.v4(),
    id:uuid.v4()
  };
  
  messagesData.push(newMessage);
  res.sendStatus(200);
}).delete(function(req,res){
  messagesData = messagesData.filter(function(message){
    return message.roomId !== req.params.id;
  });
  res.sendStatus(200);
});
