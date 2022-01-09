const express = require('express');
const DirectorsRouter = express.Router();
const Models = require('../models.js');
const Directors = Models.Director;
const passport = require('passport');
const { check, validationResult } = require('express-validator');

/**
 * @method GET
 * @param {string} endpoint to load all directors in database
 * @returns {object} returns list of all directors in database
 */
DirectorsRouter.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Directors.find()
    .then((director) => {
      res.status(201).json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
});
/**
 * @method GET
 * @param {string} endpoint to load directors
 * @param {string} Name to get a specific director by name
 * @returns {object} of a specific director
 */
DirectorsRouter.get('/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Directors.findOne({ Name: req.params.Name })
    .then((director) => {
      res.json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
});

module.exports = DirectorsRouter
