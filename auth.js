var express = require('express');
var passport = require('passport');
var users = require('./data/users');
var _ = require('lodash');
var router = express.Router();
module.exports = router;

router.get('/login',function(req,res){
  if(req.app.get('env')==='development'){
    var user = users[0];
    if(req.query.user){
      var name = req.query.user;
      user = _.find(users,function(u){
        return u.name === name
      });

    }
    req.login(user,function(err){
      if(err){return next(err);}
      return res.redirect('/home');
    });
    return;
  }
  res.render('login');
});

router.post("/login", passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login'
}));

router.get('/logout',function(req,res){
  req.logout();
  res.redirect('/login');

});
//new
