/*
 * index.js
 */
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 3000;

const mysql = require('mysql');
require('dotenv').load();

connection = mysql.createConnection({
  host: '34.73.250.171',
  user: 'root',
  password: 'db_test',
  database: 'rmf',
});
connection.connect();

app.use(bodyParser.json());

const authRouter = require('./routes/auth')(connection);
app.use(authRouter);

app.use(require('./routes/facilities'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
