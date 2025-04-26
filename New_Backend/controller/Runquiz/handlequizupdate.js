const RunQuiz = require("../../models/Runquiz");
const TestDetails = require("../../models/Testdetails");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);



const filterQuestionsByAnswer = (questions) => {
  const correctQuestions = [];
  const wrongQuestions = [];
  questions.forEach((question) => {
    if (question.userAnswer === question.correctAnswer) {
      correctQuestions.push(question.question);
    } else {
      wrongQuestions.push(question.question);

    }
  });

  return {
    correctQuestions,
    wrongQuestions,
  };
};


const generateResponse = async (text) => {
  try {
    const { questions, score } = text;
    const totalQuestions = questions.length;
    const { correctQuestions, wrongQuestions } = filterQuestionsByAnswer(questions);
    
    const prompt = `
      in your response add below thing about score
      "You scored ${score} out of ${totalQuestions}. Great job! However, there's room for improvement."

      "You answered ${totalQuestions - score} questions incorrectly. Focus on these areas: [write feedback on these wrong questions all in one paragraph without using max words 400*]. Questions for Reference: ${JSON.stringify(wrongQuestions)} do not use * don't (15 words max) and (400 words max) in your response don't send me list of questions"
    `;

    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const textResponse = await result.response.text();

    // Clean and parse the response
    let cleanedResponse = textResponse.replace(/```json/, "").replace(/```/, "").trim();
    cleanedResponse = cleanedResponse.replace(/\n+/g, ' ').trim();
    
    console.log(cleanedResponse);
    return cleanedResponse;
  } catch (error) {
    console.error("Error generating response:", error.message);
    return "Something is wrong";
  }
};


const handleQuizUpdate = async (req, res) => {
  try {
    const { question, answer, nextQuestionNumber, status } = req.body;
    const userId = req.userId;
    const {_id} = req.params;

    console.log(req.body ,"body")

    // Check if the quiz exists for the user in the RunQuiz model
    const runQuizEntry = await RunQuiz.findById(_id);
    if (!runQuizEntry) {
      return res.status(404).json({
        message: "No active quiz found for this user with the provided quiz code.",
        success : false
      });
    }

    // If 'nextQuestionNumber' is provided, fetch the corresponding question
    let nextQuestion = null;
    if (
      typeof nextQuestionNumber === "number" &&
      nextQuestionNumber <= runQuizEntry.questions.length &&
      nextQuestionNumber > 0
    ) {
      const questionData = runQuizEntry.questions[nextQuestionNumber - 1];
      // Only send the next question if the userAnswer is 'NaN'
      if (questionData.userAnswer === "NaN" || runQuizEntry.navigate === true) {
        nextQuestion = {
          question: questionData.question,
          options: questionData.options,
          userAnswer: questionData.userAnswer,
        };
      }
    }

    // Update the userAnswer and score in RunQuiz
    let score = runQuizEntry.score;
    let updated = false;
    let check = false;

    if (question !== "-1") {
      const questionToUpdate = runQuizEntry.questions.find((q) => q.question === question);
      if (questionToUpdate) {
        if (questionToUpdate.userAnswer !== "NaN" && runQuizEntry.navigate === false) {
          check = true;
        } else {
          // Update the answer and score
          if (questionToUpdate.userAnswer === "NaN") {
            questionToUpdate.userAnswer = answer;
            score += answer === questionToUpdate.correctAnswer ? 1 : 0;
          } else if (runQuizEntry.navigate === true) {
            if (questionToUpdate.userAnswer === questionToUpdate.correctAnswer && answer !== questionToUpdate.correctAnswer) {
              score -= 1; // Deduct score for changing from correct to incorrect
            } else if (
              questionToUpdate.userAnswer !== questionToUpdate.correctAnswer &&
              answer === questionToUpdate.correctAnswer
            ) {
              score += 1; // Increase score for changing from incorrect to correct
            }
            questionToUpdate.userAnswer = answer;
          }

          updated = true;
        }
      }
    }

    // Save the updated quiz entry if it was modified
    if (updated) {
      runQuizEntry.score = score;
      await runQuizEntry.save();
    }

    // Await the response from generateResponse before proceeding
    

    // If the quiz status is 'submitted', move data to TestDetails and delete from RunQuiz
    if (status === "submitted") {
      const feedbackofquiz = await generateResponse(runQuizEntry);
      const testDetails = new TestDetails({
        quizCode: runQuizEntry.quizCode,
        quizName: runQuizEntry.quizName,
        quizCreatorId: runQuizEntry.quizCreatorId,
        userId: runQuizEntry.userId,
        questions: runQuizEntry.questions,
        navigate: runQuizEntry.navigate,
        score: runQuizEntry.score,
        feedback: feedbackofquiz,
      });

      await testDetails.save();
      await RunQuiz.deleteOne({_id});

      return res.status(200).json({
        message: "Quiz submitted and moved to test details.",
        data: feedbackofquiz,
        success : true
      });
    }

    if (check) {
      return res.status(400).json({
        message: "You cannot change the answer",
        data: {
          nextQuestionNumber,
          quizCode: runQuizEntry.quizCode,
          nextQuestion: nextQuestion || "No more questions or question already answered.",
          userAnswer: questionData.userAnswer
        },
        success : true
      });
    }

    // If no other status, just respond with the updated data
    res.status(200).json({
      message: "Quiz updated successfully.",
      data: {
        nextQuestionNumber,
        quizCode: runQuizEntry.quizCode,
        nextQuestion: nextQuestion || "No more questions or question already answered.",
      },
       
      success : true
    });
  } catch (error) {
    console.error("Error handling quiz update:", error.message);
    res.status(500).json({
      message: "Error handling quiz update",
      error: error.message,
      success : false
    });
  }
};


module.exports = handleQuizUpdate;
