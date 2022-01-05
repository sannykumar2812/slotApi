const express = require('express');
const router = express.Router();
const middlewares = require('../../../middlewares');
const rules = require('../../../../rules');
const safePromise = require('../../../utilities/safe-promise');
const validate = middlewares.validate;
const sanitize = middlewares.sanitize;
const {
  slotGenerator
} = require('../../../services')

router
  .route('/timeslot')
  .post(sanitize, validate(rules.timeslot), async (req, res) => {
    const payload = req.payload
    const [error, data] = await safePromise(slotGenerator(payload))
    if (error) {

      return res.status(422).json({
        message: error
      })
    }
    res.json({
      "message": "Available slots",
      res: data
    })
  });
module.exports = router;