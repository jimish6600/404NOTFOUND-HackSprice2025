const Createquiz = require("../../models/Storequiz");


const updateNavigateStatus = async (req, res) => {
  try {
    const { _id } = req.params; // Get the quiz _id from request parameters
    const { navigate } = req.body; // Get the new navigate status from request body
    
    // Find the quiz by _id
    const quiz = await Createquiz.findById(_id);

    // Check if the quiz exists
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if the userId of the quiz matches req.userId
    if (quiz.userId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to update this quiz' });
    }

    // Update the navigate status
    quiz.navigate = navigate;
    await quiz.save();

    // Respond with the updated quiz
    res.status(200).json({ success: true, quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating quiz navigate status', error });
  }
};

module.exports = updateNavigateStatus;
