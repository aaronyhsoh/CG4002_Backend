const MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/dance_data?replicaSet=rs0")
.then(client => {
  console.log("Connecting to mongo");
  const db = client.db("dancedb");
  const collection = db.collection("sensor");

})