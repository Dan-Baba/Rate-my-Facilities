const router = require('express').Router();
const fetch = require('node-fetch');

// Functions
const asyncFunction = async (req, res, next) => {
  const currBod = await fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?key='
  + process.env.MY_API_KEY + '&location=43.084589,-77.674344&rankby=distance');
  const response = await currBod.json();
  req.data = response.results;
  next();
};

// Routes
router.get('/', asyncFunction, (req, res) => {
  res.send(req.data);
});

module.exports = router;
