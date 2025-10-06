const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true,
        trim:true
    },
    isCorrect:{
        type:Boolean,
        default:false
    }
});

const questionSchema = new mongoose.Schema({
    quizId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Quiz',
        required:true
    },
    text:{
        type:String,
        maxlength:300,
        required:true,
        trim:true
    },
    options:[optionSchema]
},
{
    timestamps:true
});

module.exports = mongoose.model('Question', questionSchema)