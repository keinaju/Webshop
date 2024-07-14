const express = require('express');
const router = express.Router();

router.get('/', require('./default/get'));
router.get('/catalog', require('./catalog/get'));
router.get('/categories/add', require('./categories/get'));
router.post('/categories/add', require('./categories/post'));
router.get('/checkout', require('./checkout/get'));
router.post('/checkout', require('./checkout/post'));
router.get('/login', require('./login/get'));
router.post('/login', require('./login/post'));
router.post('/logout', require('./logout/post'));
router.get('/logo', require('./logo/get'));
router.get('/orders', require('./orders/get'));
router.put('/orders/update', require('./orders/put'));
router.get('/products/add', require('./product/add/get'));
router.post('/products/add', require('./product/add/post'));
router.get('/products/modify', require('./product/modify/get'));
router.post('/products/modify', require('./product/modify/post'));
router.get('/product/view', require('./product/view/get'));
router.get('/register', require('./register/get'));
router.post('/register', require('./register/post'));
router.get('/shop_configuration', require('./shop_configuration/get'));
router.post('/shop_configuration', require('./shop_configuration/post'));
router.post('/shoppingcart/add', require('./shopping_cart/post'));

module.exports = router;