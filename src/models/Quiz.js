const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Quiz', quizSchema)