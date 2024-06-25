require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Job = require('./models/Jobs');

const app = express();

const port = 3000;

const URI = process.env.MONGODB_URI;

// MongoDB connection
mongoose.connect(URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(bodyParser.json());
app.use(cors());

// API route to insert form data
app.post('/postJob', async (req, res) => {
    try {
      const { jobType, title, description, company, location, experience, salary, workType } = req.body;
      
      const jobData = {
           jobType, title, description, company, location, experience, salary, workType,
          postedBy: 'Smeet',
      };

      console.log("Message"+jobData);
      
        await Job.create(jobData);
        res.status(201).send(Job);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

app.get('/', (req, res) => {
  res.send('Hello, World!!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
