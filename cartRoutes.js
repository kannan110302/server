import express from 'express';
const router = express.Router();
import Cart from './Cart.js';

// Add to cart
router.post('/add', async (req, res) => {
  console.log('Received add to cart request:', req.body);  // Log incoming request
  const { productId, name, price, quantity } = req.body;
  
  try {
    const cartItem = new Cart({
      productId,
      name,
      price,
      quantity,
    });
    await cartItem.save();
    console.log('Item added to cart:', cartItem);  // Log the added item
    res.status(201).json(cartItem);
  } catch (error) {
    console.error('Error adding item to cart:', error);  // Log the error details
    res.status(500).json({ message: 'Failed to add to cart' });
  }
});

// Fetch cart items
router.get('/', async (req, res) => {
  try {
    const cartItems = await Cart.find();
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);  // Log the error details
    res.status(500).json({ message: 'Error fetching cart' });
  }
});

export default router;
