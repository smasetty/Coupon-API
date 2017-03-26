var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

var  userSchema =  new Schema({
  firstName: {type: String, trim: true},
  lastName: {type: String, trim: true},
  classYear: {type: Number},
  email: {type: String, unique: true, sparse: true, trim: true},
  phone: {type: String, unique: true, sparse: true},
  phoneProvider: {type: String, trim: true},
  interests: [Number],
  isAdmin: {type: Boolean, index: true},
  isSuperAdmin: {type: Boolean, index: true},
  hash: {type: String},
  companyName: {type: String, trim: true},
  token: {type: String},
  },
  {
    toObject: {getters: true},
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate',
    },
  }
); 

userSchema.pre('save', function(callback){
    console.log(this);
    if(this.isAdmin || this.isSuperAdmin) {
        console.log('This is a Super Admin');
        if (!this.email)
            return callback(new Error('Missing Email'));
        if (!this.hash)
            return callback(new Error('Missing Password'));
        if (!this.companyName)
            return  callback(new Error('Missing CompanyName'));

        if (this.isModified('hash'))
            this.hash = bcrypt.hashSync(this.hash);
    } else {
        if (!this.phone)
            return callback(new Error('Missing Phone'));
        if (!this.phoneProvider)
            return callback(new Error('Missing Provide'));
    }

    if (this.phone) {
        if (typeof this.phone !== 'string')
            return callback(new Error('Invalid Phone'));
        var phone = '';
        for (var i = 0; i < this.phone.length; i++){
            if (!isNaN(this.phone[i]))
                phone += this.phone[i];
        }
        if (phone.length !== 10)
            return callback(new Error('Invalid Phone provided'));
        this.phone = phone; 
    }

    callback();
});

userSchema.methods.comparePassword = function(pw, callback) {
    bcrypt.compare(pw, this.hash, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

var User = mongoose.model('User', userSchema);

module.exports = User;

