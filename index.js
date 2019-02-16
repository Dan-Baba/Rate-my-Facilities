/*
 * index.js
 */
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

request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?key='
 + process.env.MY_API_KEY + '&location=43.084589,-77.674344&rankby=distance',
{json: true}, (err, res, body) => {
  if (err) {
    return console.log(err);
  }
  console.log(body.url);
  console.log(body.explanation);
  currBod = body.results;
  console.log(currBod);
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
