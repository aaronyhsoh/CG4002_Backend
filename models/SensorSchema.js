const mongoose = require("mongoose");
const mongooseSchema = mongoose.Schema;

const SensorSchema = mongooseSchema({
  sensor: String,
  x: { type: Number },
  y: { type: Number },
  z: { type: Number }
});

let sensorSchema = mongoose.model("sensorSchema", SensorSchema);
module.exports = sensorSchema;