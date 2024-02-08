const movieRouter = require('express').Router();
const { getMovies, createMovie, deleteMovieById } = require('../controllers/movies');

const { validationCreateMovie, validationDeleteMovie } = require('../middlewares/celebrateValidation');

movieRouter.get('/', getMovies);

movieRouter.post('/', validationCreateMovie, createMovie);

movieRouter.delete('/:movieId', validationDeleteMovie, deleteMovieById);

module.exports = movieRouter;
