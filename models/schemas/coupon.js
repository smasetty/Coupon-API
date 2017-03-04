const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var couponSchema = new Schema({
  name: {type:String, required: true, trim: true},
  url: {type:String, required: true, trim: true},
  companyName: {type: String, required: true, trim: true},
  startDate: { type: Date, default: Date.now, index: true },
  endDate: {type: Date, index: true},
  tags: [Number],
  clicks: {type: [Date], default: []},
  views: {type: [Date], default: []},
  redeemed: {type: [Date], default: []},
  postedBy: Schema.ObjectId, //{type: Schema.ObjectId, required: true},

  approvedDate: Date,
  },
  {
    toObject: {getters: true},
    timestamps: {
      createdAt: 'createdDate',
      updateAt: 'updatedAt',
    }
  }
);

couponSchema.pre('save', function(callback){
  //ensure URL always starts with http[s]:// or ftp://
  if (this.url && !(/^(https?)|(ftp):\/\/.+/.test(this.url)))
    this.url = 'http://' + this.url;
  //update start date on approval
  if (this.isModified(approvedDate) && this.approvedDate > this.startDate)
    this.startDate = this.approvedDate;
  callback();
});

var Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
