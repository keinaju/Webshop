const database = require('../../services/database');

const length_of_hundred = {
    errorMessage: 'Field must be 1 to 100 characters.',
    options: { min: 1, max: 100 },
};

//Export schemas
module.exports = {
    category_name: {
        category_name: { isLength: length_of_hundred }
    },

    order: {
        order_id: {
            custom: {
                options: async order_id => {
                    const order = await database.get.order(order_id);
                    if (order) return true;
                    else throw new Error('Order doesn\'t exist.');
                }
            }
        },
        new_status: { isLength: length_of_hundred }
    },

    product: {
        product_name: { isLength: length_of_hundred },
        product_code: { isLength: length_of_hundred },
        price: {
            isNumeric: {
                errorMessage: 'Price must be numeric.'
            }
        }
    },

    product_query: {
        code: {
            isLength: {
                errorMessage: 'Code must be 1 to 100 characters.',
                options: { min: 1, max: 100 },
                bail: true
            },
            custom: {
                options: async id => {
                    const product = await database.get.product(id);
                    if (product) return true;
                    else throw new Error('Product doesn\'t exist.');
                }
            }
        }
    },

    shopping_cart: {
        product_id: { isLength: length_of_hundred },
        quantity: { isInt: { errorMessage: 'Quantity must be integer.' } }
    },

    user: {
        email: {
            trim: true,
            isLength: length_of_hundred,
            isEmail: { errorMessage: 'Field must be valid email.' },
            normalizeEmail: {
                options: {
                    all_lowercase: true,
                    gmail_remove_dots: false
                }
            },
            custom: {
                options: async email => {
                    const user = await database.get.user(email);
                    if (user) throw new Error('Email is in use.');
                    else return true;
                }
            }
        },
        password: {
            isLength: {
                errorMessage: 'Password must be 8 to 100 characters.',
                options: { min: 8, max: 100 }
            }
        },
        confirm_password: {
            custom: {
                options: (confirm_password, { req }) => {
                    if (confirm_password != req.body.password)
                        throw new Error('Mismatch in password fields.');
                    else
                        return true;
                }
            }
        },
        first_name: { trim: true, isLength: length_of_hundred },
        last_name: { trim: true, isLength: length_of_hundred }
    }
};