const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

mongoose.set('strictQuery', true);

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images as static files at /uploads/filename.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/recipes', require('./routes/recipeRoutes'));

app.get('/', (req, res) => res.send('Recipe Share API is running'));

if (require.main === module) {
  connectDB();
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
