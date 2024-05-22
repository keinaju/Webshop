const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/:filename', respond);

async function respond(req, res, next) {
    try {
        const filename = req.params.filename;
        res.sendFile(filename, { root: path.join(__dirname, '../images') });
    }
    catch (err) {
        console.error('Error in image download.', err.message);
        next(err);
    }
}

module.exports = router;