const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const User = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        require:true
    },
    role:{
        type:String,
        require:true
    },
    connections:{
        type:String,
        require:true
    },
    skills:{
        type:String,
        require:true
    },
    education:{
        type:String,
        require:true
    },
    workExperience:{
        type:String,
        require:true
    },
    interests:{
        type:String,
        require:true 
    },
    linkedInURL:{
        type:String,
    },
    gitHubURL:{
        type:String,
    },
    socialMediaURL:{
        type:String,
    },
    status:{
        type:String,
        required:true,
    }
});

//Encoding the password before saving to database...
User.pre('save', function (next) {
    bcrypt.hash(this.password, 10, (error, hash) => {
        this.password = hash;
        next();
    });
});

const userSchema = mongoose.model('User',User);
module.exports = userSchema;