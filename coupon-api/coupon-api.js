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
require('./init/init');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

router.param('id', function(req, res, next, id) {
  if (!id.match(/^[0-9a-fA-F]{24}$/))
    return res.status(400).send('Invalid ID');
  next();
}); 

router.param('phone', function(req, res, next, phone) {
    if (!(+phone) || phone.length != 10)
        return res.status(400).send('Invalid Phone provided');
    next();
});

router.route('/users')
    //.get(auth.superAdminRequired, users.getUsers)
    .get(users.getUsers)
    .post(users.createUser);
router.route('/users/:id')
    .get(auth.superAdminRequired, users.getUserByID)
    .put(users.updateUser)
    .delete(users.deleteUsersByID);
router.route('/users/:phone')
    .delete(users.deleteUserByPhone);

router.route('/coupons')
    .get(coupons.getActiveCoupons)
    .post(auth.adminRequired, coupons.createCoupon);
router.route('/coupons/:id')
    .get(coupons.getCouponById)
    .post(auth.superAdminRequired, coupons.approveCoupon)
    .put(auth.adminRequired, coupons.updateCoupon)
    .delete(auth.adminRequired, coupons.deleteCouponById);

router.route('/admins')
    .post(auth.superAdminRequired, admin.createAdmin);
router.route('/admins/coupons')
    .get(auth.superAdminRequired, coupons.getUnapprovedCoupons);

router.route('/auth/token')
    .post(auth.loginUser);

app.use('/', router);

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
