require('dotenv').config();
const express = require('express');
const app = express();
const helmet = require('helmet');
const path = require('path');

//View engine settings
app.set('views', './views');
app.set('view engine', 'pug');

// app.use(helmet({ contentSecurityPolicy: false }));
app.use(helmet());

app.use(require('./session'));

app.use(require('./routes/router'));

//Serve static files from /assets and /public 
app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
app.use('/public', express.static(process.env.PUBLIC_DIRECTORY_PATH));

app.use(require('./error_handler'));

const port = process.env.PORT ?? 8080;
app.listen(port, () => {
    console.log(`Listening at port ${port}.`);
});