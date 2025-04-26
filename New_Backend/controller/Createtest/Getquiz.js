const Createquiz = require("../../models/Storequiz");

const getquizs = async(req,res) => {
    try {
        // Fetch quizzes based on userId from req.userId
        const quizzes = await Createquiz.find({ userId: req.userId });
    
        if (!quizzes.length) {
          return res.status(404).json({ message: 'No quizzes found for this user' });
        }
        const quizzesdata = quizzes.map(quiz => ({
            id : quiz._id,
            quizCode: quiz.quizCode,
            quizName: quiz.quizName,
            navigate: quiz.navigate,
        }));

        // Return quizCode, quizName, navigate, and all other values
        res.status(200).json({
          success: true,
          quizzes: quizzesdata
        });
      } catch (error) {
        res.status(500).json({ message: 'Error fetching quizzes', error });
      }
}

module.exports  = getquizs;