var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var roomData = require('./data/rooms');
var port = process.env.port || 3000;
var app = new express();
var adminRouter = require('./admin.js');
var apiRouter = require('./api.js');
var authRouter = require('./auth');
require('./passport-init');
//Parsing
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// The View Engine Setup **********
app.set('views', './views');
app.set('view engine', 'jade');
// Assets config ********
app.use('/assets', express.static(__dirname + '/public'));
app.use('/', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/admin/vr', express.static(__dirname + '/vr'));
app.use('/admin/3d',express.static(__dirname + '/3d'));
// log reports
app.use(require('./logging'));
// Auth ******
app.use(require('express-session')({
  secret: 'keyboard cat', resave: false, saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(authRouter);
app.use(function(req,res,next){
  if(req.isAuthenticated()){
    res.locals.user = req.user;
    next();
    return;
  }
  res.redirect('/login');
});
// Routing ********
app.use("/admin",adminRouter);
app.use('/api',apiRouter);




app.get('/home', function (req, res) {
    res.render("home");
});
app.get('/', function (req, res) {
    //res.writeHead(200, {'Content-Type':'text/html'});
    //fs.createReadStream(__dirname + '/public/index.html','utf8').pipe(res);
    res.end("");
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
// error Custom Handler
app.use((error,req,res,next)=>{
  res.send("Error Page...!\n"+error);


});
app.listen(port, function () {
    console.log("Baraa Server up and Running ...");
});
