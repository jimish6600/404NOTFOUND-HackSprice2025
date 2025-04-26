const UserProgress = require('../models/UserProgress');
const Subtopic = require('../models/Subtopic');
const Topic = require('../models/Topic');
const Quiz = require('../models/Quiz');

// Create user progress entry when content and quiz are generated
exports.createUserProgress = async (req, res) => {
  try {
    const { userId, subtopicId, quizId } = req.body;

    // Check if user progress already exists
    const existingProgress = await UserProgress.findOne({
      user: userId,
      subtopic: subtopicId,
    });

    if (existingProgress) {
      return res.status(200).json({
        message: 'User progress already exists',
        progress: existingProgress,
      });
    }

    // Create new user progress entry
    const userProgress = new UserProgress({
      user: userId,
      subtopic: subtopicId,
      quizAttempts: [],
      suggestedNextSubtopics: [],
      lastAccessed: new Date(),
    });

    await userProgress.save();

    res.status(201).json({
      message: 'User progress created successfully',
      progress: userProgress,
    });
  } catch (error) {
    console.error('Error creating user progress:', error);
    res
      .status(500)
      .json({ message: 'Error creating user progress', error: error.message });
  }
};

// Get all user progress entries
exports.getAllUserProgress = async (req, res) => {
  try {
    // For testing, use the provided user ID or get from auth token
    const userId = req.query.userId || req.user._id;

    // Get all user progress entries for the user
    const userProgress = await UserProgress.find({ user: userId })
      .populate({
        path: 'subtopic',
        populate: {
          path: 'topic',
          model: 'Topic',
        },
      })
      .populate('suggestedNextSubtopics')
      .populate({
        path: 'quizAttempts.quiz',
        model: 'Quiz',
      });

    if (!userProgress || userProgress.length === 0) {
      return res
        .status(404)
        .json({ message: 'No progress found for this user' });
    }

    res.json(userProgress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res
      .status(500)
      .json({ message: 'Error fetching user progress', error: error.message });
  }
};

// Get details of a specific course (topic)
exports.getCourseDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topicId } = req.params;

    // Get all user progress entries for the specific topic
    const userProgress = await UserProgress.find({
      user: userId,
      'subtopic.topic': topicId,
    })
      .populate({
        path: 'subtopic',
        populate: {
          path: 'topic',
          model: 'Topic',
        },
      })
      .populate('quiz');

    if (!userProgress || userProgress.length === 0) {
      return res
        .status(404)
        .json({ message: 'No progress found for this course' });
    }

    // Structure the response
    const courseDetails = {
      topic: {
        _id: userProgress[0].subtopic.topic._id,
        name: userProgress[0].subtopic.topic.name,
        description: userProgress[0].subtopic.topic.description,
      },
      subtopics: userProgress.map((progress) => ({
        _id: progress.subtopic._id,
        name: progress.subtopic.name,
        content: progress.subtopic.content,
        quiz: progress.quiz
          ? {
              _id: progress.quiz._id,
              questions: progress.quiz.questions.length,
              difficultyLevel: progress.quiz.difficultyLevel,
              attempted: progress.quizAttempts.length > 0,
              score:
                progress.quizAttempts.length > 0
                  ? progress.quizAttempts[progress.quizAttempts.length - 1]
                      .score
                  : null,
            }
          : null,
        lastAccessed: progress.lastAccessed,
        suggestedNextSubtopics: progress.suggestedNextSubtopics,
      })),
    };

    res.json(courseDetails);
  } catch (error) {
    console.error('Error fetching course details:', error);
    res
      .status(500)
      .json({ message: 'Error fetching course details', error: error.message });
  }
};

// Create a new course with selected topic and difficulty
exports.createCourse = async (req, res) => {
  try {
    const { topicId, difficultyLevel } = req.body;
    const userId = req.user._id;

    // Create new course
    const course = new Course({
      user: userId,
      topic: topicId,
      difficultyLevel: difficultyLevel,
      subtopics: [], // Will be populated when subtopics are selected
    });

    await course.save();

    res.status(201).json({
      message: 'Course created successfully',
      course: course,
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res
      .status(500)
      .json({ message: 'Error creating course', error: error.message });
  }
};

// Add subtopics and content to the course
exports.addSubtopics = async (req, res) => {
  try {
    const { courseId, subtopics } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Add subtopics with their content
    course.subtopics = subtopics.map((st) => ({
      subtopic: st.subtopicId,
      content: st.content,
    }));

    await course.save();

    res.json({
      message: 'Subtopics added successfully',
      course: course,
    });
  } catch (error) {
    console.error('Error adding subtopics:', error);
    res
      .status(500)
      .json({ message: 'Error adding subtopics', error: error.message });
  }
};

// Update quiz attempt
exports.updateQuizAttempt = async (req, res) => {
  try {
    const { subtopicId, quizId, answers, score } = req.body;
    const userId = req.user._id;

    const userProgress = await UserProgress.findOne({
      user: userId,
      subtopic: subtopicId,
    });

    if (!userProgress) {
      return res.status(404).json({ message: 'Course progress not found' });
    }

    // Add new quiz attempt
    userProgress.quizAttempts.push({
      quiz: quizId,
      answers: answers,
      score: score,
      completedAt: new Date(),
    });

    // Update last accessed
    userProgress.lastAccessed = new Date();

    await userProgress.save();

    res.json({
      message: 'Quiz attempt updated successfully',
      progress: userProgress,
    });
  } catch (error) {
    console.error('Error updating quiz attempt:', error);
    res
      .status(500)
      .json({ message: 'Error updating quiz attempt', error: error.message });
  }
};
