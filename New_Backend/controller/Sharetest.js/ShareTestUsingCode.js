const UserQuiz = require("../../models/Sharetest");
const Createquiz = require("../../models/Storequiz");

const Sharecode = async (req, res) => {
  try {
    // Extract quizCode and userId from request
    const { quizCode } = req.params;
    const userId = req.userId; // Assuming the userId is available in the request object

    // Fetch the quiz from the Createquiz model
    console.log(quizCode)
    const quiz = await Createquiz.findOne({ quizCode });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Check if the user has already taken this quiz
    const existingUserQuiz = await UserQuiz.findOne({ quizCode, userId });

    if (existingUserQuiz) {
      return res
        .status(400)
        .json({ message: "User has already taken this quiz" });
    }

    // If no existing entry, create a new UserQuiz entry
    const userQuiz = new UserQuiz({
      quizCode: quiz.quizCode,
      quizName: quiz.quizName,
      quizCreatorId: quiz.userId, // Creator of the quiz
      userId, // User who is taking the quiz
      questions: quiz.questions.map((question) => ({
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        userAnswer: "", // Initially empty
      })),
      navigate: quiz.navigate,
    });

    await userQuiz.save();

    res.status(200).json({
      message: "Quiz successfully shared with the user",
      success: true,
    });
  } catch (error) {
    console.error("Error sharing quiz:", error.message);
    res.status(500).json({
      message: "Error sharing quiz",
      error: error.message,
    });
  }
};

module.exports = Sharecode;
