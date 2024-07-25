import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let code = 500;
    res.status(code).send("Internal server error");
};

export default errorHandler;
