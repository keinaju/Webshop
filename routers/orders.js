const express = require('express');
const router = express.Router();
const pass = require('../services/pass');
const get_orders_by_status = require('../services/get_orders_by_status');
const set_order_status = require('../services/set_order_status');
const body_parser = require('body-parser');

router.get('/orders', pass('merchant', 'admin'), async (req, res, next) => {
    try {
        const orders = await get_orders_by_status(req.query.status || 'new', 20, 0);
        res.render('orders', {
            user: req.user,
            orders: orders
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