const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Event = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    attendees:{
        type:String,
        required:true
    },
    limit:{
        type:String,
        required:true
    },
});

const eventSchema = mongoose.model('Event',Event);
module.exports = eventSchema;