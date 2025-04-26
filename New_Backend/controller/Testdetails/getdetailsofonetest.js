const TestDetails = require("../../models/Testdetails");

// Function to get quiz details (questions and feedback) by _id and userId
const getQuizDetailsById = async (req, res) => {
  try {
    // Step 1: Extract _id from request params
    const { id } = req.params;

    // Step 2: Extract userId from the request (assuming authentication middleware provides it)
    const userId = req.userId;

    // Step 3: Find the quiz by _id and userId
    const quiz = await TestDetails.findOne({ _id: id, userId });

    // Step 4: Check if the quiz exists and belongs to the correct user
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found for this user." });
    }

    // Step 5: Return the quiz questions and feedback
    res.status(200).json({
      questions: quiz.questions,
      feedback: quiz.feedback,
    });
  } catch (error) {
    // Handle errors (e.g., invalid _id, database issues)
    res.status(500).json({ error: "Failed to retrieve quiz details." });
  }
};

module.exports = { getQuizDetailsById };
