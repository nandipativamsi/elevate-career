const express = require('express');
const mongoose = require('mongoose');

const app = express();

const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!!');
});

const URI = "mongodb+srv://SmeetParmar:Capstone07@cluster1.jzxspyw.mongodb.net/";

mongoose.connect(URI);

// if(mongoose.connect(URI))
// {
//   console.log("Connected");
// }

mongoose.connection.once('open', () => {
  console.log('Database connected successfully');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});