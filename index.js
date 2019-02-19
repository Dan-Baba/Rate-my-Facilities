/*
 * index.js
 */
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').load();


const sca = fs.readFileSync(__dirname + '/server-ca.pem');
const crt = fs.readFileSync(__dirname + '/client-cert.pem');
const pkey = fs.readFileSync(__dirname + '/client-key.pem');

connection = mysql.createConnection({
  host: '34.73.250.171',
  user: 'jdfmain',
  password: '$mf_db',
  database: 'rmf',
  ssl: {
    ca: sca,
    key: pkey,
    cert: crt,
  },
});
connection.connect();

app.all('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'PUT');
  next();
});

app.use(bodyParser.json());
app.use((req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ');
    const profile = jwt.verify(token[1], 'brick-hack-private-key');
    if (profile.exp * 1000 > new Date()) {
      req.profile = profile;
    }
  }
  next();
});

app.get('/test', (req, res) => {
  console.log(req.profile);
});

const authRouter = require('./routes/auth')(connection);
app.use(authRouter);

const facilityRouter = require('./routes/facilities')(connection);
app.use('/api', facilityRouter);


app.listen(port, () => console.log(`Rate my Facilities is listening on port ${port}!`));

