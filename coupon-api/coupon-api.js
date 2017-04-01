const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const config = require('./models/config');
const users = require('./controllers/users');
const admin = require('./controllers/admin');
const coupons = require('./controllers/coupons');
const auth = require('./controllers/auth');

mongoose.Promise = require('bluebird');
mongoose.connect(config.dbUrl, {server: {socketOptions: {keepAlive: 120}}});

var app = express();
var router = express.Router();

if(app.get('env')!== 'production') {
  app.use(logger('dev'));
  var dev = true;
} 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.param('id', function(req, res, next, id) {
  if (!id.match(/^[0-9a-fA-F]{24}$/))
    return res.status(400).send('Invalid ID');
  next();
}); 

//Users MiddleWare
app.get('/users', users.getUsers);
app.get('/users/:id', users.getUserByID);
app.post('/users', users.createUser);
app.delete('/users/:id', users.deleteUsersByID);

app.post('/admins', admin.createAdmin);

//Coupons MiddleWare
app.get('/coupons', coupons.getAllCoupons);
app.get('/coupons/:id', coupons.getCouponById);
app.post('/coupons', coupons.createCoupon);
app.put('/coupons/:id', coupons.updateCoupon);
app.delete('/coupons/:id', coupons.deleteCouponById);

app.post('/auth/token', auth.loginUser);


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
