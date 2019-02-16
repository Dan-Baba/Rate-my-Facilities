/*
 * index.js
 */
const express = require('express');
const app = express();
const port = 3000;
const request = require('request');
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

const express = require('express');
const app = express();
const port = 3000;
const fetch = require('node-fetch');
require('dotenv').load();

app.use(require('./routes/facilities'));


const asyncFunction = async () => {
  const currBod = await fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?key='
  + process.env.MY_API_KEY + '&location=43.084589,-77.674344&rankby=distance');
  const response = await currBod.json();
  // await http.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?key='
  // + process.env.MY_API_KEY + '&location=43.084589,-77.674344&rankby=distance',
  // {json: true}, (err, res, body) => {
  //   if (err) {
  //     return console.log(err);
  //   }
  //   currBod = body;
  // });
  // console.log(response);
  return response;
};

/*
 * hasBod
 */
function hasBod(bod) {
  console.log(bod);
}

=======
app.get('/', (req, res) => {
  res.send('' + result.placeID);
});

>>>>>>> f138026cef228b28221d0ba49d7024693ab698ce
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

<<<<<<< HEAD
app.use(require('./routes/auth'));
app.use(require('./routes/facilities'));

=======
>>>>>>> 506ffeac2e6e8f290ebdc606f7c222fac8fcad1f
>>>>>>> f138026cef228b28221d0ba49d7024693ab698ce
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
