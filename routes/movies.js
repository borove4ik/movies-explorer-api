const movieRouter = require('express').Router();
const auth = require('../middlewares/auth');

const { getMovies, createMovie, deleteMovieById } = require('../controllers/movies');

const { validationCreateMovie, validationDeleteMovie } = require('../middlewares/celebrateValidation');

movieRouter.get('/', auth, getMovies);

movieRouter.post('/', validationCreateMovie, auth, createMovie);

movieRouter.delete('/:movieId', validationDeleteMovie, deleteMovieById);

module.exports = movieRouter;
