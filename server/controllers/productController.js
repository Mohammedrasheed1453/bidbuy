const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
  try {
    console.log(req.body)
    const { name, description, imageUrl, visiblePrice,hiddenPrice,category } = req.body;
    const sellerId = req.user._id; // Securely get sellerId

    // Optionally check role
    if (req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Only sellers can add products' });
    }

    const product = new Product({
      name,
      description,
      imageUrl,
      visiblePrice,
      hiddenPrice,
      category,
      sellerId
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Error adding product', error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    // Optionally populate seller details
    const products = await Product.find()
      .select('-__v')
      .populate('sellerId', 'name email companyname');
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
};
exports.searchProducts = async (req, res) => {
  const { search } = req.query;
  if (!search) return res.json([]);
  
  // Escape special regex characters and use word boundaries
  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b${escapedSearch}\\b`, 'i');

  try {
    const products = await Product.find({
      $or: [
        { name: regex },
        { description: regex },
       { category: regex }
      ]
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.productsByCategory = async (req, res) => {
  const { category, limit } = req.query;
  if (!category) return res.json([]); // Return empty if no category

  try {
    const products = await Product.find({
      category: { $regex: new RegExp('^' + category + '$', 'i') } // exact, case-insensitive
    })
    .limit(Number(limit) || 4);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.bargainProduct = async (req, res) => {
  try {
    const { productId, bid } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const hiddenPrice = product.hiddenPrice;
    // const costPrice = product.costPrice; // If you want to use it

    if (bid >= hiddenPrice) {
      // Seller always profits here!
      return res.json({
        status: 'success',
        message: 'Congratulations! Your bid is accepted. Proceed to checkout at your bid price.'
      });
    } else if (bid >= hiddenPrice * 0.9) {
      // Optional: Encourage to bid just a bit higher if close (within 10%)
      return res.json({
        status: 'close',
        message: 'Very close! Try a little higher and you might win the deal!'
      });
    } else {
      // Not profitable, nudge customer up
      return res.json({
        status: 'low',
        message: 'Too low! Try a higher offer to bargain successfully.'
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error processing bid', error: err.message });
  }
};

// controllers/productController.js
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('-hiddenPrice');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err.message });
  }
};

//get all products for logged-ini-seller
exports.getSellerProducts = async (req, res) => {
  try {
  
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User info missing' });
    }

    const sellerId = req.user._id;
   

    const products = await Product.find({ sellerId });


    res.json(products);
  } catch (err) {
    console.error('Error fetching seller products:', err);
    res.status(500).json({ message: 'Error fetching seller products', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const sellerId = req.user._id; // Ensure only the owner can delete

    const product = await Product.findOneAndDelete({ _id: productId, sellerId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found or not authorized' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
};

exports.updateProduct=async (req,res)=>{
  try{
    const productId=req.params.id;
    const sellerId=req.user._id; // Get sellerId from authenticated user
    const product=await Product.findOne({_id:productId,sellerId});
    if(!product) return res.status(404).json({ message: 'Product not found or you are not authorized to update it' });
    const { name, description, imageUrl, visiblePrice, hiddenPrice } = req.body;
    console.log(req)
    if(name!== undefined) product.name = name;
    if(description!== undefined) product.description = description;
    if(imageUrl!== undefined) product.imageUrl = imageUrl;
    if(visiblePrice!== undefined) product.visiblePrice = visiblePrice;
    if(hiddenPrice!== undefined) product.hiddenPrice = hiddenPrice; 
    await product.save();
    res.json({message: 'Product updated successfully', product });
  }
  catch(err){
    res.status(500).json({ message: 'Error updating product', error: err.message });
  }
};


