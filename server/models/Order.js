const mongoose=require('mongoose');
const orderSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    items:[
        {
            product:{type:mongoose.Schema.Types.ObjectId,ref:'Product',required:true},
            quantity:Number,
            bargainedPrice:Number}],
            address:String,
            paymentMode:String,
            createdAt:{type:Date,default:Date.now}
        });

module.exports=mongoose.model('Order',orderSchema);
