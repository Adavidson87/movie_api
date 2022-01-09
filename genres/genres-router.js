const express = require('express');
const GenresRouter = express.Router();
const Models = require('../models.js');
const Genres = Models.Genre;
const passport = require('passport');
const { check, validationResult } = require('express-validator');

/**
 * @method GET
 * @param {string} endpoint that gets list of all genres from database
 * @returns {object} of all genres
 */
GenresRouter.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genres.find()
    .then((genres) => {
      res.status(201).json(genres);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
});
/**
 * @method GET
 * @param {string} endpoint that gets genres
 * @param {string} Name to get a specific genre by name
 * @returns {object} of a specific genre
 */
GenresRouter.get('/:Name', passport.authenticate('jwt', { session: false }), (req, res) => { /* get request for genre by name */
  Genres.findOne({ Name: req.params.Name })
    .then((genre) => {
      res.json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
});

module.exports = GenresRouter
