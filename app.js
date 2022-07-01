require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const routes = require('./routes');
const errHandler = require('./middlewares/errHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, MONGOBASE = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

mongoose.connect(MONGOBASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const app = express();

app.use(express.json());

app.use(helmet());

app.use(cors());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// все routes в index.js
routes(app);

app.use(errorLogger);

app.use(errors());

app.use(errHandler);

app.listen(PORT);
