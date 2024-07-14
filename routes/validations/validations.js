const { checkSchema, validationResult } = require('express-validator');
const schemas = require('./schemas');

function pass_merchants(request, response, next) {
    if (!request.user) return response.redirect('/login');
    if (request.user.role == 'admin') return next();
    if (request.user.role == 'merchant') return next();
    return response.redirect('/login');
}

function pass_any_users(request, response, next) {
    if (request.user) return next();
    return response.redirect('/login');
}

function check_results(request, response, next) {
    const result = validationResult(request);
    //Validation has no errors:
    if (result.isEmpty()) return next();
    //Validation has errors:
    else return response.send({ errors: result.array() });
}

//Export express-validator compatible validation chains by combining schemas and result handlers
module.exports = {
    category: {
        page: pass_merchants,
        add: [
            pass_merchants,
            checkSchema(schemas.category_name),
            check_results
        ]
    },

    checkout: {
        page: pass_any_users,
        post: pass_any_users
    },

    orders: {
        page: pass_merchants,
        update: [
            pass_merchants,
            checkSchema(schemas.order),
            check_results
        ]
    },

    product_query: [
        checkSchema(schemas.product_query),
        check_results
    ],

    products: {
        add_page: pass_merchants,
        add_post: [
            pass_merchants,
            checkSchema(schemas.product),
            check_results
        ],
        modify_page: [
            pass_merchants,
            checkSchema(schemas.product_query),
            check_results
        ],
        modify_post: [
            pass_merchants,
            checkSchema(schemas.product_query),
            checkSchema(schemas.product),
            check_results
        ],
    },

    shop: pass_merchants,

    shopping_cart: [
        checkSchema(schemas.shopping_cart),
        check_results
    ],

    user: [
        checkSchema(schemas.user),
        check_results
    ]
};