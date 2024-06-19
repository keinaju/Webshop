const express = require('express');
const router = express.Router();
const multer = require('multer');
const multer_parser = multer();

router.post('/logout', multer_parser.none(), function (req, res, next) {
    req.logout(function (err) {
        if (err) return next(err);
        res.redirect('/');
    });
});

module.exports = router;