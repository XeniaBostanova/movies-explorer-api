const authorization = require('./authorization');
const auth = require('../middlewares/auth');
const users = require('./users');
const movies = require('./movies');
const NotFoundError = require('../errors/not-found-err');

module.exports = function appRoutes(app) {
  app.use('/', authorization);
  app.use('/users', auth, users);
  app.use('/movies', auth, movies);
  app.use('*', auth, (_, res, next) => next(new NotFoundError('Страница по указанному URL не найдена')));
};
