import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Create Express App
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/adminPanel', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
});

const users = mongoose.model('users', userSchema);

// Default users
const defaultUsers = [
  { name: 'John Doe', email: 'john@example.com', phone: '1234567890', password: 'password123', confirmPassword: 'password123' },
  { name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', password: 'password456', confirmPassword: 'password456' }
];

// Insert default users if none exist
const addDefaultUsers = async () => {
  try {
    const user = await users.find();
    if (user.length === 0) {
      await users.insertMany(defaultUsers);
      // console.log('Default users added');
    }
  } catch (err) {
    console.error('Error adding default users:', err);
  }
};


// API Routes

// Fetch all users
app.get('/api/allusers', async (req, res) => {
  try {
    const result = await users.find();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Fetch a single user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await users.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Add a new user with email and phone number validation
app.post('/api/users', async (req, res) => {
  try {
    const { email, phone, password, ...userData } = req.body;

  

    // Check if email already exists
    const existingEmail = await users.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Check if phone number already exists
    const existingPhone = await users.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: 'Phone number already exists' });
    }

    // Proceed to create a new user and only save the necessary fields
    const newUser = new users({
      ...userData,
      email, // Include only essential fields
      phone,
      password // Store the password (ideally hashed, but plain-text for simplicity)
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', userId: newUser._id });
  } catch (error) {
    res.status(400).json({ message: 'Error adding user', error: error.message });
  }
});

// Update user by ID
app.put('/api/users/:id', async (req, res) => {
    try {
      const { name, password } = req.body;
      const updatedUser = await users.findByIdAndUpdate(req.params.id, { name, password }, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      res.status(400).json({ message: 'Error updating user', error: error.message });
    }
  });

// Delete user by ID
app.delete('/api/users/:id', async (req, res) => {
  try {
    const deletedUser = await users.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting user', error: error.message });
  }
});
// Login API route
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists by email
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not registered' });
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Success: return user data or a success message
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});
// Listen on Port
app.listen(5000, () => {
  console.log('Server running on port 5000');
  addDefaultUsers();
});