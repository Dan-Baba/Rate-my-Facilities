const mysql = require('mysql');

connection = mysql.createConnection({
  host: '34.73.250.171',
  user: 'root',
  password: '',
  database: 'rmf',
});

connection.connect();
connection.query('SELECT * FROM facilities', function(error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].placeID);
});
connection.end();

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
