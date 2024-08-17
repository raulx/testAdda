const errorHandler = (err, res) => {
  const statusCode1 = err.statusCode === 200 ? 500 : err.statusCode; //custom errors
  const statusCode2 = res.statusCode === 200 ? 500 : res.statusCode; //internal server errors
  res.status(statusCode1 || statusCode2).json({
    message: err.message,
    status: statusCode1 || statusCode2,
  });
};

export default errorHandler;
