const errorHandler = (err, req, res, next) => {
  if (err)
    console.log("une erreur est survenue" + " " + "<<<" + err.message + " >>>");
  if (err.name === "UnauthorizedError") {
    // jwt authentication error
    return res.status(401).json({ message: "Invalid Token" });
  }
  res.status(500).json(err);
};

module.exports = errorHandler;
