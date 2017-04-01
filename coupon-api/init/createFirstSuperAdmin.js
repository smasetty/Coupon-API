const mongoose = require('mongoose');
const User = require('../models/schemas/users');
const config = require('../models/config');
var disconnect = false;

if (mongoose.connection.readyState === 0) {
    console.log('Opening mongoose connection...');
    mongoose.connect(config.dbUrl, {server: {socketOptions: {keepAlive: 120}}});
    disconnect = true;
}

function disconnectMongoose(err) {
    if (err) console.log(err);
    console.log('Closing mongoose connection...');
    mongoose.connection.close();
}


User.find({email: config.emailFromAddress}, function(err, admins){
    if (err) {
        console.log(err);
        if (disconnect) disconnectMongoose(err);
        return;
    }

    if (admins.length) {
        console.log('User ' + config.emailFromName + ' found.');
        if (disconnect) disconnectMongoose(null);
        return;
    }

    console.log('could not find user' + config.emailFromAddress);

    var newAdmin = new User({
        email: config.emailFromAddress,
        hash: config.emailPassword,
        isSuperAdmin: true,
        companyName: 'HSA'
    });

    newAdmin.save(function(err){
        if (err) {
            if (disconnect) disconnectMongoose(err);
            return;
        }

        console.log('Created User' + config.emailFromAddress);
        if (disconnect)  disconnectMongoose(null); 
    });
});
