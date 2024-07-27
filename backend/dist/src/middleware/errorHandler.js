"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    let code = 500;
    res.status(code).send("Internal server error");
};
exports.default = errorHandler;
