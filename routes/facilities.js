const router = require('express').Router();

router.get('/', (r) => {
  res.send('Hello World!');
});

module.exports = router;
