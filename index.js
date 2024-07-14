require('dotenv').config();
const express = require('express');
const app = express();
const helmet = require('helmet');
const createError = require('http-errors');

//View engine settings
app.set('views', './views');
app.set('view engine', 'pug');

app.use(helmet({ contentSecurityPolicy: false }));

app.use(require('./session'));

app.use(require('./routes/exports'));

//Serve static files from public folder
app.use('/public', express.static(process.env.PUBLIC_DIRECTORY_PATH));

//Create 404 error, if none of the previous routes responded
app.use((request, response, next) => {
    next(createError(404));
});

app.use(require('./error_handler'));

const port = process.env.PORT ?? 8080;
app.listen(port, () => {
    console.log(`Listening at port ${port}.`);
});