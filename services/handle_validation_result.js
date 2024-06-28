const { validationResult } = require('express-validator');

module.exports = function handle_validation_result(req, res, next) {
    const result = validationResult(req);

    //Validation has no errors:
    if (result.isEmpty()) return next();

    //Validation has errors:
    else return res.send({ errors: result.array() });
};