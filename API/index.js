require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const port = 3000;

const URI = process.env.MONGODB_URI;

// MongoDB connection
mongoose.connect(URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello, World!!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
