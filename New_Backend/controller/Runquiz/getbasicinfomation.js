const RunQuiz = require("../../models/Runquiz");


async function getBasicinfomation(req, res) {
  try {
    const { _id } = req.params; // Assuming _id is provided as a URL parameter
    const userId = req.userId; // Assuming userId is added to the request object from authentication middleware

    // Find the quiz by _id and check if it belongs to the user
    const quiz = await RunQuiz.findOne({ _id, userId });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found or you do not have permission to access it.' });
    }

    // Respond with the number of questions and the navigate status
    res.json({
      numberOfQuestions: quiz.questions.length,
      navigate: quiz.navigate
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getBasicinfomation;
