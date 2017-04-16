const User = require('../models/schemas/users');
const jwt = require('jwt-simple');
const config = require('../models/config');

module.exports.loginUser = function(req, res, next) {
    if (typeof req.body.email !== 'string')
        return res.status(400).send('Missing Email');
    if (typeof req.body.password !== 'string')
        return res.status(400).send('Missing Password');

    User.findOne({email: req.body.email}, function(err, user){
        if (err) return next(err);
        if (!user) return res.status(400).send('No User with that Email');
        if (!user.isAdmin && !user.isSuperAdmin) {
            console.log('There is no admin')
            return res.status(403).send('No admin with that email');
        }


        user.comparePassword(req.body.password, function(err, isMatch){
            if (err) return next(err);
            if  (!isMatch)  {
                console.log('No password Match');
                return res.status(401).send('Incorrect Password');
            }

            var payload = {
                id: user._id,
                email: user.email,
                companyName: user.companyName,
                isAdmin: !!user.isAdmin,
                isSuperAdmin: !!user.isSuperAdmin
            };

            var token = jwt.encode(payload, config.secret);

            user.token = token;

            user.save(function(err){
                if (err) return next(err);
                return res.json({token: token});
            });

        });
    
    });
};

module.exports.adminRequired = function(req, res, next) {
    validateToken(req, res, next, {adminRequired: true});
};

module.exports.superAdminRequired = function(req, res, next) {
    validateToken(req, res, next, {superAdminRequired: true});
};

function validateToken(req, res, next, c) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) return res.status(403).send('This endpoint requires a token');

    try {
        var decoded = jwt.decode(token, config.secret);
    } catch (err) {
        return res.status(403).send('Failed to authenticate Token');
    }
    
    User.findById(decoded.id, function(err, user){
        if (err) return next(err);
        if (!user) return res.status(403).send('Invalid User');

        if (token !== user.token)
            return res.status(403).send('Expired Token');

        if (decoded.isAdmin !== user.isAdmin || decoded.isSuperAdmin !== user.isSuperAdmin)
            return res.status(403).send('Expired Token');
    
        if (!user.isAdmin && !user.isSuperAdmin && c.adminRequired)
            return res.status(403).send('Admin priviliges required');
        if (!user.isSuperAdmin && c.superAdminRequired)
            return res.status(403).send('Super Admin Priviliges required');

        req.user = decoded;

        next();
    });
};
