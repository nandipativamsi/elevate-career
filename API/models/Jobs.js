const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Job = new Schema({
    jobType:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    postedBy:{
        type:String,
        required:true
    },
    applications:{
        type:String,
        required:true
    },
    experience:{
        type:String,
        required:true
    },
    salary:{
        type:String,
        required:true
    },
    workType:{
        type:String,
        required:true
    },
});

const jobSchema = mongoose.model('Job',Job);
module.exports = jobSchema;