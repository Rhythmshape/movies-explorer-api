const router = require('express').Router();

const usersRouter = require('./users');
const moviesRouter = require('./movies');

const { createUser, login } = require('../controllers/users');
const { validationAddNewUser, validationLogin } = require('../middlewares/validation');

const auth = require('../middlewares/auth');

const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', validationLogin, login);
router.post('/signup', validationAddNewUser, createUser);

router.use('/users', auth, usersRouter);
router.use('/movies', auth, moviesRouter);

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
