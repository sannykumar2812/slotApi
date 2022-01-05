const express = require('express');
const router  = express.Router();

//Write a loader here to avoid adding manual routes.
router.use(require(`./welcome`));
router.use(require('./time_slot'));

//index route
router.use('/', (req, res) => {
  res.json({
    ok: 1
  });
});

//health-check
router.use('/health-check', (req, res) => {
  res.json({
    alive: `${req.path} => yes`
  });
});

module.exports = router;