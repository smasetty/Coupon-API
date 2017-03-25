const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('../app/models/config');

router.get('/', function(req, res , next){
  res.render('index', {providers: config.providers});
  //res.send("hello world for now")
});

router.get('/login', function(req, res, next) {
  console.log('Attemping to Login a User');
  res.render('login');
});

module.exports = router;
