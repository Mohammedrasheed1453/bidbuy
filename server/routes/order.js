const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { placeOrder, getOrders } = require('../controllers/orderController');

router.post('/place', auth, placeOrder); // POST /api/orders/place
router.get('/', auth, getOrders);        // GET /api/orders

module.exports = router;
