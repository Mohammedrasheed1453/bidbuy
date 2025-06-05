const Cart=require('../models/Cart');
// exports.addToCart=async (req,res)=>{
//     const userId=req.user._id;
//     const {productId,quantity}=req.body;
//     let cart=await Cart.findOne({user:userId});
//     if(!cart){
//         cart=new Cart({user:userId,items:[]});
//     }
//     const itemIndex=cart.items.findIndex(item=>item.product.equals(productId));
//     if(itemIndex>-1){
//         cart.items[itemIndex].quantity+=quantity ||1;
//     }
//     else{
//         cart.items.push({product:productId,quantity:quantity ||1});
//     }

//     await cart.save();
//     res.json(cart);
// };
exports.addToCart = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity, bargainedPrice } = req.body; // Accept bargainedPrice

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }
  const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity || 1;
    // If a new bargainedPrice is provided, update it
    if (bargainedPrice) cart.items[itemIndex].bargainedPrice = bargainedPrice;
  } else {
    cart.items.push({ product: productId, quantity: quantity || 1, bargainedPrice });
  }

  await cart.save();
  res.json(cart);
};

exports.getCart=async (req,res)=>{
    const userId=req.user._id;
    const cart=await Cart.findOne({user:userId}).populate('items.product');
    res.json(cart || { user: userId, items: [] });
};

exports.removeFromCart = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  let cart = await Cart.findOne({ user: userId });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter(item => !item.product.equals(productId));
  await cart.save();
  res.json(cart);
};
