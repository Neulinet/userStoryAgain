//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var morgan = require("morgan");
var bodyParser = require("body-parser");
var config = require("./config");
var mongoose = require('mongoose');
//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);



 
router.use(express.static(__dirname+'/client'));
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());
router.use(morgan('dev'));

mongoose.connect(config.database,function(err){
  if (err) {
    console.log(err);
  }else{
    console.log('Connected to the database');
  }
})

var messages = [];
var sockets = [];

router.get('*',function(req, res){
  res.sendFile(__dirname+'/client/app/views/index.html');
})

var api = require('./app/routes/api')(router,express);
router.use('/api',api)

server.listen(config.port,function(err){
  if (err){
    console.log(err);
  }else{
    console.log("Listening on port "+config.port);
  }
})
