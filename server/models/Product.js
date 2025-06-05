// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   name: String,
//   description: String,
//   imageUrl: String,
//   visiblePrice: Number,
//   sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
// });

// module.exports = mongoose.model('Product', productSchema);



// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: String,
//   imageUrl: String,
//   visiblePrice: { type: Number, required: true },
//   sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
// });


// module.exports = mongoose.model('Product', productSchema);


const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  imageUrl: String,
  visiblePrice: { type: Number, required: true },
  hiddenPrice: { type: Number, required: true }, // <-- Add this line
  category: { type: String, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Product', productSchema);
