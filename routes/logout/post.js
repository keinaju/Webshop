const multer = require('multer');
const multer_parser = multer();

module.exports = [
    multer_parser.none(),
    request_handler
];

function request_handler(request, response, next) {
    request.logout(function (error) {
        if (error) return next(error);
        response.redirect('/');
    });
};