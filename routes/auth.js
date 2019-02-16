const router = require('express').Router();

router.post('/', (req, res) => {
  console.log(req.body[0]);
});

module.exports = router;
