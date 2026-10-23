const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ error: true, message: 'Unauthorized access. Token not provided.' });
  }

  const token = authorization.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET || 'crowdspark_super_secret_jwt_key_2026_secure', (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: true, message: 'Unauthorized access. Token invalid or expired.' });
    }
    req.decoded = decoded;
    next();
  });
};

module.exports = { verifyToken };
