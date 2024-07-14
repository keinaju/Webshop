module.exports = function (error, request, response, next) {
    const statusCode = error.statusCode || 500;
    console.error(error.message, error.stack);
    response.status(statusCode).json({ message: error.message });
    return;
};