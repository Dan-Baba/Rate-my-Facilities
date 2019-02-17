/*
 * index.js
 */
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
require('dotenv').load();

connection = mysql.createConnection({
  host: '34.73.250.171',
  user: 'root',
  password: 'db_test',
  database: 'rmf',
});
connection.connect();

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
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


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

