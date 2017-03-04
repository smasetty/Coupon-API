var Coupon = require('../models/schemas/coupon.js');

module.exports.getAllCoupons = function(req, res, next) {
  Coupon.find({}, function(err, coupons) {
    if (err) return next(err);
    res.json(coupons);
  });
};


module.exports.getActiveCoupons = function(req, res, next) {
  var now = new Date();
  Coupon.find({
    $and: [
      {approvedDate: {$exists: true}},
      {startDate: {$lt: now}},
      {
        $or: [
          {endDate: {$gt: now}},
          {endDate: {$exists: false}},
        ]}
    ]
  }, function(err, next){
    if(err) return next(err);
    res.json(coupons);
  });
};

module.exports.getUnapprovedCoupons = function(req, res, next) {
  Coupon.find({approvedDate: {$exists: false}}, function(err, coupons){
    if (err) return next(err);
    res.json(coupons);
  });
};

module.exports.getCouponById = function(req, res , next) {
  Coupon.findById(req.params.id, function(err, coupon){
    if (err) return next(err);
    if(!coupon) return res.status(404).sendStatus("No Coupon with that ID");
    res.json(coupon);
  });
};

module.exports.approveCoupon  = function(req, res, next) {
  Coupon.findById(req.param.id, function(err, coupon) {
    if(!coupon)
      return res.status(404).sendStatus("No Coupon with that ID");
    if(coupon.approvedDate) return;
    coupon.approvedDate = new Date();
    coupon.save();
    return res.sendStatus(200);
  });
};

module.exports.createCoupon = function(req, res, next) {
  var newCoupon = new Coupon(req.body);

  newCoupon.save(function(err, coupon){
    if (err) return next(err);
    res.sendStatus(200);
  });
};

module.exports.updateCoupon = function(req, res, next) {
  Coupon.findOneAndUpdate({id: req.params.id}, req.body, function(err, coupon){
    if (err) return next(err);
    return res.sendStatus(200);
  });
};

module.exports.deleteCouponById = function(req, res, next) {
  Coupon.findOneAndRemove(req.params.id, function(err, coupon){
    if (err) return next(err);
    if(!coupon) return res.status(404).send("No coupon with that ID");
    return res.sendStatus(200);
  });
};
