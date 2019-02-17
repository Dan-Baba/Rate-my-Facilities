/*
 * routes
 */
const routes = function(connection) {
  const facilityRouter = require('express').Router();
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
    /*
    connection.query('SELECT place_id FROM facilities', (err, result, fields) => {
      if (err) throw err;
      console.log(result);
    });

    connection.query('INSERT INTO facilities (place_id) VALUES (\'2\')', (err, result) => {
      if (err) throw err;
      console.log('1 record inserted: facility with id of \'2\'');
    });
    */

    await connection.query('SELECT place_id FROM facilities', (err, result, fields) => {
      if (err) throw err;
      console.log(result);

      let newString = '';
      let i;
      for (i = 0; i < req.data.length; i++) {
        try {
          if (result.indexOf(req.data[i].place_id) <= -1) {
            // It's not in the database!
            result.push(result.indexOf(req.data[i].place_id));
            connection.query('INSERT INTO facilities (place_id) VALUES (\'' +
              req.data[i].place_id +'\')', (err, result) => {
              if (err) {
                console.log(err.message);
              }
              else {
                console.log('RECORD INSERTED INTO facilities:  ' + req.data[i].place_id);
              }
            });
          }
        } catch (err) {
          console.log(err.message);
        }
  
        newString = newString + 'PLACE ID: ' +
          req.data[i].place_id + '   NAME: ' + req.data[i].name + '\n' +
          'TYPES: ';
        let j;
        for (j = 0; j < req.data[i].types.length; j++) {
          newString = newString + req.data[i].types[j] + ' ';
        }
        newString = newString + '\n' + 'LATITUDE: ' + req.data[i].geometry.location.lat +
          '   LONGITUDE: ' + req.data[i].geometry.location.lng + '\n\n';
      }
      req.data = newString;
      next();

    });
  };

  // Routes
  facilityRouter.get('/:latitude/:longitude', asyncFunction, buildListFunction, (req, res) => {
    res.send(req.data);
  });


  return facilityRouter;
}

module.exports = routes;
