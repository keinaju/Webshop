const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const passport = require('passport');

module.exports = [
    session({
        secret: process.env.SESSION_SECRET,
        cookie: { maxAge: 86400000 }, //Expire in 24 hours
        store: new MemoryStore({ checkPeriod: 86400000 }),
        resave: false,
        saveUninitialized: false,
    }),

    passport.authenticate('session'),
];