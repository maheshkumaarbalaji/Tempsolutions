var mongoose = require('mongoose');

var categoryObject = {

  name : {

    type : String,
    required : true

  },
  description : {

    type : String,
    required : true

  },
  ImgPath : {

    type : String,
    required : true

  }

};

var categorySchema = new mongoose.Schema(categoryObject);

var Category = mongoose.model('Category',categorySchema);

module.exports = {Category};