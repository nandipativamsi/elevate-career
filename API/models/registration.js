const express = require('express');
const router = express.Router();
const User = require('../models/users'); 


router.post('/register', async (req, res) => {
    const { name, email, password, role, education, connections, skills, workExperience, interests, linkedInURL, gitHubURL, socialMediaURL, status } = req.body;

  
    const emailExist = await User.findOne({ email });
    if (emailExist) return res.status(400).send('Email already exists');

    
    const user = new User({
        name,
        email,
        password,
        role,
        education,
        connections,
        skills,
        workExperience,
        interests,
        linkedInURL,
        gitHubURL,
        socialMediaURL,
        status
    });

    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
