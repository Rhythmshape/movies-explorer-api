const rateLimit = require('../node_modules/express-rate-limit');

module.exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Использовано слишком много попыток при подключении',
});
