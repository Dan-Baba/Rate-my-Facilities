/*
 * index.js
 */
const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');

connection = mysql.createConnection({
  host: '34.73.250.171',
  user: 'root',
  password: 'db_test',
  database: 'rmf',
});

connection.connect();
result = 0;
connection.query('SELECT * FROM facilities', function(error, results, fields) {
  if (error) throw error;
  result = results[0];
  console.log('The solution is: ', results[0].placeID);
});
connection.end();

app.get('/', (req, res) => {
  res.send('' + result.placeID);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
