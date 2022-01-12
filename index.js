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


let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234', 'http://localhost:4200', 'https://adavidson87.github.io/myflix-Angular-client', 'https://upload.wikimedia.org/wikipedia'];

//imports authentication code
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

/**
 * @method GET
 * @param {string} endpoint for loading welcome page
 * @returns {object} welcome page
 */
app.get('/', (req, res) => {
  res.send('My top 10 favorite movies!');
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
