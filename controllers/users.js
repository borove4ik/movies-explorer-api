const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const NotFoundError = require('../errors/notFound');
const MongoDuplicateConflict = require('../errors/mongoDuplicate');
const statuses = require('../utils/statusCodes');
const BadRequestError = require('../errors/badRequest');
const UnauthorizedError = require('../errors/unauthorized');
const User = require('../models/user');

module.exports.createUser = async (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  return User
    .create({
      name, email, password: hashedPassword,
    })
    .then((newUser) => res.status(statuses.CREATED).send({
      name: newUser.name,
      email: newUser.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Не удалось добавить пользователя'));
      } if (err.code === 11000) {
        return next(new MongoDuplicateConflict('Пользователь с таким email уже существует'));
      }
      return next(err);
    });
};

const getUserById = (req, res, userData, next) => {
  User.findById(userData)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => res.status(statuses.OK_REQUEST).send({
      name: user.name,
      email: user.email,
    }))
    .catch((error) => next(error));
};

module.exports.getAuthorizedUserInfo = (req, res, next) => {
  const userData = req.user._id;
  getUserById(req, res, userData, next);
};

module.exports.updateUser = async (req, res, next) => {
  const { _id } = req.user;
  const { name, email } = req.body;
  User
    .findByIdAndUpdate({ _id }, { name, email }, { new: true, runValidators: true })
    .then(() => {
      res.status(statuses.OK_REQUEST).send({ _id, name, email });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Не удалось обновить информацию'));
      }
      if (err.code === 11000) {
        return next(new MongoDuplicateConflict('Такой email уже существует'));
      } return next(err);
    });
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const foundUser = await User.findOne({ email }).select('+password');
  if (!foundUser) {
    return next(new UnauthorizedError('пользователь с таким email не найден'));
  }
  const compareResult = await bcrypt.compare(password, foundUser.password);
  if (!compareResult) {
    return next(new UnauthorizedError('Неверный пароль'));
  }
  const token = generateToken({ _id: foundUser._id });
  res.cookie('jwt', token, {
    maxAge: 3600000 * 24 * 7,
    httpOnly: true,
    sameSite: 'none',
    secure: false,
  });
  return res.send({
    email: foundUser.email,
    name: foundUser.name,
  });
};

module.exports.signout = async (req, res, next) => {
  try {
    res.clearCookie('jwt');
    res.status(statuses.OK_REQUEST);
    return res.send(true);
  } catch (err) {
    if (err.name === 'BadRequest') {
      return next(new BadRequestError('Не удалось выйти'));
    }
    return next(err);
  }
};
