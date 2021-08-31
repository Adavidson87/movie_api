require('dotenv').config();
const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  methodOverride = require('method-override'),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  Movies = Models.Movie,
  Users = Models.User,
  Directors = Models.Director,
  Genres = Models.Genre,
  config = require('./config.js'),
  UsersRouter = require('./users/users-router'),
  MoviesRouter = require('./movies/movies-router'),
  DirectorsRouter = require('./directors/directors-router'),
  GenresRouter = require('./genres/genres-router');

mongoose.connect(config.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
const { check, validationResult } = require('express-validator');

const cors = require('cors');
app.use(cors())

app.use(express.static('public'));
app.use(express.json());
app.use(morgan('common'));
app.use('/users', UsersRouter);
app.use('/movies', MoviesRouter);
app.use('/directors', DirectorsRouter);
app.use('/genres', GenresRouter);

app.use(bodyParser.urlencoded({
  extended: true
}));


let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234', 'https://peaceful-forest-99574.herokuapp.com/myflix-cryptic-waters.herokuapp.com', 'https://upload.wikimedia.org/wikipedia'];

// app.use(cors()(
//   {
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
//         let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
//         return callback(new Error(message), false);
//       }
//       return callback(null, true);
//     }
//   }));

//imports authentication code
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

app.get('/', (req, res) => {
  res.send('My top 10 favorite movies!');
});

app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => { /* get request for all movies */
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
});

app.get('/movie/:Title', passport.authenticate('jwt', { session: false }), (req, res) => { /* get request for movie by title */
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
});

app.post('/movies', passport.authenticate('jwt', { session: false }), (req, res) => { /* adds a movie */
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
          .then((movie) => { res.status(201).json(movie) })
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
});

app.put('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => { /* update a movie */
  let obj = {};
  if (req.body.Title) {
    obj.Title = req.body.Title
  }
  if (req.body.Description) {
    obj.Description = Description
  }
  if (req.body.Director) {
    obj.Director = req.body.Director
  }
  if (req.body.Genre) {
    obj.Genre = req.body.Genre
  }
  if (req.body.ImagePath) {
    obj.ImagePath = req.body.ImagePath
  }
  if (req.body.Actors) {
    obj.Actors = req.body.Actors
  }
  if (req.body.Featured) {
    obj.Featured = req.body.Featured
  }
  Movies.findOneAndUpdate({ Title: req.params.Title }, { $set: obj },
    { new: true },
    (err, updatedMovie) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedMovie);
      }
    });
});

app.delete('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => { /*  Deletes a movie from our list by title */
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

app.get('/directors', passport.authenticate('jwt', { session: false }), (req, res) => { /* GET request for all directors */
  Directors.find()
    .then((director) => {
      res.status(201).json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
});

app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => { /* GET request for director by name */
  Directors.findOne({ Name: req.params.Name })
    .then((director) => {
      res.json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
});

app.get('/genres', passport.authenticate('jwt', { session: false }), (req, res) => { /* get request for all genres */
  Genres.find()
    .then((genres) => {
      res.status(201).json(genres);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
});

app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => { /* get request for genre by name */
  Genres.findOne({ Name: req.params.Name })
    .then((genre) => {
      res.json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});

app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
