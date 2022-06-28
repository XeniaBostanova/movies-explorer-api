const routerMovie = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getMovies,
  postMovie,
  deleteMovie,
} = require('../controllers/movies');

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

routerMovie.get('/', getMovies);

routerMovie.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().uri().custom(validateURL).required(),
    trailerLink: Joi.string().uri().custom(validateURL).required(),
    thumbnail: Joi.string().uri().custom(validateURL).required(),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), postMovie);

routerMovie.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
}), deleteMovie);

module.exports = routerMovie;
