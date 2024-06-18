const express = require('express');
const router = express.Router();

router.get('/users/add', async (req, res) => {
    res.render('add_user');
});

module.exports = router;