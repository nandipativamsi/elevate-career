const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Feedback = new Schema({
    title:{
        type:String,
        required:true
    },
    userID:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
});

const feedbackSchema = mongoose.model('Feedback',Feedback);
module.exports = feedbackSchema;