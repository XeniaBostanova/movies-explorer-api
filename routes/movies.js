const router = require('express').Router();
const {
  getMovies,
  postMovie,
  deleteMovie,
} = require('../controllers/movies');
const { validationPostMovie, validationDeleteMovie } = require('../middlewares/validation');

router.get('/', getMovies);

router.post('/', validationPostMovie, postMovie);

router.delete('/:_id', validationDeleteMovie, deleteMovie);

module.exports = router;
