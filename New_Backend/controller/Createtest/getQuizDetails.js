const Createquiz = require("../../models/Storequiz");

const getQuizDetails = async (req, res) => {
  try {
    const { _id } = req.params; // Get the quiz _id from request parameters

    // Find the quiz by _id
    const quiz = await Createquiz.findById(_id);

    // Check if the quiz exists
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if the userId of the quiz matches req.userId
    if (quiz.userId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to access this quiz' });
    }

    // Respond with the quiz details
    res.status(200).json({ success: true, quiz });
  } catch (error) {
    console.error('Error fetching quiz details:', error); // Debugging
    res.status(500).json({ message: 'Error fetching quiz details', error });
  }
};

module.exports = getQuizDetails;
