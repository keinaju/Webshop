const { checkSchema, validationResult } = require('express-validator');
const schemas = require('./schemas');

function pass_merchants(request, response, next) {
    if (!request.user) return response.redirect('/login');
    if (request.user.role == 'admin') return next();
    if (request.user.role == 'merchant') return next();
    return response.redirect('/login');
}

function handle_result(request, response, next) {
    const result = validationResult(request);
    //Validation has no errors:
    if (result.isEmpty()) return next();
    //Validation has errors:
    else return response.send({ errors: result.array() });
}

//Export express compatible validation chains by combining schemas and result handlers
module.exports = {
    category: {
        page: pass_merchants,
        add: [pass_merchants, checkSchema(schemas.category_name), handle_result]
    }
};