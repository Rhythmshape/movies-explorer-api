require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const { limiter } = require('./middlewares/limiter');
const helmet = require('./node_modules/helmet');
const routes = require('./routes');

mongoose.set('strictQuery', true);

const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleError = require('./middlewares/handleError');

const { mongoDb } = require('./utils/startConfig');

const { PORT = 3001 } = process.env;

mongoose.connect(mongoDb, {
  useNewUrlParser: true,
})
  .then(console.log('connected to mongo data base'));

const app = express();
app.use(cors);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());
app.use(requestLogger);
app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
