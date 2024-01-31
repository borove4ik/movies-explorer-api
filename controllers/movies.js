const movie = require('../models/movie');
const BadRequestError = require('../errors/badRequest');
const statuses = require('../utils/statusCodes');

module.exports.getMovies = async (req, res, next) => {
  try {
    const UserId = req.user._id;
    const movies = await movie.find({ owner: { $eq: UserId } });
    return res.send(movies);
  } catch (error) {
    return next(error);
  }
};

module.exports.createMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  } = req.body;
  movie
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner,
    })
    .then(() => res.status(statuses.OK_REQUEST).send({ message: 'Фильм добавлен' }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Не удалось добавить фильм'));
      }
      return next(err);
    });
};

module.exports.deleteMovieById = async (req, res, next) => {
  const { movieId } = req.params;
  movie
    .updateOne(
      { _id: movieId },
      {
        $set: {
          owner: '',
        },
      },
    )
    .then(() => res.status(statuses.OK_REQUEST).send({ message: 'Фильм удалён' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан некорректный _id фильма'));
      }
      return next(err);
    });
};
