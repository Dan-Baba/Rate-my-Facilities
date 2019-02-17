/*
 * index.js
 */
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');
require('dotenv').load();
const passport = require('passport');
require('./passport');

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

const facilityRouter = require('./routes/facilities')(connection);
app.use(facilityRouter);

const json = '{"result":true, "count":42}';
obj = JSON.parse(json);

console.log(obj.count);
console.log(obj.result);
app.put('/test', passport.authenticate('local', {session: false}),
    (req, resp) => {
      resp.send('Derp');
    }
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
