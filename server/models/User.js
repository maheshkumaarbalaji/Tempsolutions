var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var _ = require('lodash');

var userSchema = new mongoose.Schema({

  name : {

    type : String,
    required : true,
    trim :true

  },
  mailid : {

    type : String,
    required : true,
    unique : true,
    trim :true

  },
  password : {

    type : String,
    required : true,
    minlength : 6,
    trim :true

  },
  phone : {

    type : Number,
    required : true

  },
  address : {

    type : String,
    required : true

  },
  tokens : [{

    access : {

      type : String,
      required : true

    },
    token : {

      type : String,
      required : true

    }

  }]

});

userSchema.methods.toJSON = function(){

  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject,['_id','mailid','phone','address','tokens']);

};

userSchema.methods.generateAuthToken = function(){

  var user = this;

  var access = 'auth';
  var token = jwt.sign({_id : user._id.toString('hex'),access},'abc123').toString();

  user.tokens.push({access,token});
  return user.save().then(() => {

    return token;

  });

};

userSchema.methods.removeToken = function(token){

  var user = this;
  return user.update({

    $pull : {

      tokens : {token}

    }

  });

};

userSchema.statics.findByToken = function(token){

  var User = this;
  var decoded;

  try{

    decoded = jwt.verify(token,'abc123');

  }catch(err) {

    return Promise.reject("Failure");

  };

  return User.findOne({

      '_id' : decoded._id,
      'tokens.token' : token,
      'tokens.access' : 'auth'

  });

};

userSchema.statics.findByCredentials = function(mailid,password){

    var User = this;
    return User.findOne({mailid}).then((user) => {

        if(!user){

            return Promise.reject("User not found");

        }

        return new Promise((resolve,reject) => {

            bcrypt.compare(password,user.password,(err,res) => {

                if(res){

                    resolve(user);

                }else{

                    reject("Invalid Password");

                }

            });

        });

    }).catch((err) => {

        return Promise.reject(err);

    });

};

userSchema.pre('save',function(next){

  var user = this;

  if(user.isModified('password')){

    bcrypt.genSalt(10,(err,salt) => {

           bcrypt.hash(user.password,salt,(err,hash) => {

               user.password = hash;
               next();

           });

    });

  }else{

    next();

  }

});

var User = mongoose.model('User',userSchema);

module.exports = {User};