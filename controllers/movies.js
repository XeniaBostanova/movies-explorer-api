const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');
const Movie = require('../models/movie');

const getMovies = (_, res, next) => {
  Movie.find({})
    .populate('owner')
    .then((movies) => res.send(movies))
    . catch(next);
};

const deleteMovie = (req, res, next) => {
  const deleteMovieHandler = () => {
    Movie.findByIdAndRemove(req.params._id)
      .then(() => res.send({ message: 'Фильм удален' }))
      .catch((err) => {
        if (err.kind === 'ObjectId') {
          return next(new BadRequestError('Переданный _id некорректный'));
        }
        return next(err);
      });
  };

  Movie.findById(req.params._id)
    .then((movieInfo) => {
      if (!movieInfo) {
        return next(new NotFoundError('Фильм с указанным _id не найден'));
      }

      if (req.user._id !== movieInfo.owner.toString()) {
        return next(new ForbiddenError('Нет прав на удаление фильма'));
      }

      return deleteMovieHandler();
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequestError('Переданный _id некорректный'));
      }
      return next(err);
    });
};

const postMovie = (req, res, next) => {
  const {
    country, director, duration,
    year, description, image,
    trailerLink, thumbnail, movieId,
    nameRU, nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  postMovie,
  deleteMovie,
};
