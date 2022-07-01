const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const { validationSingUp, validationSingIn } = require('../middlewares/validation');

router.post('/signup', validationSingUp, createUser);

router.post('/signin', validationSingIn, login);

module.exports = router;
