const jwt = require('jsonwebtoken');
const { response } = require('../util/response');
const { responseStatus } = require('../langs/vn');

const verifyToken = (accessToken) => {
  if (!accessToken) {
    return { error: 'No token provided' };
  }

  // Handle both "Bearer token" and direct token formats (case-insensitive)
  const token = accessToken.toLowerCase().startsWith('bearer ')
    ? accessToken.split(' ')[1]
    : accessToken;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { payload: decoded.payload };
  } catch (error) {
    return { error: error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token' };
  }
};

// Base authentication middleware
const authenticate = (req, res, next) => {
  const accessToken = req.headers['authorization'];
  const result = verifyToken(accessToken);

  if (result.error) {
    return res.status(401).json(
      response(responseStatus.fail, 'Authentication required: ' + result.error),
    );
  }

  // Attach user info to request
  req.idUser = result.payload?.idUser;
  req.email = result.payload?.email;
  req.role = result.payload?.role;
  next();
};

exports.isAuth = authenticate;

exports.isAdmin = (req, res, next) => {
  // First authenticate the user
  authenticate(req, res, (err) => {
    if (err) return next(err);

    // Then check admin role
    if (!req.role || req.role !== 'admin') {
      return res.status(403).json(
        response(responseStatus.fail, 'Admin access required'),
      );
    }

    next();
  });
};
