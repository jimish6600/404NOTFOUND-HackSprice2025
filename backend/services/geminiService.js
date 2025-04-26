const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

class GeminiService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        this.config = {
            temperature: 0.9,
            topK: 40,
            topP: 0.8,
            maxOutputTokens: 2048
        };
    }

    /**
     * Generate content based on a prompt
     * @param {string} prompt - The prompt to generate content for
     * @param {Object} options - Additional options for generation
     * @returns {Promise<string>} - The generated content
     */
    async generateContent(prompt, options = {}) {
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error in Gemini API call:', error);
            throw new Error(`Gemini API Error: ${error.message}`);
        }
    }

    /**
     * Generate subtopics for a topic
     * @param {string} topicName - Name of the topic
     * @param {string} difficultyLevel - Difficulty level (beginner, intermediate, advanced)
     * @param {number} count - Number of subtopics to generate
     * @returns {Promise<string[]>} - Array of subtopic names
     */
    async generateSubtopics(topicName, difficultyLevel, count = 10) {
        const prompt = `Generate ${count} subtopics for ${topicName} at ${difficultyLevel} level. 
        Return only the subtopic names in a comma-separated list.`;
        
        const content = await this.generateContent(prompt);
        return content.split(',').map(topic => topic.trim());
    }

    /**
     * Generate detailed content for a subtopic
     * @param {string} subtopicName - Name of the subtopic
     * @param {string} difficultyLevel - Difficulty level
     * @returns {Promise<string>} - Detailed content for the subtopic
     */
    async generateSubtopicContent(subtopicName, difficultyLevel) {
        const prompt = `Generate detailed content for the subtopic "${subtopicName}" at ${difficultyLevel} level. 
        Include explanations, examples, and best practices.`;
        
        return await this.generateContent(prompt);
    }

    /**
     * Generate quiz questions for a subtopic
     * @param {string} subtopicName - Name of the subtopic
     * @param {string} difficultyLevel - Difficulty level
     * @param {number} count - Number of questions to generate
     * @returns {Promise<Object[]>} - Array of quiz questions
     */
    async generateQuizQuestions(subtopicName, difficultyLevel, count = 5) {
        const prompt = `Generate ${count} multiple choice questions about "${subtopicName}" at ${difficultyLevel} level. 
        For each question, provide 4 options and mark the correct answer. 
        Format the response as JSON with an array of questions, each containing:
        - question: string
        - options: array of 4 strings
        - correctAnswer: string (one of the options)`;

        const content = await this.generateContent(prompt);
        return JSON.parse(content);
    }

    /**
     * Generate suggested next subtopics based on performance
     * @param {string} subtopicName - Name of the current subtopic
     * @param {number} score - User's score
     * @param {number} maxScore - Maximum possible score
     * @returns {Promise<string[]>} - Array of suggested subtopic names
     */
    async generateSuggestedSubtopics(subtopicName, score, maxScore = 5) {
        const prompt = `Based on the user's performance in ${subtopicName} (score: ${score}/${maxScore}), 
        suggest 3 related subtopics they should study next. Return only the subtopic names in a comma-separated list.`;

        const content = await this.generateContent(prompt);
        return content.split(',').map(topic => topic.trim());
    }
}

module.exports = new GeminiService(); 