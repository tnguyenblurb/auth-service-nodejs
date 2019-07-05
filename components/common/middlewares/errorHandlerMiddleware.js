exports.errorHandlerMiddleware = (err, req, res, next) => {
  // console.trace(err);
  res.status(err.status || 500).json({error: err});
};