const mongoose = require("mongoose");
const mongooseSchema = mongoose.Schema;

const SensorSchema = new mongooseSchema({
  sensor: String,
  x: { type: Number },
  y: { type: Number },
  z: { type: Number }
});

const Schema = new mongooseSchema({
  data: {
    dancer_id: String,
    sensor_data: [
      SensorSchema,
      SensorSchema
    ],
    emg_data: {
      value: { type: Number}
    },
    dance_data: {
      dance_move: { type: Number},
      position: { type: Number}
    },
    gyroscope_data: [
      SensorSchema,
      SensorSchema
    ],
    timestamp: String
  }
});

let data = mongoose.model("data", Schema);
module.exports = data;