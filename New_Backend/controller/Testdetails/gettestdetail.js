const TestDetails = require("../../models/Testdetails");

// Function to get all quiz data for a specific user and quizCode
const getTestDetails = async (req, res) => {
  try {
    // Retrieve userId from the request (assuming authentication middleware provides it)
    const userId = req.userId;

    // Retrieve quizCode from the request parameters
    const { quizCode } = req.params;

    // Query to find all quizzes associated with this userId and quizCode
    const quizzes = await TestDetails.find({ userId, quizCode }).sort({ createdAt: -1 });

    // Check if any quizzes were found
    if (quizzes.length === 0) {
      return res.status(404).json({ error: 'No quizzes found for this user and quiz code.' });
    }

    // Map through the quizzes to include only required fields
    const result = quizzes.map(quiz => ({
      _id: quiz._id,
      navigate: quiz.navigate, // Assuming 'navigate' is a field in your schema
      data: quiz.createdAt, // Assuming 'createdData' is the field you want to return as 'data'
      score : quiz.score,
      totalqueations: quiz.questions.length
    }));

    // Send the quiz data as the response
    res.status(200).json(result);
  } catch (error) {
    // Handle errors (e.g., database issues)
    res.status(500).json({ error: 'Failed to retrieve quiz data for the user.' });
  }
};

module.exports = { getTestDetails };
