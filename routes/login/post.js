const bcrypt = require('bcrypt');
const database = require('../../services/database');
const multer = require('multer');
const multer_parser = multer();
const passport = require('passport');
const LocalStrategy = require('passport-local');

async function verify(email, password, cb) {
    try {
        const user = await database.get.user(email);
        if (!user)
            return cb(null, false, { message: 'User doesn\'t exist.' });
        bcrypt.compare(password, user.hashed_password, (error, result) => {
            if (error) return cb(error);
            if (result) return cb(null, user);
            else return cb(null, false, { message: 'Incorrect password.' });
        });
    }
    catch (error) {
        return cb(error);
    }
}

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, verify));

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, {
            id: user.id,
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
        });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

module.exports = [
    multer_parser.none(),
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
    })
];