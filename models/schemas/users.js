var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var  userSchema =  new Schema({
  firstName: {type:String, trim:true},
  lastName: {type:String, trim:true},
  classYear: Number,
  email: {type:String, unique: true, sparse:true, trim:true},
  phone: {type: String, unique: true, sparse:true, trim:true},
  interests: [Number],
  isAdmin: {type: Boolean, index: true},
  isSuperAdmin: {type: Boolean, index: true},
  hash: String,
  companyName: {type: String, trim: true},
  token: String,
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
  if (this.isAdmin || this.isSuperAdmin) {
    if(!this.email)
      return callback(new Error('Missing Email'));
    if(!this.hash)
      return callback( new Error('Missing password'));
    if(!this.companyName)
      return callback(new Error('Missing Company '));
  }
  else {
    if (!this.phone)
      return callback(new Error('Missing Phone'));
  }
  
  callback();
});

userSchema.methods.greet = function() {
  console.log('Hi User: ', this.firstName);
};

userSchema.methods.checkpw = function(pw) {
  return (this.hash === pw);
}

var User = mongoose.model('User', userSchema);
module.exports = User;

