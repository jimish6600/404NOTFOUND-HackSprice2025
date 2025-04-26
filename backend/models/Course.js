const mongoose = require('mongoose');const courseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true,
  },
  difficultyLevel: {
    type: String,
    enum: ['basic', 'intermediate', 'advanced'],
    required: true,
  },
  subtopics: [
    {
      subtopic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subtopic',
      },
      content: String,
      quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
      },
      quizAttempted: {
        type: Boolean,
        default: false,
      },
      quizScore: Number,
      lastAccessed: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Course', courseSchema);
