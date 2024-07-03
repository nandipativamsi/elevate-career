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
    role: { 
        type: String, 
        enum: ['Student', 'Alumni', 'Admin'], 
        required: true 
    },
    connections:{
        type:String,
        require:true
    },
    skills:{
        type:String,
        require:true
    },
    education: { 
        type: String,
        enum: ['Graduation', 'Masters', 'Diploma', 'Degree'], 
        required: true 
    },
    yearOfGraduation:{
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
    status: { 
        type: String, 
        enum: ['Active', 'Inactive', 'Blocked', 'Deleted'], 
        default: 'Active' 
    },
});

//Encoding the password before saving to database...
User.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const userSchema = mongoose.model('User',User);
module.exports = userSchema;