module.exports = function pass(...acceptable_roles) {
    //Return Express middleware compatible function:
    return function (req, res, next) {
        //If user isn't logged in, respond and terminate
        if (!req.user) return res.send('Unauthorized');

        //If role matches any of the arguments, go to next middleware
        for (const acceptable_role of acceptable_roles) {
            if (req.user.role == acceptable_role) return next();
        }

        //If role didn't match, respond and terminate
        return res.send('Unauthorized');
    };
};