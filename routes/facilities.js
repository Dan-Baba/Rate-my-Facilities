const RestroomEnum = {
  GENDER_NEUTRAL: 0,
  MALE: 1,
  FEMALE: 2,
};

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

  // '/rate/:username/:rr_id/:place_id/:clean_rating/:bathroom_type'
  const rateRRFunction = async (req, res, next) => {
    await connection.query('SELECT * FROM rr_ratings WHERE username = ? AND rr_id = ?',
    [req.param('username'), req.param('rr_id')], (err, result, fields) => {
      if (result.length === 1) {
        // It's a repeat vote
        const oldType = result[0].type;
        // Step 1: Update the entry in rr_ratings
        connection.query('UPDATE rr_ratings SET p_clean_rating = ' + req.param('p_clean_rating')
        + ', type = ' + req.param('type') + ' WHERE username = \'' + req.param('username') +
        '\' AND rr_id = ' + req.param('rr_id'), (error, results, fields) => {
          // Step 2: update the correct entry in restrooms
          // s2p1: get all rr_ratings entries that match the new restroom vote
          connection.query('SELECT * FROM rr_ratings WHERE rr_id = ' + req.param('rr_id') +
          ' AND type = ' + req.param('type'), (err, resultos, fields) => {
            let sum = 0;
            let i;
            for (i = 0; i < resultos.length; i++) {
              sum = sum + resultos[i].p_clean_rating;
            }
            // s2p2: update the restrooms entry
            const count = resultos.length;
            connection.query('UPDATE restrooms SET clean_rating = ' + (sum / count) +
            ' WHERE rr_id = ' + req.param('rr_id') + ' AND type = ' + req.param('type'),
            (error, resultas, fields) => {
              if (error) console.log(error.message);
              else {
                // No reviews yet for the restroom!
                if (resultas.affectedRows === 0) {
                  connection.query('INSERT INTO restrooms (rr_id, place_id, clean_rating, type) VALUES (?, ?, ?, ?)',
                  [req.param('rr_id'), req.param('place_id'), req.param('p_clean_rating'), req.param('type')],
                  (err, result) => {
                    if (err) console.log(err.message);
                  });
                }
                console.log('RECORD UPDATED IN restrooms rr_id ' + req.param('rr_id') + ':   clean rating -> '
                + (sum / count));
              }
            });
          });
        });

        // Step 3: Update the entry that had one of its "children" in rr_ratings deleted
        // s3p1 get all rr_ratings entries that match the old restroom vote
        connection.query('SELECT * FROM rr_ratings WHERE rr_id = ' + req.param('rr_id') +
          ' AND type = ' + oldType, (err, resultis, fields) => {
          let sum = 0;
          let i;
          for (i = 0; i < resultis.length; i++) {
            sum = sum + resultis[i].p_clean_rating;
          }
          // s3p2 update the restrooms entry
          const count = resultis.length;
          connection.query('UPDATE restrooms SET clean_rating = ' + (sum / count) +
          ' WHERE rr_id = ' + req.param('rr_id') + ' AND type = ' + oldType,
          (error, resultisimos, fields) => {
            if (error) console.log(error.message);
            else {
              console.log('RECORD UPDATED IN restrooms rr_id ' + req.param('rr_id') + ':   clean rating -> '
              + (sum / count));
            }
          });
        });

      } else {
        // It's a new vote
        connection.query('INSERT INTO rr_ratings (username, rr_id, p_clean_rating, type) VALUES (?, ?, ?, ?)',
          [req.param('username'), req.param('rr_id'), req.param('p_clean_rating'), req.param('type')],
          (err, result) => {
          if (err) {
            console.log(err.message);
          } else {
            console.log('RECORD INSERTED INTO rr_ratings:  ' + req.param('username')
            + ', ' + req.param('rr_id'));
          }

          connection.query('SELECT * FROM rr_ratings WHERE rr_id = ' + req.param('rr_id') +
          ' AND type = ' + req.param('type'), (err, result, fields) => {
            let sum = 0;
            let i;
            for (i = 0; i < result.length; i++) {
              sum = sum + result[i].p_clean_rating;
            }
            const count = result.length;
            connection.query('UPDATE restrooms SET clean_rating = ' + (sum / count) +
            ' WHERE rr_id = ' + req.param('rr_id') + ' AND type = ' + req.param('type'),
            (error, results, fields) => {
              if (error) console.log(error.message);
              else {
                // No reviews yet for the restroom!
                if (results.affectedRows === 0) {
                  connection.query('INSERT INTO restrooms (rr_id, place_id, clean_rating, type) VALUES (?, ?, ?, ?)',
                  [req.param('rr_id'), req.param('place_id'), req.param('p_clean_rating'), req.param('type')],
                  (err, result) => {
                    if (err) console.log(err.message);
                  });
                }
                console.log('RECORD UPDATED IN restrooms rr_id ' + req.param('rr_id') + ':   clean rating -> '
                + (sum / count));
              }
            });
          });
        });
      }
        
      next();
    });
  };

  const getRatingsFunction = async (req, res, next) => {

    connection.query('SELECT place_id, rr_id, clean_rating, type FROM facilities ' +
      'NATURAL JOIN restrooms', (err, result, fields) => {
      if (err) console.log(err.message);
      console.log(result);

      let i = 0;
      let j = 0;
      let k = 0;
      for (i = 0; i < req.data.length; i++) {
        for (j = 0; j < result.length; j++) {
          for (k = 0; k < 3; k++) {
            if (req.data[i].id == result[j].place_id && k === result[j].type) {
              if (k === 0) {
                req.data[i].GNrating = result[j].clean_rating;
              } else if (k === 1) {
                req.data[i].Mrating = result[j].clean_rating;
              } else {
                req.data[i].Frating = result[j].clean_rating;
              }
            } else {
              if (k === 0) {
                req.data[i].GNrating = -1.0;
              } else if (k === 1) {
                req.data[i].Mrating = -1.0;
              } else {
                req.data[i].Frating = -1.0;
              }
            }
          }
        }
      }
      next();
    });
  };

  const buildListFunction = async (req, res, next) => {

    await connection.query('SELECT place_id FROM facilities', (err, result, fields) => {
      if (err) throw err;
      console.log(result);

      let bigList = [];
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
              } else {
                console.log('RECORD INSERTED INTO facilities:  ' + req.data[i].place_id);
              }
            });
          }
        } catch (err) {
          console.log(err.message);
        }
        
        bigList.push({place_id: req.data[i].place_id,
          name: req.data[i].name,
          lat: req.data[i].geometry.location.lat,
          lng: req.data[i].geometry.location.lng,
          rr_id: req.data[i].rr_id});
      }
      req.data = bigList;
      
      next();

    });
  };

  // Routes
  facilityRouter.get('/:latitude/:longitude', asyncFunction, buildListFunction, getRatingsFunction,
   (req, res) => {
    res.send(req.data);
  });

  facilityRouter.get('/rate/:username/:rr_id/:place_id/:p_clean_rating/:type',
    rateRRFunction, (req, res) => {
    res.send(req.data);
  });


  return facilityRouter;
}

module.exports = routes;
