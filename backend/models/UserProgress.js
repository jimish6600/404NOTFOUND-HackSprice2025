const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subtopic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subtopic',
    required: true
  },
  quizAttempts: [{
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    },
    answers: [{
      questionId: mongoose.Schema.Types.ObjectId,
      selectedAnswer: String,
      isCorrect: Boolean
    }],
    score: Number,
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  suggestedNextSubtopics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subtopic'
  }],
  lastAccessed: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserProgress', userProgressSchema); 