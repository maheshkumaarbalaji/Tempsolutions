var mongoose = require('mongoose');

var schemaObject = {

  productName : {

    type : String,
    required : true,
    trim : true

  },
  userName : {

    type : String,
    required : true,
    trim : true

  },
  cost : {

    type : Number,
    required : true

  },
  period : {

    type : Number,
    required : true

  }

};

var saleSchema = new mongoose.Schema(schemaObject);

var saleDetail =  mongoose.model('saleDetail',saleSchema);

module.exports = {saleDetail};
