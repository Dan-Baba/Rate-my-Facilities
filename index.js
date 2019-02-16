/*
 * index.js
 */

const express = require('express');
const app = express();
const port = 3000;
const request = require('request');
require('dotenv').load();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

let currBod;

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
