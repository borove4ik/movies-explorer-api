const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET_PRODUCTION } = process.env;
const JWT_SECRET_DEVELOPMENT = 'secret-key';
const generateToken = (payload) => jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET_PRODUCTION : JWT_SECRET_DEVELOPMENT, { expiresIn: '7d' });

module.exports = {
  generateToken, JWT_SECRET_DEVELOPMENT,
};
