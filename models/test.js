const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const { MongoClient } = require('mongodb');
const fs = require('fs');

const credentials = fs.readFileSync('certs/X509-cert-7984201172997855743.pem');
const client = new MongoClient('mongodb+srv://rs0.wossl.mongodb.net/combenir_test?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {
  sslKey: credentials,
  sslCert: credentials,
  useUnifiedTopology: true
});

// mongodb gets updated whenever a file is uploaded to github.
// mongodb pushes the update to this server
client.connect().then(db => {
    const changeStream = client.watch();
    changeStream.on('change', async data => {
        console.log(data);
        const owner = data.fullDocument.owner;
        const repo = data.fullDocument.repo;
        const path = data.fullDocument.path;
        const filename = data.fullDocument.filename;
        const githubResponse = await fetch(`${githubUrl}/${owner}/${repo}/contents/${path}`);
        const jsonResponse = await githubResponse.json();
        console.log(jsonResponse);
        const fileDownloadUrl = jsonResponse.filter(res => {
            if (res.name === filename) {
                return res;
            }
        });
        if (fileDownloadUrl.length === 1) {
            console.log(fileDownloadUrl[0].download_url);
            console.log("not null");
            const fileContent = await fetch(fileDownloadUrl[0].download_url);
            console.log(fileContent);
        }
    })
})

const githubUrl = 'https://api.github.com/repos';

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json(["Test1", "Test2", "Test3"]);
});

app.get('/fetch/:owner/:repo/:path', async (req, res) => {
    const owner = req.params.owner;
    const repo = req.params.repo;
    const path = req.params.path;

    try {
        const apiResponse = await fetch(`${githubUrl}/${owner}/${repo}/contents/${path}`)
        res.json(await apiResponse.json());
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

app.post('/file-upload/:owner/:repo/:path/:filename', async (req, res) => {
    const obj = {
        owner: req.params.owner,
        repo: req.params.repo,
        path: req.params.path,
        filename: req.params.filename,
        timestamp: new Date().valueOf()
    }

    await client.connect();
    const database = client.db('combenir_test');
    const collection = database.collection('file_uploads');
    collection.insertOne(obj, (err) => {
        if (err) throw err;
        console.log("inserting document");
        client.close;
        res.sendStatus(200);
    });

})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(credentials);
})