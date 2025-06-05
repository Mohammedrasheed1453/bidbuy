const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts,bargainProduct,getProductById,getSellerProducts,updateProduct,searchProducts, productsByCategory, deleteProduct } = require('../controllers/productController');
const auth = require('../middleware/auth');


// Protect the add product route
router.post('/add', auth, addProduct);

// Public route for getting all products
router.get('/all', getAllProducts);
router.post('/bargain', bargainProduct);
router.get('/seller',auth,getSellerProducts);
router.get('/search',searchProducts);
router.get('/category',productsByCategory);
router.get('/:id', getProductById);
router.put('/:id',auth,updateProduct);
router.delete('/:id',auth,deleteProduct);
module.exports = router;
