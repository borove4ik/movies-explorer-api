const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const statuses = require('./utils/statusCodes');
const { signout, login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const { signUpValidation, signInValidation } = require('./middlewares/celebrateValidation');
const MONGO_URL = require('./utils/env.config');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const NotFoundError = require('./errors/notFound');

const { PORT = 3000 } = process.env;
const { DB_URL, NODE_ENV } = process.env;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(requestLogger);

mongoose.connect(NODE_ENV === 'production' ? DB_URL : MONGO_URL, {
  useNewUrlParser: true,
});

app.use('/users', auth, userRouter);
app.use('/movies', auth, movieRouter);

app.post('/signin', signInValidation, login);

app.post('/signup', signUpValidation, createUser);

app.post('/signout', signout);

app.use(errors());
app.use(errorLogger);

app.all('*', auth, (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({
    message: !err.statusCode ? 'Ошибка на стороне сервера' : err.message,
  });
});
