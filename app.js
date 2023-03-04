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

const { PORT = 3001 } = process.env;

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
})
  .then(console.log('connected to data base'));

const app = express();
app.use(cors);
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());
app.use(requestLogger);

app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});