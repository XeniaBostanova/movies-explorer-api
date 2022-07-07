const errHandler = (err, _, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  res.status(500).send({ message: 'Ошибка по умолчанию' });
  return next();
};

module.exports = errHandler;
