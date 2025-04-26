const pdf = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Createquiz = require("../../models/Storequiz");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);


function generateQuizCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) {
      code += '-'; // Add dash every 4 characters
    }
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return code;
}

// Function to generate a unique quiz code
async function generateUniqueQuizCode() {
  let uniqueCode = '';
  let isUnique = false;

  // Keep generating until we get a unique code
  while (!isUnique) {
    uniqueCode = generateQuizCode();
    const existingQuiz = await Createquiz.findOne({ quizCode: uniqueCode });
    
    if (!existingQuiz) {
      isUnique = true; // No quiz with this code found, so it's unique
    }
  }

  return uniqueCode;
}


// Function to generate MCQs from extracted text
async function generateMCQs(text, count) {
  try {
    const prompt = `${text} Based on this text, generate ${count} multiple-choice questions. Each question should have 4 options and one correct answer. Format your response in JSON with the following structure:
    {
      "questions": [
        {
          "question": "Question text here",
          "options": [
            "Option A",
            "Option B",
            "Option C",
            "Option D"
          ],
          "correctAnswer": "Correct answer option"
        }
      ]
    }`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const textResponse = await result.response.text();

    // Clean and attempt to parse the response
    let cleanedResponse = textResponse
      .replace(/```json/, "") 
      .replace(/```/, "") 
      .trim();

    try {
      // Try to parse the JSON response
        const mcqData = JSON.parse(cleanedResponse);
        return mcqData; // Return the parsed MCQs
    } catch (jsonError) {
        // Log the error and attempt to extract JSON manually
        console.error("Error parsing JSON:", jsonError.message);

        const jsonStartIndex = cleanedResponse.indexOf("{");
        const jsonEndIndex = cleanedResponse.lastIndexOf("}");

        if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
            const possibleJSON = cleanedResponse.substring(jsonStartIndex, jsonEndIndex + 1);
            const mcqData = JSON.parse(possibleJSON);
            return mcqData;
        } else {
            throw new Error("Invalid JSON structure received.");
        }
    }
    } catch (error) {
        console.error("Error generating MCQs:", error.message);
        throw error;
    }
}

// Upload and process file endpoint
const uploadfilecreatetest = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({ message: "No files uploaded" });
    }

    // Validate MCQ count
    if (req.body.mcqCount >= 50 || req.body.mcqCount <= 0) {
      return res.status(400).send({ message: "You can create a quiz with 1 to 50 questions only" });
    }

    // Access uploaded files (expecting PDFs)
    const uploadedFiles = req.files.Files;
    const filesArray = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];

    // Process PDF files only
    const pdfDataPromises = filesArray
      .filter(file => file.mimetype === "application/pdf")
      .map(async file => {
        const data = await pdf(file.data); // Assuming 'pdf' extracts text from PDF
        return {
          fileName: file.name,
          numPages: data.numpages,
          text: data.text,
        };
      });

    const pdfDataArray = await Promise.all(pdfDataPromises);

    // Combine the extracted text
    const resumeData = pdfDataArray.map(pdfData => pdfData.text).join("\n\n");

    // Generate MCQs based on the resume text
    const mcqs = await generateMCQs(resumeData, req.body.mcqCount);

    // Create a unique quiz code
    const quizCode = await generateUniqueQuizCode();

    // Create and store the quiz in MongoDB
    const quiz = new Createquiz({
      userId: req.userId,  // Assuming you have user auth middleware
      quizCode: quizCode,
      quizName: req.body.quizName,
      questions: mcqs.questions,  // Store the questions
      navigate: req.body.navigate
    });

    await quiz.save();

    res.status(200).send({
      success: true,
      message: "Quiz created successfully",
      quiz: quiz,
    });
  } catch (error) {
    console.error("Error uploading or processing files:", error.message);
    res.status(500).send({
      message: "Error uploading or processing files",
      error: error.message,
    });
  }
};



// Function to update the quiz with a new questions array
const updateQuiz = async (req, res) => {
  try {
    // Get the quiz _id and new questions array from the request
    const { _id } = req.params; // The quiz ID is passed in the URL params
    const { questions } = req.body; // The new questions array is sent in the request body

    if (!_id || !questions) {
      return res.status(400).send({ message: "Quiz ID and questions array are required" });
    }

    // Find the quiz by _id and update the questions array
    const updatedQuiz = await Createquiz.findByIdAndUpdate(
      _id, // The quiz _id
      { $set: { questions } }, // Set the new questions array
      { new: true, runValidators: true } // Return the updated document and validate
    );

    if (!updatedQuiz) {
      return res.status(404).send({ message: "Quiz not found" });
    }

    res.status(200).send({
      message: "Quiz updated successfully",
      data: updatedQuiz,
    });
  } catch (error) {
    console.error("Error updating quiz:", error.message);
    res.status(500).send({
      message: "Error updating quiz",
      error: error.message,
    });
  }
};


const deleteQuiz = async (req, res) => {
    try {
      const { _id } = req.params;
  
      if (!_id) {
        return res.status(400).send({ message: "Quiz ID is required" });
      }
  
      const deletedQuiz = await Createquiz.findByIdAndDelete(_id);
  
      if (!deletedQuiz) {
        return res.status(404).send({ message: "Quiz not found" });
      }
  
      res.status(200).send({
        success : true,
        message: "Quiz deleted successfully",
        data: deletedQuiz,
      });
    } catch (error) {
      console.error("Error deleting quiz:", error.message);
      res.status(500).send({
        success : false,
        message: "Error deleting quiz",
        error: error.message,
      });
    }
};
  
  // Export all functions
module.exports = {
    updateQuiz,
    uploadfilecreatetest,
    deleteQuiz
};