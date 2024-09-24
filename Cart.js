import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  productId: String,
  quantity: { type: Number, default: 1 },
  price: Number,
  name: String,
});

export default mongoose.model('Cart', cartSchema);
