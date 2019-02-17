const router = require('express').Router();
const fetch = require('node-fetch');

// Functions
const asyncFunction = async (req, res, next) => {
  const currBod = await fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?key='
  + process.env.MY_API_KEY + '&location=' + req.param('latitude') + ',' +
  req.param('longitude') + '&rankby=distance');
  const response = await currBod.json();
  req.data = response.results;
  console.log(req.data);
  next();
};

const buildListFunction = async (req, res, next) => {
  let newString = '';
  let i;
  for (i = 0; i < req.data.length; i++) {
    newString = newString + 'PLACE ID: ' +
      req.data[i].place_id + '        NAME: ' + req.data[i].name + '\n';
  }
  req.data = newString;
  next();
};

// Routes
router.get('/:latitude/:longitude', asyncFunction,
    buildListFunction, (req, res) => {
      res.send(req.data);
    });

module.exports = router;
