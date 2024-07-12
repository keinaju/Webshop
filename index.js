require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const helmet = require('helmet');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const passport = require('passport');

//View engine settings
app.set('views', './views');
app.set('view engine', 'pug');

app.use(helmet({ contentSecurityPolicy: false }));

//Session support
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 86400000 }, //Expire in 24 hours
    store: new MemoryStore({ checkPeriod: 86400000 }),
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

app.use(require('./routers/exports'));

//Serve static files from public folder
app.use('/public', express.static(process.env.PUBLIC_DIRECTORY_PATH));

//Error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
});

app.listen(port, () => {
    console.log(`Listening at port ${port}.`);
});