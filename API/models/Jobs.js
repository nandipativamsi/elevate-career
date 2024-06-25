const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    jobType: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    postedBy: {
        type: String,
        required: true,
    },
    applications: {
        type: Number, 
        required: true,
        default: 0
    },
    experience: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    workType: {
        type: String,
        required: true
    },
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
