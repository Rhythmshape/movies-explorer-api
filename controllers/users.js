const { JWT_SECRET, NODE_ENV } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictRequestError = require('../errors/ConflictRequestError');

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  return User.findById(userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({ ...req.body, password: hash }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        _id: user._id,
        email: user.email,
        message: 'Пользователь создан',
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictRequestError('Пользователь уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  ).orFail(() => {
    throw new NotFoundError('Пользователь не найден');
  })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`,
        { expiresIn: '7d' },
      );
      res.send({ token, message: 'Успешная Авторизация!' });
    })
    .catch(next);
};
