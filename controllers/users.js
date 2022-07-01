const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const User = require('../models/user');
const ConflictError = require('../errors/conflict-err');

const { NODE_ENV, JWT_SECRET } = process.env;
const saltRounds = 10;
const MONGO_DUPLICATE_KEY_CODE = 11000;

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  return bcrypt.hash(password, saltRounds)
    .then((hash) => User.create({
      name, email, password: hash,
    })
      .then((user) => {
        res.send({
          name: user.name,
          email,
        });
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === MONGO_DUPLICATE_KEY_CODE) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
      return next(err);
    });
};

const updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      if (err.code === MONGO_DUPLICATE_KEY_CODE) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      return res.send(user);
    })
    .catch(next);
};

module.exports = {
  createUser,
  updateUserProfile,
  login,
  getCurrentUser,
};
