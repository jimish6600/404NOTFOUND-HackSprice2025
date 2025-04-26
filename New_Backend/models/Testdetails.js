const mongoose = require("mongoose");

// Define the TestDetails Schema
const TestDetailsSchema = new mongoose.Schema(
  {
    quizCode: { type: String, required: true }, // Quiz code
    quizName:  { type: String, required: true },  
    quizCreatorId: { type: String, required: true }, // The ID of the quiz creator
    userId: { type: String, required: true }, // The user who took the quiz
    questions: [
      {
        question: String, // The quiz question
        options: [String], // Options for the question
        correctAnswer: String, // Correct answer to the question
        userAnswer: { type: String, default: "NaN" }, // User's selected answer
      },
    ],
    navigate: { type: Boolean, default: true }, // Navigation setting (e.g., can user navigate between questions?)
    score: { type: Number, default: 0 }, // The user's score for the quiz
    feedback : { type: String, required: true }
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

// Check if the model is already compiled, otherwise define it
const TestDetails =
  mongoose.models.TestDetails || mongoose.model("TestDetails", TestDetailsSchema);

module.exports = TestDetails;
