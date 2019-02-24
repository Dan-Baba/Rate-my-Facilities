/*
 * index.js
 */
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const http = require('http');
require('dotenv').load();


if (fs.existsSync('/certs/server-ca.pem')) {
  const sca = fs.readFileSync(__dirname + '/certs/server-ca.pem');
  const crt = fs.readFileSync(__dirname + '/certs/client-cert.pem');
  const pkey = fs.readFileSync(__dirname + '/certs/client-key.pem');
} else {
  const sca = process.env.SERVER-CA;
  const crt = process.env.CLIENT-CERT;
  const pkey = process.env.CLIENT-KEY;
}

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
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    process.exit(1);
    return;
  }
});

// app.all('/*', function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
//   res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'PUT');
//   next();
// });

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


const authRouter = require('./routes/auth')(connection);
app.use('/api', authRouter);

const facilityRouter = require('./routes/facilities')(connection);
app.use('/api', facilityRouter);

// Point static path to dist
app.use(express.static(path.join(__dirname, 'ui/rate-my-facilities/dist')));
const allowedExt = [
  '.js',
  '.ico',
  '.css',
  '.png',
  '.jpg',
  '.woff2',
  '.woff',
  '.ttf',
  '.svg',
];
// Catch all other routes and return the index file
app.get('*', (req, res) => {
  if(allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
    res.sendFile(path.resolve('ui/rate-my-facilities/dist/rate-my-facilities/' + req.url));
  } else {
    res.sendFile(path.join(__dirname, 'ui/rate-my-facilities/dist/rate-my-facilities/index.html'));
  }
});

const server = http.createServer(app);

server.listen(port, () => console.log(`Rate my Facilities is listening on port ${port}!`));

