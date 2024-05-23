const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

//View engine settings
app.set('views', './views');
app.set('view engine', 'pug');

//Middlewares
app.use(
    require('./routers/products'),
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