const functions = require("firebase-functions");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ArtistModel = require("./models/artistModel");

// Load environment variables for local development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Determine if it's development or production
const mongoString = process.env.NODE_ENV === 'production'
    ? functions.config().database.url  // Firebase environment for production       
    : process.env.DATABASE_URL;  // .env file for local development 


console.log(mongoString);
mongoose.connect(mongoString);
const database = mongoose.connection;


const { authenticateToken } = require('./middleware/authMiddleware'); // Adjust the path as needed


database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

// Create an Express app
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY'); // Optional: prevent clickjacking
  res.setHeader('X-XSS-Protection', '1; mode=block'); // Optional: enable XSS protection
  next();
});

const artistsRoute = require('./routes/artist');
app.use('/api/artists', artistsRoute);

const reviewsRoute = require('./routes/review');
app.use('/api/reviews', reviewsRoute);

const performancesRoute = require('./routes/performance');
app.use('/api/performances', performancesRoute);

const purchasesRoute = require('./routes/purchase');
app.use('/api/purchases', purchasesRoute);

app.post('/signup', async (req, res) => {
    const { name, email, password, genre, image, youtubeLink } = req.body;

    try {
      // Check if artist already exists
      let artist = await ArtistModel.findOne({ email });
      if (artist) {
        return res.status(400).json({ msg: 'Artist already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new artist with hashing the password
      artist = new ArtistModel({ 
        name, 
        email, 
        password: hashedPassword,
        genre, 
        image, 
        youtubeLink 
      });
  
      // Save artist to the database
      await artist.save();
  
      res.status(200).json({ message: 'Artist created successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
});

// Route to login an artist
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      let artist = await ArtistModel.findOne({ email });
      if (!artist) {
          return res.status(400).json({ msg: 'Incorrect password or email ❌❌❌' });
      }

      const isMatch = await bcrypt.compare(password, artist.password);
      if (!isMatch) {
          return res.status(400).json({ msg: 'Incorrect password or email ❌❌❌' });
      }

      // Generate JWT token with artist.id
      const accessToken = jwt.sign({ id: artist._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ message: 'Login successful', accessToken });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

// Route to get artist information
app.get('/artist', authenticateToken, async (req, res) => {
  try {
    // Send the artistId in the response
    res.json({ artistId: req.artistId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Export the backend as Firebase function
exports.api = functions.https.onRequest(app);

// Local server (for development)
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Local server running on http://localhost:${port}`);
  });
}