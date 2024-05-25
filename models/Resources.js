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
        type: String,
        default: Date.now 
    },
    dislikes: {
        type: String,
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