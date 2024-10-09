
// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';

// // Create Express App
// const app = express();
// app.use(express.json());
// app.use(cors());

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/adminPanel', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.log('Error connecting to MongoDB:', err));

// // User Schema
// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   phone: String,
//   password: String,
//   confirmPassword: String,
//   registrationDate: { type: Date, default: Date.now },
// });

// const User = mongoose.model('User', userSchema);

// // Default users
// const defaultUsers = [
//   { name: 'John Doe', email: 'john@example.com', phone: '1234567890', password: 'password123', confirmPassword: 'password123', registrationDate: new Date() },
//   { name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', password: 'password456', confirmPassword: 'password456', registrationDate: new Date() }
// ];

// // Insert default users if none exist
// const addDefaultUsers = async () => {
//   try {
//     const users = await User.find();
//     if (users.length === 0) {
//       await User.insertMany(defaultUsers);
//       console.log('Default users added');
//     }
//   } catch (err) {
//     console.error('Error adding default users:', err);
//   }
// };

// // API Routes

// // Fetch all users
// app.get('/api/users', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching users', error: error.message });
//   }
// });

// // Fetch a single user by ID
// app.get('/api/users/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching user', error: error.message });
//   }
// });

// // Add a new user
// app.post('/api/users', async (req, res) => {
//   try {
//     const newUser = new User(req.body);
//     await newUser.save();
//     res.status(201).json(newUser); // Return the newly created user
//   } catch (error) {
//     res.status(400).json({ message: 'Error adding user', error: error.message });
//   }
// });

// // Update user by ID
// app.put('/api/users/:id', async (req, res) => {
//   try {
//     const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(updatedUser);
//   } catch (error) {
//     res.status(400).json({ message: 'Error updating user', error: error.message });
//   }
// });

// // Delete user by ID
// app.delete('/api/users/:id', async (req, res) => {
//   try {
//     const deletedUser = await User.findByIdAndDelete(req.params.id);
//     if (!deletedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json({ message: 'User deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ message: 'Error deleting user', error: error.message });
//   }
// });

// // Listen on Port
// app.listen(5000, () => {
//   console.log('Server running on port 5000');
//   addDefaultUsers();
// });


import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import moment from 'moment'; // Add moment for date handling

// Create Express App
const app = express();
app.use(express.json({ limit: '10mb' })); // Increase limit for base64 images
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
  confirmPassword: String,
  registrationDate: { type: Date, default: Date.now },
  image: String // Base64 encoded image string
});

const User = mongoose.model('User', userSchema);

// Default users
const defaultUsers = [
  { name: 'John Doe', email: 'john@example.com', phone: '1234567890', password: 'password123', confirmPassword: 'password123', registrationDate: new Date(),"image": "data:image/jpeg;base64,..." },
  { name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', password: 'password456', confirmPassword: 'password456', registrationDate: new Date(),"image": "data:image/jpeg;base64,..." }
];

// Insert default users if none exist
const addDefaultUsers = async () => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      await User.insertMany(defaultUsers);
      console.log('Default users added');
    }
  } catch (err) {
    console.error('Error adding default users:', err);
  }
};

// API Routes

// Fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Fetch a single user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Add a new user
app.post('/api/users', async (req, res) => {
  try {
    const { registrationDate, image, ...rest } = req.body;

    // Validate if image is not too large or has the correct format
    if (!image || !image.startsWith('data:image/')) {
      return res.status(400).json({ message: 'Invalid image format' });
    }

    const formattedDate = moment.utc(registrationDate, 'YYYY-MM-DD').toDate();
    const newUser = new User({ ...rest, image, registrationDate: formattedDate });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: 'Error adding user', error: error.message });
  }
});

// Update user by ID
app.put('/api/users/:id', async (req, res) => {
  try {
    const { registrationDate, image, ...rest } = req.body;

    // Optional image update: check if image exists and is in the correct format
    if (image && !image.startsWith('data:image/')) {
      return res.status(400).json({ message: 'Invalid image format' });
    }

    const formattedDate = registrationDate ? moment.utc(registrationDate, 'YYYY-MM-DD').toDate() : undefined;
    const updatedUserData = { ...rest, registrationDate: formattedDate, image };

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedUserData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error: error.message });
  }
});

// Delete user by ID
app.delete('/api/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting user', error: error.message });
  }
});

// Listen on Port
app.listen(5000, () => {
  console.log('Server running on port 5000');
  addDefaultUsers();
});