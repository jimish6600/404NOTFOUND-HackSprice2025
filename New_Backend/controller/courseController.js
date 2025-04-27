const Topic = require('../models/Topic');
const Subtopic = require('../models/Subtopic');
const Createquiz = require('../models/Storequiz');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to generate subtopics using Gemini
async function generateSubtopics(topic, difficulty) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        const prompt = `Generate EXACTLY 10 subtopics for the topic "${topic}" at ${difficulty} level. 
        Each subtopic should be specific and focused. Return ONLY a JSON array of exactly 10 strings, nothing else.
        Example format: ["Subtopic 1", "Subtopic 2", "Subtopic 3", "Subtopic 4", "Subtopic 5", 
        "Subtopic 6", "Subtopic 7", "Subtopic 8", "Subtopic 9", "Subtopic 10"]`;
        
        console.log('Generating subtopics with prompt:', prompt);
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('Raw Gemini response:', text);
        
        // Clean the response to ensure it's valid JSON
        const cleanedText = text.trim().replace(/^```json\s*|\s*```$/g, '');
        
        try {
            const subtopics = JSON.parse(cleanedText);
            console.log('Parsed subtopics:', subtopics);
            
            if (!Array.isArray(subtopics)) {
                throw new Error('Generated subtopics is not an array');
            }
            
            if (subtopics.length !== 10) {
                console.error('Expected 10 subtopics, got:', subtopics.length);
                throw new Error(`Expected 10 subtopics, but got ${subtopics.length}`);
            }
            
            return subtopics;
        } catch (parseError) {
            console.error('Error parsing Gemini response:', parseError);
            console.error('Cleaned text that failed to parse:', cleanedText);
            throw new Error('Failed to parse subtopics from Gemini response');
        }
    } catch (error) {
        console.error('Error in generateSubtopics:', error);
        throw error;
    }
}

// Function to generate content for a subtopic
async function generateContent(subtopic, topic, difficulty) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        const prompt = `Generate detailed educational content for the subtopic "${subtopic}" 
        under the main topic "${topic}" at ${difficulty} level. The content should be comprehensive 
        and educational, covering all important aspects of the subtopic.`;
        
        console.log('Generating content for subtopic:', subtopic);
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const content = response.text();
        
        console.log('Generated content length:', content.length);
        return content;
    } catch (error) {
        console.error('Error generating content:', error);
        throw error;
    }
}

// Function to generate quiz for a subtopic
async function generateQuiz(subtopic, topic, difficulty) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        const prompt = `Generate a quiz with 5 multiple choice questions for the subtopic "${subtopic}" 
        under the main topic "${topic}" at ${difficulty} level. Return ONLY a JSON object with this exact structure:
        {
            "questions": [
                {
                    "question": "Question text here",
                    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                    "correctAnswer": "Correct option here"
                }
            ]
        }
        Do not include any markdown formatting or additional text.`;
        
        console.log('Generating quiz for subtopic:', subtopic);
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('Raw quiz response:', text);
        
        // Clean the response to ensure it's valid JSON
        const cleanedText = text.trim()
            .replace(/^```json\s*|\s*```$/g, '') // Remove markdown code blocks
            .replace(/^```\s*|\s*```$/g, '')     // Remove any other code blocks
            .trim();
        
        try {
            const quizData = JSON.parse(cleanedText);
            console.log('Parsed quiz data:', quizData);
            
            if (!quizData.questions || !Array.isArray(quizData.questions)) {
                throw new Error('Invalid quiz data structure');
            }
            
            if (quizData.questions.length !== 5) {
                console.error('Expected 5 questions, got:', quizData.questions.length);
                throw new Error(`Expected 5 questions, but got ${quizData.questions.length}`);
            }
            
            // Validate each question has required fields
            for (const question of quizData.questions) {
                if (!question.question || !Array.isArray(question.options) || !question.correctAnswer) {
                    throw new Error('Invalid question structure');
                }
                if (question.options.length !== 4) {
                    throw new Error('Each question must have exactly 4 options');
                }
            }
            
            return quizData;
        } catch (parseError) {
            console.error('Error parsing quiz response:', parseError);
            console.error('Cleaned text that failed to parse:', cleanedText);
            throw new Error('Failed to parse quiz from Gemini response');
        }
    } catch (error) {
        console.error('Error in generateQuiz:', error);
        throw error;
    }
}

// Main function to create course
exports.createCourse = async (req, res) => {
    try {
        const { topic, difficulty } = req.body;
        const userId = req.userId;
        console.log('Received request:', { topic, difficulty, userId });

        // Check if topic already exists for this user
        let existingTopic = await Topic.findOne({ name: topic, userId });
        console.log('Existing topic:', existingTopic);
        
        // Check if topic exists and has subtopics
        const existingSubtopics = await Subtopic.find({ topic: existingTopic?._id });
        console.log('Existing subtopics count:', existingSubtopics.length);
        
        if (!existingTopic || existingSubtopics.length === 0) {
            // If topic doesn't exist, create it
            if (!existingTopic) {
                console.log('Creating new topic');
                existingTopic = await Topic.create({ 
                    name: topic, 
                    difficulty,
                    userId 
                });
            }
            
            // Generate subtopics
            const subtopics = await generateSubtopics(topic, difficulty);
            console.log('Generated subtopics count:', subtopics.length);
            
            // Create subtopics with content and quizzes
            const createdSubtopics = [];
            let retryCount = 0;
            const maxRetries = 3;

            while (createdSubtopics.length < 10 && retryCount < maxRetries) {
                for (const subtopicName of subtopics) {
                    if (createdSubtopics.length >= 10) break;

                    console.log('Processing subtopic:', subtopicName);
                    
                    try {
                        // Check if subtopic already exists
                        const existingSubtopic = await Subtopic.findOne({
                            name: subtopicName,
                            topic: existingTopic._id
                        });

                        if (existingSubtopic) {
                            console.log('Subtopic already exists:', subtopicName);
                            createdSubtopics.push(existingSubtopic);
                            continue;
                        }

                        // Generate content
                        const content = await generateContent(subtopicName, topic, difficulty);
                        
                        // Create subtopic
                        const subtopic = await Subtopic.create({
                            name: subtopicName,
                            topic: existingTopic._id,
                            content
                        });
                        console.log('Created subtopic:', subtopic._id);
                        
                        // Generate and create quiz
                        const quizData = await generateQuiz(subtopicName, topic, difficulty);
                        const quiz = await Createquiz.create({
                            userId,
                            quizName: `${topic} - ${subtopicName}`,
                            quizCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
                            questions: quizData.questions,
                            navigate: true
                        });
                        console.log('Created quiz:', quiz._id);
                        
                        // Save the created quiz in UserQuiz
                        const userQuiz = new UserQuiz({
                            quizCode: quiz.quizCode,
                            quizName: quiz.quizName,
                            quizCreatorId: quiz.userId,
                            userId,
                            questions: quiz.questions.map((question) => ({
                                question: question.question,
                                options: question.options,
                                correctAnswer: question.correctAnswer,
                                userAnswer: "", // Initially empty
                            })),
                            navigate: quiz.navigate,
                        });
                        await userQuiz.save();
                        console.log('Saved quiz in UserQuiz:', userQuiz._id);

                        // Update subtopic with quiz ID
                        subtopic.quizId = quiz._id;
                        await subtopic.save();
                        
                        createdSubtopics.push(subtopic);
                    } catch (error) {
                        console.error(`Error processing subtopic ${subtopicName}:`, error);
                        // Don't continue, we want to retry this subtopic
                    }
                }

                if (createdSubtopics.length < 10) {
                    retryCount++;
                    console.log(`Retry attempt ${retryCount} of ${maxRetries}`);
                    // Wait a bit before retrying
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            if (createdSubtopics.length < 10) {
                console.error(`Failed to create all 10 subtopics after ${maxRetries} attempts`);
                throw new Error(`Only created ${createdSubtopics.length} out of 10 subtopics`);
            }
        }
        
        // Fetch all subtopics for the topic
        const courseSubtopics = await Subtopic.find({ topic: existingTopic._id })
            .populate('quizId');
        console.log('Final subtopics count:', courseSubtopics.length);
            
        res.status(200).json({
            success: true,
            topic: existingTopic,
            subtopics: courseSubtopics
        });
        
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get all courses for the authenticated user
exports.getAllCourses = async (req, res) => {
    try {
        const userId = req.userId ;
        console.log('User ID:', userId);
        
        const topics = await Topic.find({ userId })
            .sort({ createdAt: -1 }); // Sort by newest first
        
        console.log('Topics:', topics);

        // For each topic, get the count of subtopics
        const courses = await Promise.all(topics.map(async (topic) => {
            const subtopicCount = await Subtopic.countDocuments({ topic: topic._id });
            return {
                _id: topic._id,
                name: topic.name,
                difficulty: topic.difficulty,
                createdAt: topic.createdAt,
                subtopicCount
            };
        }));
        console.log('Courses:', courses);

        res.status(200).json({
            success: true,
            courses
        });
    } catch (error) {
        console.error('Error getting all courses:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get course details for the authenticated user
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.userId;

        // Get the topic for this user
        const topic = await Topic.findOne({ _id: courseId, userId });
        if (!topic) {
            return res.status(404).json({
                success: false,
                error: 'Course not found'
            });
        }

        // Get all subtopics with their quizzes
        const subtopics = await Subtopic.find({ topic: courseId })
            .populate('quizId')
            .sort({ createdAt: 1 }); // Sort by creation date

        res.status(200).json({
            success: true,
            course: {
                _id: topic._id,
                name: topic.name,
                difficulty: topic.difficulty,
                createdAt: topic.createdAt,
                subtopics
            }
        });
    } catch (error) {
        console.error('Error getting course details:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}; 