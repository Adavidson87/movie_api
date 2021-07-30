const express = require('express');
const GenresRouter = express.Router;
const Models = require('../models.js');
const Genres = Models.Genre;
const passport = require('passport');
const { check, validationResult } = require('express-validator');

GenresRouter.get('/', (req, res) => { /* get request for all genres */
  Genres.find()
    .then((genres) => {
      res.status(201).json(genres);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
})
  .get('/:Name', (req, res) => { /* get request for genre by name */
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
