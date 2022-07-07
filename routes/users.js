const router = require('express').Router();
const {
  updateUserProfile,
  getCurrentUser,
} = require('../controllers/users');
const { validationUpdateUserProfile } = require('../middlewares/validation');

router.get('/me', getCurrentUser);

router.patch('/me', validationUpdateUserProfile, updateUserProfile);

module.exports = router;
