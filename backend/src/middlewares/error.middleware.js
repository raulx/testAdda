import { ApiResponse } from '../utils/ApiResponse.js';

const errorHandler = (err, req, res, next) => {
    const statusCode1 = err.statusCode === 200 ? 500 : err.statusCode; //custom errors
    const statusCode2 = res.statusCode === 200 ? 500 : res.statusCode; //internal server errors
    const statusCode = statusCode1 || statusCode2;
    const message = err.message;

    res.status(statusCode).json(new ApiResponse(statusCode, {}, message));
};

export default errorHandler;
