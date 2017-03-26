const User = require('../models/schemas/users');

module.exports.getUsers = function(req, res) {
  User.find({}, function(err, users){
    if(err) return next(err);
    return res.json(users);
  });
};

module.exports.getUserByID = function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        if (err) return next(err);
        if(!user)
            return res.status(404).send("User Not Found");
        return res.json(user);
    });
};

module.exports.getUsersWithPhones = function(req, res, next) {
    User.find({phone: {$exists: true}}, function(err, users) {
        if (err) return next(err);
        res.json(users);
    });
};

module.exports.createUser = function(req, res, next) {
    if (typeof req.body.phone !== 'string')
        return res.status(400).send('No Phone');
    if (typeof req.body.phoneProvider !== 'string')
        return res.status(400).send('No PhoneProvider');

    var userData = {};
    if (req.body.firstName && typeof req.body.firstName === 'string')
        userData.firstName = req.body.firstName;
    if (req.body.lastName && typeof req.body.lastName === 'string')
        userData.lastName = req.body.lastName;
    if (typeof req.body.classYear !== 'undefined' && +req.body.classYear)
        userData.classYear = +req.body.classYear;
        
    if (req.body.phoneProvider === 'other') {
        if (typeof req.body['other-provider'] !== 'string')
            return res.status(400).send('Missing Other-Provider');
        userdata.phoneProvider = req.body['other-provider'];
    } else userData.phoneProvider = req.body.phoneProvider;

    var phone = '';
    for (var i = 0; i < req.body.phone.length; i++) {
        if (!isNaN(req.body.phone[i]) && req.body.phone[i] !== ' ')
            phone += req.body.phone[i];
    }
    if (phone.length !== 10)
        return res.status(400).send('Invalid Phone');
    userData.phone = phone;
            
    if (req.body.email) {
        if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)))
            return res.status(400).send('Invalid email');
        else
            userData.email = req.body.email;
    }

    if (req.body.interests)
        userData.interests = req.body.interests;
    if (req.body.password)
        userData.hash = req.body.password;
    if (req.body.hash)
        userData.hash = req.body.hash;

    var newUser = new User(userData);
    newUser.save( function(err, user) {
        if (err) {
            if (err.code === 11000)
                return res.status(400).send('Email or Phone already registered');
            return next(err);
        }
        return res.json(user);
    });
};

module.exports.updateUser = function (req, res, next) {
  User.findOneAndUpdate(req.params.id, req,body, function(err, user){
    if(err) return next(err);
    if(!user) return res.status(404).send('No  User with that ID');
    return res.status(200);
  });
};

module.exports.deleteUsersByID = function(req, res) {
  User.findOneAndRemove(req.params.id, function(err, user){
    if (err) return next(err);
    if (!user) return res.status(404).send('No User with that ID');
    return res.sendStatus(200);
  });
};

module.exports.deleteUserByPhone = function(req, res) {
  User.findOneAndRemove({phone: req.params.phone}, function(err, user) {
    if (err) return next(err);
    if( !user ) return res.status(404).send('No User with that ID');
    return res.sendStatus(200);
  });
};
