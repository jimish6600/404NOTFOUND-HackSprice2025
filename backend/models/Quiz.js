const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  }
});

const quizSchema = new mongoose.Schema({
  subtopic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subtopic',
    required: true
  },
  questions: [questionSchema],
  difficultyLevel: {
    type: String,
    enum: ['basic', 'intermediate', 'advanced'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quiz', quizSchema); 