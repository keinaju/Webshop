const express = require('express');
const router = express.Router();
const pass = require('../services/pass');
const get_orders_by_status = require('../services/get_orders_by_status');
const set_order_status = require('../services/set_order_status');
const body_parser = require('body-parser');
const get_orders_count_by_status = require('../services/get_orders_count_by_status');

router.get('/orders', pass('merchant', 'admin'), async (req, res, next) => {
    try {
        const page = req.query.page || 0;
        const status = req.query.status || 'new';
        const [orders, orders_count] = await Promise.all([
            get_orders_by_status(status, 20, page * 20),
            get_orders_count_by_status(status),
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

router.put('/orders/update', pass('merchant', 'admin'), body_parser.json(), async (req, res, next) => {

    try {
        if (!req.body.order_id || !req.body.new_status) throw new Error('Request doesn\'t have required data.');
        await set_order_status(req.body.order_id, req.body.new_status);
        return res.json({ message: `Order ID ${req.body.order_id} was updated to ${req.body.new_status}.` });
    }
    catch (error) {
        console.log('Error in order status update.', error.message);
        next(error);
    }
});

module.exports = router;