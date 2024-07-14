const express = require('express');
const router = express.Router();

router.get('/', require('./default/get'));
router.get('/catalog', require('./catalog/get'));
router.get('/categories/add', require('./categories/get'));
router.post('/categories/add', require('./categories/post'));
router.get('/login', require('./login/get'));
router.post('/login', require('./login/post'));
router.post('/logout', require('./logout/post'));
router.get('/logo', require('./logo/get'));
router.get('/order', require('./checkout/get'));
router.post('/order', require('./checkout/post'));
router.get('/orders', require('./orders/get'));
router.put('/orders/update', require('./orders/put'));
router.get('/product', require('./product/get'));
router.get('/products/add', require('./product/add/get'));
router.post('/products/add', require('./product/add/post'));
router.get('/products/modify', require('./product/modify/get'));
router.post('/products/modify', require('./product/modify/post'));
router.get('/shop_configuration', require('./shop_configuration/get'));
router.post('/shop_configuration', require('./shop_configuration/post'));
router.post('/shoppingcart/add', require('./shopping_cart/post'));
router.get('/users/add', require('./user/get'));
router.post('/users/add', require('./user/post'));

module.exports = router;