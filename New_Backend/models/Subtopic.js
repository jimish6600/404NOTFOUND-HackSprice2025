const mongoose = require('mongoose');

const subtopicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Createquiz'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Subtopic', subtopicSchema); 