const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Resource = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    likes: {
        type: Date,
        default: Date.now 
    },
    dislikes: {
        type: Date,
        default: Date.now 
    },
    comments:
    { 
        userID: {
            type:String,
            required:true,
        },
        comment: {
            type:String,
            required:true,
        },
    }
});

const resourceSchema = mongoose.model('Resource',Resource);
module.exports = resourceSchema;