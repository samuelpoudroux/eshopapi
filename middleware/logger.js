module.exports = function requestLogger(req, res, next) {
  if (!["OPTIONS", "HEAD"].includes(req.method.toUpperCase())) {
    console.log(`===========================`);
    console.log(`[${req.method}]\t - ${req.url}`);
  }
  next();
};
