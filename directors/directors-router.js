const express = require('express');
const DirectorsRouter = express.Router();
const Models = require('../models.js');
const Directors = Models.Director;
const passport = require('passport');
const { check, validationResult } = require('express-validator');

DirectorsRouter.get('/', (req, res) => { /* GET request for all directors */
  Directors.find()
    .then((director) => {
      res.status(201).json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
})
  .get('/:Name', (req, res) => { /* GET request for director by name */
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
