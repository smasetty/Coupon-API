const nodemailer = require('nodemailer');
const User = require('../models/schemas/users');
const Coupon = require('../models/schemas/coupon');
const config = require('../models/config');

function getProviderDomain(provider) {
    for (var i = 0; i < config.providers.length; i++) {
        if (provider === config.providers[i].name)
            return config.providers[i].sms;
    }
    return '';
}

function buildEmailArray(users) {
    var emails = [];
    for (var i = 0; i < users.length; i++) {
        let u = users[i];
        let email = '';
        if (!u.phoneProvider)  
            continue;
        let providerDomain = getProviderDomain(u.phoneProvider);
        if (!providerDomain) 
            continue;
        email += u.phone;
        email += providerDomain;
        emails.push(email);
    }
    return emails;
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.emailFromAddress,
        pass: config.emailPassword
    }
});

module.exports.sendCouponById = function(req, res, next) {
    Promise.all([
        User.find({phone: {$exists: true} }).exec(),
        Coupon.findById(req.params.id).exec()
    ]).then(function(results) {
        var users = results[0];
        var coupon  = results[1];

        if (!coupon)
            return res.status(404).send('No Coupon with that ID');
        if (!users.length)
            return res.sendStatus(200);

        var text = coupon.companyName + ': ' + coupon.name + '\n' + coupon.url;
        
        var mailOptions = {
            from: '"' + config.emailFromName + '" <' + config.emailFromAddress + '>',
            to: buildEmailArray(users).join(', '),
            subject: 'New Coupon',
            text: text
        };
        return transporter.sendMail(mailOptions);
    }).then(function (mailInfo) {
        return res.json(mailInfo);
    }).catch(function(err) { return next(err); });
};
