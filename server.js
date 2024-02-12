const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();
const dotenv = require('dotenv');
dotenv.config({path:'./.env'});

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: false }));

// Set up view engine
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.get('/', async (req, res, next) => {
  try {
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls: shortUrls });
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
});

app.post('/shortUrls', async (req, res, next) => {
  try {
    await ShortUrl.create({ full: req.body.fullUrl });
    res.redirect('/');
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
});

app.get('/:shortUrl', async (req, res, next) => {
  try {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
    if (shortUrl == null) return res.sendStatus(404);

    shortUrl.clicks++;
    await shortUrl.save();

    res.redirect(shortUrl.full);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
