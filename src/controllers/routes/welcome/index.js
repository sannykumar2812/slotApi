const express = require('express');
const router = express.Router();
const middlewares = require('../../../middlewares');
const services = require('../../../services');
const rules = require('../../../../rules');

const validate = middlewares.validate;
const sanitize = middlewares.sanitize;
const welcome = services.welcome;


router
  .route('/welcome')
  .post(sanitize, validate(rules.default), (req, res, next) => {
    const body = req.payload;
    welcome(body)
      .then(result => res.status(200).json(result))
      .catch(error => next(error));
  });

module.exports = router;