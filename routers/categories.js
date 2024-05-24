const express = require('express');
const router = express.Router();

router.get('/categories/add', (req, res) => {
    res.render('add_category');
});

module.exports = router;