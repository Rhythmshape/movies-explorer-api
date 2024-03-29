const router = require('express').Router();

const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

const {
  validationUpdateUser,
} = require('../middlewares/validation');

router.get('/me', getCurrentUser);
router.patch('/me', validationUpdateUser, updateUser);

module.exports = router;
