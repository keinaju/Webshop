module.exports = function request_handler(request, response, next) {
    response.render('add_user', { user: request.user });
};