import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import QuizAttempts from '../components/QuizAttempts';

const AttemptedQuizzes = () => {
  const [selectedQuiz, setSelectedQuiz] = useState({
    quizCode: "",
    quizName: ""
  });
  const [showAttempts, setShowAttempts] = useState(false);
  const [attemptedQuizzes, setAttemptedQuizzes] = useState(false);
  const handleNextClick = async (quiz) => {
    setSelectedQuiz({
      quizCode: quiz.quizCode,
      quizName: quiz.quizName
    });
    setShowAttempts(true)
    
  };

  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchQuizCodes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/testdetails/getuserquizcodes`, {
          headers: {
            authorization: authToken,
          },
        });
        if (response.data.success) {
          setAttemptedQuizzes(response.data.quizzes);
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'An error occurred');
      }
    };
    fetchQuizCodes();
  }, [authToken]);

  return (
    <div className="container mx-auto p-6">
      {!showAttempts ? (
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
            Attempted Quizzes
          </h1>
          <div className="w-full flex justify-center">
            <div className="w-full max-w-4xl overflow-x-auto rounded-lg shadow-lg">
              <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-600 text-white text-left">
                    <th className="py-4 px-6 font-semibold text-sm uppercase text-center">Quiz Name</th>
                    <th className="py-4 px-6 font-semibold text-sm uppercase text-center">Quiz Code</th>
                    <th className="py-4 px-6 font-semibold text-sm uppercase text-center">See All Attempts</th>
                  </tr>
                </thead>
                <tbody>
                  {attemptedQuizzes.length > 0 ? (
                    attemptedQuizzes.map((quiz, idx) => (
                      <tr
                        key={idx}
                        className={`${
                          idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        } hover:bg-gray-100 transition-colors duration-300`}
                      >
                        <td className="py-4 px-6 border-b border-gray-200 text-gray-800 text-center">
                          <div className="flex items-center justify-center">
                            <span className="font-medium text-sm">{quiz.quizName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 border-b border-gray-200 text-gray-800 text-center">
                          <span className="text-sm text-gray-600">{quiz.quizCode}</span>
                        </td>
                        <td className="py-4 px-6 border-b border-gray-200 text-center">
                          <button
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
                            onClick={() => handleNextClick(quiz)}
                          >
                            Next
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-10 px-6 text-center text-gray-600">
                        <span className="text-lg font-semibold">No quizzes found.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <QuizAttempts
          selectedQuiz={selectedQuiz}
          setShowAttempts={setShowAttempts}
        />
      )}
    </div>
  );
};

export default AttemptedQuizzes;
