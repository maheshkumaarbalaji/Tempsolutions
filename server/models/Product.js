var mongoose = require('mongoose');
var _ = require('lodash');

var productObject = {

    name : {

      type : String,
      required : true

    },
    category : {

      type : String,
      required : true

    },
    owner : {

      type : String,
      required : true

    },
    description : {

      type : String,
      required : true

    },
    rent : {

      type : Number,
      required : true

    },
    period : {

      type : Number,
      required : true

    },
    ImgPath : {

      type : String,
      required : true

    }

};

var productSchema = new mongoose.Schema(productObject);

productSchema.pre('save',function(next){

  var product = this;
  _.capitalize(product.name);
  _.capitalize(product.category);
  next();

});

var Product = mongoose.model('Product',productSchema);

module.exports = {Product};
