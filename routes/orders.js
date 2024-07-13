const express = require('express');
const router = express.Router();
const database = require('../services/database');
const validations = require('./validations/validations');
const body_parser = require('body-parser');

router.get('/orders', validations.orders.page, async (req, res, next) => {
    try {
        const page = req.query.page || 0;
        const status = req.query.status || 'new';
        const [orders, orders_count] = await Promise.all([
            database.get.orders_by_status(status, 20, page * 20),
            database.get.orders_count_by_status(status),
        ]);
        res.render('orders', {
            user: req.user,
            orders: orders,
            orders_count: orders_count,
            current_status: status,
            current_page: page,
        });
    }
    catch (error) {
        console.log('Error in getting orders.', error.message);
        next(error);
    }
});

router.put('/orders/update', body_parser.json(), validations.orders.update, async (req, res, next) => {
    try {
        await database.update.order_status(req.body.order_id, req.body.new_status);
        return res.json({ message: `Order ID ${req.body.order_id} was updated to ${req.body.new_status}.` });
    }
    catch (error) {
        console.log('Error in order status update.', error.message);
        next(error);
    }
});

module.exports = router;