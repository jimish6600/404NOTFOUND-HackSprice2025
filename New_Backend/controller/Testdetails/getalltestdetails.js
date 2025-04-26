const TestDetails = require("../../models/Testdetails");

// Function to get all unique quiz codes and quiz names for a specific user
const getUserQuizCodes = async (req, res) => {
  try {
    // Retrieve userId from the request (assuming authentication middleware provides it)
    const userId = req.userId;

    // Query to find all quizzes associated with this userId and select quizName and quizCode
    const quizzes = await TestDetails.find({ userId })
      .select('quizName quizCode -_id') // Select quizName and quizCode only
      .lean(); // Convert Mongoose docs to plain JS objects for easier manipulation

    // Remove duplicate quizCode entries if necessary
    const uniqueQuizzes = [...new Map(quizzes.map(quiz => [quiz.quizCode, quiz])).values()];

    // Send the unique quizzes (quizName and quizCode) as the response
    res.status(200).json({ quizzes: uniqueQuizzes ,success:true});
  } catch (error) {
    // Handle errors (e.g., database issues)
    res.status(500).json({ error: 'Failed to retrieve quizzes for the user.', success: false});
  }
};

module.exports = { getUserQuizCodes };
