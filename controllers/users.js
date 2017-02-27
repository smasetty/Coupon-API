const User = require('../models/schemas/users');

var userDB = [];
var idCounter = 0;

userDB.insertUser = function(user, callback) {
  user.id = idCounter;
  idCounter++;
  this.push(user);

  callback();
};

userDB.getUserByID = function(id, callback) {
  try {
    for (var i = 0; i < this.length; i++) {
      if (+id === this[i].id)
        callback(null, this[i]);
    }
  } catch(err) {callback(err);};
};


module.exports.createUser = function(req, res) {
  console.log(req.body);
  var newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    createdDate: new Date()
  });
  console.log('Going to save to the mongo db');
  newUser.save(function(err, user){
    if (!err) {
      console.log('No Error in saving to the data base');
      res.status(200).send("A New User created");
    }
    else {
      console.log('Error in saving to the database');
      res.status(404).send("User Creation Error");
    }
  });
  
//  userDB.insertUser(newUser, function(res) {
//    return res.send("It worked!!");
 // });
};


module.exports.getUserByID = function(req, res, next) {
  User.findByID(req.params.id, function(err, user) {
    if (err) return next(err);
    if(!user)
      return res.status(404).send("User Not Found");
    return res.json(user);
  });

//  TODO:userDB.getUserByID(req.params.id, function(user){
//    return res.json(user);
//  });
};

module.exports.getUsers = function(req, res) {
  User.find({}, function(err, users){
    if(err) return next(err);

    return res.json(users);
  });
  //TODO:return res.send(userDB);
};

module.exports.deleteUsersByID = function(req, res) {
  User.findOneAndRemove(req.params.id, function(err, user){
    if (err) return next(err);
    if (!user) return res.status(404).send('No User with that ID');
    return res.sendStatus(200);
  });
};

module.exports.updateUser = function (req, res, next) {
  User.findOneAndUpdate(req.params.id, req,body, function(err, user){
    if(err) return next(err);
    if(!user) return res.status(404).send('No  User with that ID');
    return res.status(200);
  });
};


