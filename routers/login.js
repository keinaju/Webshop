const express = require('express');
const router = express.Router();
const multer = require('multer');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const get_user_by_email = require('../services/get_user_by_email');
const multer_parser = multer();
const bcrypt = require('bcrypt');

async function verify(email, password, cb) {
    try {
        const user = await get_user_by_email(email);

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

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, verify));

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', multer_parser.none(), passport.authenticate('local'));

module.exports = router;