const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('../app/models/config');

router.get('/', function(req, res , next){
  res.render('index', {providers: config.providers});
  //res.send("hello world for now")
});

module.exports = router;
