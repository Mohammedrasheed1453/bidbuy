const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');

router.post('/add', auth, addToCart);        // POST /api/cart/add
router.get('/', auth, getCart);              // GET /api/cart
router.post('/remove', auth, removeFromCart); // POST /api/cart/remove

module.exports = router;
