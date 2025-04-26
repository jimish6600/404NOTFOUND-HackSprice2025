const mongoose = require('mongoose');

// Define schema for UserQuiz
const UserQuizSchema = new mongoose.Schema({
  quizCode: { type: String, required: true },  
  quizName:  { type: String, required: true },  
  quizCreatorId: { type: String, required: true }, 
  userId: { type: String, required: true }, 
  questions: [{
    question: String,
    options: [String],
    correctAnswer: String,
    userAnswer: String 
  }],
  navigate: { type: Boolean, default: true } 
}, {
  timestamps: true, 
  toJSON: { virtuals: true, versionKey: false }, 
  toObject: { virtuals: true, versionKey: false }
});

const UserQuiz = mongoose.model('UserQuiz', UserQuizSchema);

module.exports = UserQuiz;
