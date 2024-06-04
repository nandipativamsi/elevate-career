const express = require('express');
const router = express.Router();
const User = require('../models/users'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret'; 

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

   
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Email or password is wrong');

   
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');

   
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.header('auth-token', token).send(token);
});

module.exports = router;
