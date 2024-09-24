// var http = require('http'); // Import Node.js core module

// var server = http.createServer(function (req, res) {   //create web server
//     if (req.url == '/') { //check the URL of the current request
        
//         // set response header
//         res.writeHead(200, { 'Content-Type': 'text/html' }); 
        
//         // set response content    
//         res.write('<html><body><p>This is home Page.</p></body></html>');
//         res.end();
    
//     }
//     else if (req.url == "/student") {
        
//         res.writeHead(200, { 'Content-Type': 'text/html' });
//         res.write('<html><body><p>This is student Page.</p></body></html>');
//         res.end();
    
//     }
//     else if (req.url == "/admin") {
        
//         res.writeHead(200, { 'Content-Type': 'text/html' });
//         res.write('<html><body><p>This is admin Page.</p></body></html>');
//         res.end();
    
//     }
//     else
//         res.end('Invalid Request!');

// });

// server.listen(5432); //6 - listen for any incoming requests

// console.log('Node.js web server at port 5432 is running..')
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Initialize the app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from the React frontend
}));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/cart', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Import cart routes
import cartRoutes from './cartRoutes.js';

// Use cart routes
app.use('/api/cart', cartRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Set the server port
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

