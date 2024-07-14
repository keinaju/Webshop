module.exports = function (request, response) {
    response.render('login', { user: request.user });
};