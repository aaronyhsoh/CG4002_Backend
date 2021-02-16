const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const { MongoClient } = require('mongodb');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const folder = path.join(__dirname, 'files');
if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
}

const credentials = fs.readFileSync('certs/X509-cert-7984201172997855743.pem');
const client = new MongoClient('mongodb+srv://rs0.wossl.mongodb.net/combenir_test?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {
  sslKey: credentials,
  sslCert: credentials,
  useUnifiedTopology: true
});

const githubUrl = 'https://api.github.com/repos';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json(["Test1", "Test2", "Test3"]);
});

app.get('/fetch/:owner/:repo/:pathname', async (req, res) => {
    const owner = req.params.owner;
    const repo = req.params.repo;
    const pathname = req.params.pathname;

    try {
        const apiResponse = await fetch(`${githubUrl}/${owner}/${repo}/contents/${pathname}`)
        res.json(await apiResponse.json());
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

app.post('/file-upload/:owner/:repo/:pathname/:filename', async (req, res) => {
    const obj = {
        owner: req.params.owner,
        repo: req.params.repo,
        pathname: req.params.pathname,
        filename: req.params.filename,
        timestamp: new Date().valueOf()
    }

    const form = new formidable.IncomingForm()

    form.uploadDir = folder
    form.parse(req, (_, fields, files) => {
        console.log('\n-----------')
        console.log('Fields', fields)
        console.log('Received:', Object.keys(files))
        console.log()
    });
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

app.listen(3000, () => {
    console.log(`Server running on port ${port}`);
    console.log(credentials);
})