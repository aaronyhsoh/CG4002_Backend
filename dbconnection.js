const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const db = "mongodb://localhost:27017/rs0";
const connect = mongoose.connect(db, {useNewUrlParser: true});

module.exports = connect