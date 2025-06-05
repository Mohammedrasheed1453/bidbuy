const Order=require('../models/Order');
const Cart=require('../models/Cart');
exports.placeOrder=async (req,res)=>{
    const userId=req.user._id;
    const {address,paymentMode}=req.body;
    const cart=await Cart.findOne({user:userId});
    if(!cart || cart.items.length===0) return res.status(400).json({message:"Cart is empty"});

    const order=new Order({
        user:userId,
        items:cart.items,
        address,
        paymentMode
    });
    await order.save();
    cart.items=[];
    await cart.save();
    res.json({message:"order placed successfully!"});
};
exports.getOrders=async (req,res)=>{
    const userId=req.user._id;
    const orders=await Order.find({user:userId}).populate('items.product').sort({createdAt:-1});
    res.json(orders);
};