const express = require('express');
const app = express();
const http = require("http");
const server = http.createServer(app);
const PORT = 5000;
const socketio = require("socket.io");
const io = socketio(server);
const cors = require("cors");
// const redisAdapter = require("socket.io-redis");
// const MUUID = require('uuid-mongodb');
const schema = require("./models/Schema");
const connect = require("./dbconnection");
const _ = require("./resources/config");
const router = require('./router');

const MongoClient = require('mongodb').MongoClient;

// let database = () => {
//   return new Promise((resolve, reject) => {
//     MongoClient.connect(_.MONGO.URL, { useNewUrlParser: true }, (err, connection) => {
//       if (err) {
//         console.log("Unable to connect to MongoDB: ", err);
//         reject(err);
//         return;
//       }
//       resolve(connection);
//     });
//   });
// }
//
// let sockets = () => {
//   return new Promise((resolve, reject) => {
//     socket.adapter(redisAdapter({ host: 'redis', port: 6379}));
//
//     socket.on("connect", (sock) =>{
//       sock.on("disconnect", () => {
//         // clean up code goes here
//         console.log("Disconnecting from socket");
//       });
//
//       //Socket routes here
//
//     });
//
//     http.listen(80);
//
//     resolve(socket);
//   });
// }
//
// let watchChangeStreams = (connection, io) => {
//   _.MONGO.DB.forEach(dbName => {connection.db(dbName).watch([], {fullDocument: 'updateLookup'})
//       .on('change', (change) => {
//       /* only emit updated values */
//       let changeObj;
//       if (change.operationType === 'update') {
//         changeObj = change.updateDescription.updatedFields;
//       } else {
//         changeObj = change.fullDocument;
//       }
//
//       /* mongo converts UUID to binary, so let's change it back to a string */
//       try {
//         if (!change.fullDocument.uuid) {
//           return;
//         } else if (change.fullDocument.uuid.constructor.name !== "Binary") {
//           throw "constructor.name must be Binary";
//         } else if (change.fullDocument.uuid.sub_type !== 4) { // http://bsonspec.org/spec.html
//           throw "Binary object's subtype is not standard UUID";
//         }
//
//         changeObj.uuid = MUUID.from(change.fullDocument.uuid).toString();
//       } catch (err) {
//         console.error(err);
//         return;
//       }
//
//       /* emit the change to anyone who has subcribed to the UUID */
//       console.info('emitting to: ' + changeObj.uuid + ' ' + change.ns.coll);
//       io.to(changeObj.uuid).emit(change.ns.coll, changeObj);
//     });
//   });
//   console.log(JSON.stringify({ watching: _.MONGO.DB }));
// };
//
// Promise.all([database(), sockets()])
//   .then(([db, io]) => {
//     watchChangeStreams(db,io);
//   })
//   .catch(err => {
//     console.log("Error in connecting socket")
//     console.error(err);
//     process.exit(1);
//   })


app.use(cors());

// function MongoSocket(dancer_id) {
  MongoClient.connect("mongodb://localhost:27017/dance_data?replicaSet=rs0")
    .then(client => {
      console.log("Connecting to mongo");
      const db = client.db("dancedb");
      const collection = db.collection("sensor");
      const changeStream = collection.watch(schema);

      io.on("connection", function (socket) {
        console.log("Connecting socket");
        changeStream.on("change", change => {
          const dancer_id = change.fullDocument.data.dancer_id;
          const newData = change.fullDocument.data.sensor_data;
          const emgData = change.fullDocument.data.emg_data;
          const danceData = change.fullDocument.data.dance_data;
          const data = change.fullDocument.data;
          console.log(data.gyroscope_data);
          console.log(danceData);
          console.log(emgData);
          console.log("dancer_id: ", dancer_id);
          console.log("New data: ", newData);
          socket.emit(dancer_id, data);
        });

        socket.on('connection_test', data => {
          console.log("New connection");
        })

        socket.on("disconnect", () => {
          // remove user logic here
          console.log("Disconnecting socket");
        })

      })
    })
// }

// MongoClient.connect("mongodb://localhost:27017/dance_data?replicaSet=rs0")
//   .then(client => {
//     console.log("connected to db");
//     const db = client.db("dancedb");
//     const collection = db.collection("sensor");
//     const changeStream = collection.watch(schema);
//     changeStream.on("change", event => {
//       console.log(JSON.stringify(event));
//     })
//   })

// // Message listener
// socket.on("connection", socket => {
//   console.log("user connected");
//   socket.on("disconnect", () => {
//     console.log("Disconnected");
//   })
//
//   connect.then(db => {
//     console.log("Connected to db");
//     let newData = new schema({"data": {"dancer_id": "dancer1","sensor_data": [{"sensor1": {"x": 11,"y": 22,"z": 5}},{"sensor2": {"x": 6,"y": 30,"z": 12}}],"timestamp": 1583205755991}} );
//     newData.save()
//   })
// })


// Sample get request method
app.get('/', (req, res) => {
  //MongoSocket("dancer1");
  res.send('<h1>Hello World</h1>');
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}, timestamp:` + new Date().getTime()));