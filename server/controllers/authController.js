const jwt = require('jsonwebtoken');

const generateJWT = async (req, res) => {
  try {
    const user = req.body;
    const token = jwt.sign(
      user,
      process.env.JWT_SECRET || 'crowdspark_super_secret_jwt_key_2026_secure',
      { expiresIn: '7d' }
    );
    res.send({ token });
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

module.exports = { generateJWT };
