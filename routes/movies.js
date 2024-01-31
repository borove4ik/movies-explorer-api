const movieRouter = require('express').Router();
const { getMovies, createMovie, deleteMovieById } = require('../controllers/movies');

movieRouter.get('/', getMovies);

movieRouter.post('/', createMovie);

movieRouter.delete('/:movieId', deleteMovieById);

module.exports = movieRouter;
