import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

// Create Express App
const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // Serve static files from uploads folder

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/adminPanel', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
  profileImage: { type: String }, // New field for profile image
});

const User = mongoose.model('User', userSchema);

// Default users
const defaultUsers = [
  { name: 'John Doe', email: 'john@example.com', phone: '1234567890', password: 'password123', confirmPassword: 'password123', registrationDate: new Date() },
  { name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', password: 'password456', confirmPassword: 'password456', registrationDate: new Date() },
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

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb('Error: Images Only!');
  },
});

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

// Fetch a specific user
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Add a new user
app.post('/api/users', upload.single('profileImage'), async (req, res) => {
  try {
    const newUser = new User({
      ...req.body,
      profileImage: req.file ? req.file.path : null, // Save the image path to the database, if it exists
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error adding user:', error); // Log the error
    res.status(400).json({ message: 'Error adding user', error: error.message });
  }
});

// Update user
app.put('/api/users/:id', upload.single('profileImage'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update user data
    user.name = req.body.name;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.registrationDate = req.body.registrationDate;

    // If a new profile image is uploaded, update the path
    if (req.file) {
      user.profileImage = req.file.path;
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error); // Log the error
    res.status(400).json({ message: 'Error updating user', error: error.message });
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// Start server and add default users
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await addDefaultUsers(); // Call function to add default users
});