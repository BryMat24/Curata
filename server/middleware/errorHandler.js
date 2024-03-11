const errorHandler = (err, req, res, next) => {
    let code = 500;
    console.log(err);
    res.status(code).send("Internal server error");
}

module.exports = errorHandler;