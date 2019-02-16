const router = require('express').Router();

router.get('/', () => {
  res.send('Hello World!');
});

module.exports = router;
