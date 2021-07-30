const express = require('express');
const MoviesRouter = express.Router;
const Models = require('../models.js');
const Movies = Models.Movie;
const passport = require('passport');
const {check, validationResult} = require('express-validator');


MoviesRouter.get('/movies', (req, res) => { /* get request for all movies */
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch(( err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
})
.get('/movie/:Title', (req, res) => { /* get request for movie by title */
  Movies.findOne({ Title: req.params.Title })
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
})
.post('/movies', passport.authenticate('jwt', {session: false}), (req, res) => { /* adds a movie */
  Movies.findOne({ Title: req.body.Title })
  .then((movie) => {
    if (movie) {
      return res.status(400).send(req.body.Title + 'already exists');
    } else {
      Movies
      .create({
        Title: req.body.Title,
        Description: req.body.Description,
        Director: req.body.Director,
        Genre: req.body.Genre,
        ImagePath: req.body.ImagePath,
        Actors: req.body.Actors,
        Featured: req.body.Featured
      })
      .then((movie) => {res.status(201).json(movie) })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error ' + error);
  });
})
.delete('/movie/:Title', passport.authenticate('jwt', {session: false}), (req, res) => { /*  Deletes a movie from our list by title */
  Movies.findOneAndRemove({ Title: req.params.Title })
  .then((movie) => {
    if (!movie) {
      res.status(400).send(req.params.Title + ' was not found');
    } else {
      res.status(200).send(req.params.Title + ' was deleted.');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

module.exports = MoviesRouter
