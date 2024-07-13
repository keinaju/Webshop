module.exports = {
    category_name: {
        category_name: {
            notEmpty: true,
            isLength: {
                errorMessage: 'Name must be 1 to 100 characters.',
                options: { min: 1, max: 100 }
            }
        }
    },
};