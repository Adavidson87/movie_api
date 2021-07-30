const express = require('express');
const UsersRouter = express.Router;
const Models = require('../models.js');
const Users = Models.User;
const passport = require('passport');
const {check, validationResult} = require('express-validator');

//Adds a new user
UsersRouter.post('/users', [
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + 'already exists');
    } else {
      Users
      .create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then((user) => {res.status(201).json(user) })
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
.get('/users', (req, res) => { /* gets all users*/
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
})
.get('/users/:Username', (req, res) => { /* GET users by username*/
  Users.findOne({ Username: req.params.Username })
  .then((users) => {
    res.json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
})
.put('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => { /* update a users username */
  let hashedPassword = Users.hashPassword(req.body.Password);
  let obj = {};
  if (req.body.Username) {
    obj.Username = req.body.Username
  }
  if (req.body.Password) {
    obj.Password = hashedPassword
  }
  if (req.body.Email) {
    obj.Email = req.body.Email
  }
  if (req.body.Birthday) {
    obj.Birthday = req.body.Birthday
  }
  Users.findOneAndUpdate({ Username: req.params.Username }, {$set: obj},
  { new: true },
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
})
.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => { /* Adds a movie to a user's favorites list */
  Users.findOneAndUpdate({ Username: req.params.Username}, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
})
.delete('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => { /* Delete a user by username */
  Users.findOneAndRemove({ Username: req.params.Username })
  .then((user) => {
    if (!user) {
      res.status(400).send(req.params.Username + ' was not found');
    } else {
      res.status(200).send(req.params.Username + ' was deleted.');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
})
.delete('/users/:email', passport.authenticate('jwt', {session: false}), (req, res) => { /* deletes a users email */
  Users.findOneAndRemove({ Email: req.params.Email })
  .then((user) => {
    if (!user) {
      res.status(400).send(req.params.Email + ' was not found');
    } else {
      res.status(200).send(req.params.Email + ' was deleted.');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

module.exports = UsersRouter
