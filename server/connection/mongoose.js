var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};
