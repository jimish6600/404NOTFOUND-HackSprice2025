const mongoose = require("mongoose");

// Check if the model is already compiled, otherwise define it
const RunQuizSchema = new mongoose.Schema(
  {
    quizCode: { type: String, required: true },
    quizName:  { type: String, required: true },
    quizCreatorId: { type: String, required: true },
    userId: { type: String, required: true },
    questions: [
      {
        question: String,
        options: [String],
        correctAnswer: String,
        userAnswer: { type: String, default: "NaN" },
      },
    ],
    navigate: { type: Boolean, default: true },
    score: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

// If model already exists, don't redefine it
const RunQuiz =
  mongoose.models.RunQuiz || mongoose.model("RunQuiz", RunQuizSchema);

module.exports = RunQuiz;
