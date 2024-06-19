const passport = require('passport');
const LocalStrategy = require('passport-local');
const get_user_by_email = require('./get_user_by_email');

async function verify(email, password, cb) {
    try {
        const user = await get_user_by_email(email);
        if (!user)
            return cb(null, false, { message: 'Incorrect email or password.' });
        console.log(user);
    }
    catch (error) {
        return cb(error);
    }
}

passport.use(new LocalStrategy(verify));

module.exports = passport;