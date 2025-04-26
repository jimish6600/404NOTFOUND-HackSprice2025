const UserQuiz = require("../../models/Sharetest");

const fetchUserQuizzes = async (req, res) => {
  try {
    const userId = req.userId; // Assuming the userId is available in the request object

    // Fetch all quizzes for the user
    const userQuizzes = await UserQuiz.find({ userId });

    // Map the data to the desired format
    const quizzes = userQuizzes.map(quiz => ({
      quizName: quiz.quizName, // Assuming quizName is the same as quizCode
      quizCode: quiz.quizCode,
      totalMarks: quiz.questions.length, // Total marks based on the number of questions
      navigate: quiz.navigate
    }));

    res.status(200).json({
      success: true,
      quizzes
    });
  } catch (error) {
    console.error("Error fetching user quizzes:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching user quizzes",
      error: error.message
    });
  }
};

module.exports = fetchUserQuizzes;
