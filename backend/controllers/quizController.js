const Quiz = require('../models/Quiz');
const UserProgress = require('../models/UserProgress');
const Subtopic = require('../models/Subtopic');
const geminiService = require('../services/geminiService');

const quizController = {
  // Get or Generate quiz for a subtopic
  getOrGenerateQuiz: async (req, res) => {
    try {
      const { subtopicId } = req.params;

      // First, check if a quiz already exists for this subtopic
      const existingQuiz = await Quiz.findOne({ subtopic: subtopicId });
      if (existingQuiz) {
        return res.json({
          quiz: existingQuiz,
          source: 'database'
        });
      }

      // If no quiz exists, get the subtopic details
      const subtopic = await Subtopic.findById(subtopicId);
      if (!subtopic) {
        return res.status(404).json({ message: 'Subtopic not found' });
      }

      // Generate new quiz using Gemini
      const questions = await geminiService.generateQuizQuestions(
        subtopic.name,
        subtopic.difficultyLevel
      );

      // Create and save the new quiz
      const newQuiz = new Quiz({
        subtopic: subtopicId,
        questions,
        difficultyLevel: subtopic.difficultyLevel
      });

      await newQuiz.save();

      res.json({
        quiz: newQuiz,
        source: 'gemini'
      });
    } catch (error) {
      res.status(500).json({ message: 'Error getting/generating quiz', error: error.message });
    }
  },

  // Submit quiz answers
  submitQuiz: async (req, res) => {
    try {
      const { quizId } = req.params;
      const { userId, answers } = req.body;

      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }

      // Calculate score and check answers
      const results = quiz.questions.map((question, index) => {
        const isCorrect = question.correctAnswerIndex === answers[index];
        return {
          questionId: question._id,
          selectedAnswerIndex: answers[index],
          isCorrect,
          correctAnswerIndex: question.correctAnswerIndex
        };
      });

      const score = results.filter(r => r.isCorrect).length;

      // Update user progress
      let userProgress = await UserProgress.findOne({
        user: userId,
        subtopic: quiz.subtopic
      });

      if (!userProgress) {
        userProgress = new UserProgress({
          user: userId,
          subtopic: quiz.subtopic
        });
      }

      userProgress.quizAttempts.push({
        quiz: quizId,
        answers: results,
        score
      });

      // Generate suggested next subtopics based on performance
      if (score < 3) {
        const subtopic = await Subtopic.findById(quiz.subtopic);
        const suggestedSubtopics = await geminiService.generateSuggestedSubtopics(
          subtopic.name,
          score
        );

        // Find and update suggested subtopics
        const suggestedSubtopicsIds = await Promise.all(
          suggestedSubtopics.map(async (name) => {
            const st = await Subtopic.findOne({ name });
            return st ? st._id : null;
          })
        );

        userProgress.suggestedNextSubtopics = suggestedSubtopicsIds.filter(id => id !== null);
      }

      await userProgress.save();

      res.json({
        score,
        results,
        suggestedNextSubtopics: userProgress.suggestedNextSubtopics
      });
    } catch (error) {
      res.status(500).json({ message: 'Error submitting quiz', error: error.message });
    }
  },

  // Get user's quiz history
  getQuizHistory: async (req, res) => {
    try {
      const { userId } = req.params;
      const userProgress = await UserProgress.find({ user: userId })
        .populate('subtopic')
        .populate('quizAttempts.quiz');

      res.json(userProgress);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching quiz history', error: error.message });
    }
  }
};

module.exports = quizController; 