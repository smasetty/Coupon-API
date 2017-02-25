const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const config = require('./models/config');
const users = require('./controllers/users')

var app = express();

if(app.get('env')!== 'production') {
  app.use(logger('dev'));
  var dev = true;
} 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//users = [];

app.get('/users', users.createUser);

//handle 404
app.use(function(req, res, next){
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if(app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500).send();
  });
}

app.use(function(err, req, res, next){
  res.status(err.status || 500).send();
});

var server = app.listen(config.port);
console.log('Listening at port: ' + config.port + ". ");

module.exports = app;
