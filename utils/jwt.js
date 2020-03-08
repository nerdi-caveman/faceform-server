const jwt = require("jsonwebtoken");
const error = require("./errorHandler");

/**
 * This is a middleware to verify jsonwebtoken token
 * @param {Object} request Express request object
 * @param {Object} response Express response object
 * @param {Function} next Express next function
 * @author Inioluwa Sogelola
 */
module.exports.verify = function(req, res, next) {
    const token = req.headers.authorization;
    if (!token)
      return error.send(
        res,
        "Access Denied, provide an access_token in request header"
      );

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    error.send(res, "Invalid Token");
  }
};

/**
 * Synchronously sign the given payload into a JSON Web Token string payload
 * @param {String | Buffer | Object} payload Express request object
 * @param {Number | String} exp Express response object
 * @author Inioluwa Sogelola
 */
module.exports.sign = function(payload, exp = 360000) {
  // create and assign jwt
  return jwt.sign(payload, process.env.TOKEN_SECRET || "My_Believe_In_Go_is_Great", {
    expiresIn: exp // default expires in 1 hour
  });
};
