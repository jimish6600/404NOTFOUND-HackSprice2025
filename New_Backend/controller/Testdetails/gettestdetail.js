const TestDetails = require("../../models/Testdetails");
const User = require("../../models/User");

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

const getTopScores = async (req, res) => {
    try {
      const { quizCode } = req.params;
      const userId = req.userId;
  
      // Get all test details sorted by score
      const allTestDetails = await TestDetails.find({ quizCode }).sort({ score: -1 }).lean();
  
      // Now pick only top attempts with unique users
      const seenUsers = new Set();
      const uniqueTopDetails = [];
  
      for (const detail of allTestDetails) {
        if (!seenUsers.has(detail.userId)) {
          seenUsers.add(detail.userId);
          uniqueTopDetails.push(detail);
        }
      }
  
      // Find current user's attempt
      const currentUserIndex = uniqueTopDetails.findIndex(detail => detail.userId === userId);
  
      let result;
      if (currentUserIndex < 5 && currentUserIndex !== -1) {
        // If user is in top 5
        result = uniqueTopDetails.slice(0, 5);
      } else {
        // User not in top 5
        result = uniqueTopDetails.slice(0, 5);
        if (currentUserIndex !== -1) { // If user attempted the quiz
          result.push(uniqueTopDetails[currentUserIndex]);
        }
      }
  
      // Get user IDs
      const userIds = result.map(detail => detail.userId);
  
      // Fetch users
      const users = await User.find({ _id: { $in: userIds } }).lean();
  
      // Map user IDs to usernames
      const userMap = users.reduce((acc, user) => {
        acc[user._id.toString()] = user.username;
        return acc;
      }, {});
  
      // Format final response
      const formattedResult = result.map(detail => ({
        username: userMap[detail.userId] || 'Unknown User',
        score: detail.score,
        isCurrentUser: detail.userId === userId,
        quizDetails: {
          quizName: detail.quizName,
          quizCode: detail.quizCode,
        }
      }));
  
      res.status(200).json({
        success: true,
        data: formattedResult
      });
  
    } catch (error) {
      console.error('Error fetching top scores:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching top scores',
        error: error.message
      });
    }
  };
  

module.exports = {
    getTestDetails,
    getTopScores
};