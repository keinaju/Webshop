module.exports = function request_handler(request, response) {
    response.render('login', { user: request.user });
};