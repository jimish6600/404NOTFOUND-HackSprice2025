const mongoose = require('mongoose');

// Define the schema for Createquiz
const CreatequizSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  quizName: { type: String, required: true }, 
  quizCode: { type: String, 
    required: true }, 
  questions: [{
    question: String,
    options: [String],
    correctAnswer: String
  }],
  navigate: { type: Boolean, default: true } 
}, {
  timestamps: true, // Enable timestamps
  toJSON: { virtuals: true, versionKey: false }, 
  toObject: { virtuals: true, versionKey: false }
});

// Create the model from the schema
const Createquiz = mongoose.model('Createquiz', CreatequizSchema);

module.exports = Createquiz;
