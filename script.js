const MongoClient = require('mongodb').MongoClient;
const schema = require("./models/Schema");

MongoClient.connect("mongodb://localhost:27017/dance_data?replicaSet=rs0")
  .then(client => {
    console.log("Connecting to mongo");
    const db = client.db("dancedb");
    const collection = db.collection("sensor");

    setInterval(function () {
      collection.insertOne({
        "data": {
          "dancer_id": "dancer1",
          "sensor_data": [{
            "sensor": "sensor1",
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1),
            "z": Math.floor((Math.random() * 100) + 1)
          }, {
            "sensor": "sensor2",
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1),
            "z": Math.floor((Math.random() * 100) + 1)}],
          "emg_data": {"value": Math.floor((Math.random() * 100) + 1)},
          "dance_data": {"dance_move": Math.floor((Math.random() * 100) + 1), "position": Math.floor((Math.random() * 3) + 1)},
          "gyroscope_data": [{
            "sensor": "sensor1",
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1),
            "z": Math.floor((Math.random() * 100) + 1)}, {
            "sensor": "sensor2",
            "x": Math.floor((Math.random() * 100) + 1),
            "y": Math.floor((Math.random() * 100) + 1),
            "z": Math.floor((Math.random() * 100) + 1)
          }],
          "timestamp": 1583205755991
        }
      }, function (err, res) {
        if (err) console.log(err);
        console.log("Inserted");
      })
    }, 500)
  })
