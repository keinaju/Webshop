const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const passport = require('passport');
require('dotenv').config();

//View engine settings
app.set('views', './views');
app.set('view engine', 'pug');

//Session support
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 86400000 }, //Expire in 24 hours
    store: new MemoryStore({ checkPeriod: 86400000 }),
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

//Route modules
app.use(
    require('./routers/categories'),
    require('./routers/default'),
    require('./routers/login'),
    require('./routers/logout'),
    require('./routers/order'),
    require('./routers/orders'),
    require('./routers/product'),
    require('./routers/products'),
    require('./routers/shopping_cart'),
    require('./routers/users'),
    express.static(path.join(__dirname, 'public')) //Serve static files from public folder
);

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