import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const AccessQuiz = () => {
  const [quizCode, setQuizCode] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false); // For showing leaderboard modal
  const [leaderboardData, setLeaderboardData] = useState([]); // To store leaderboard data
  const authToken = localStorage.getItem('authToken');
  const navigate = useNavigate();

  const fetchUserQuizzes = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/sharetest/receivedquiz`,
        {
          headers: {
            authorization: authToken,
          },
        }
      );
      if (response.data.success) {
        setQuizzes(response.data.quizzes);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleAddQuiz = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/sharetest/sharecode/${quizCode}`,
        {},
        {
          headers: {
            authorization: authToken,
          },
        }
      );
      setQuizCode('');
      if (response.data.success) {
        toast.success(response.data.message);
        fetchUserQuizzes();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      setQuizCode('');
      toast.error(error.response.data.message);
    }
  };

  const startquiz = async (value) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/runtest/start/${value}`,
        {
          headers: {
            authorization: authToken,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate(`/quizruning/${response.data.data}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const fetchLeaderboard = async (quizCode) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/testdetails/gettopscores/${quizCode}`,
        {
          headers: {
            authorization: authToken,
          },
        }
      );
      if (response.data.success) {
        setLeaderboardData(response.data.data); // Set leaderboard data
        setShowLeaderboardModal(true); // Show the leaderboard modal
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchUserQuizzes();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start bg-blue-200 py-10 h-full">
      <div className="bg-white shadow-md rounded-lg p-6 mb-4 w-full max-w-lg text-center">
        <h2 className="text-3xl font-semibold mb-4">Add Quiz</h2>
        <div className="flex items-center justify-center space-x-4">
          <input
            type="text"
            placeholder="Enter Quiz Code"
            value={quizCode}
            onChange={(e) => setQuizCode(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full max-w-xs"
          />
          <button
            onClick={handleAddQuiz}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Add Quiz
          </button>
        </div>
      </div>

      {/* Quizzes List Section */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
        <h2 className="text-3xl font-semibold mb-4 text-center">Your Quizzes</h2>
        <div className="max-h-80 h-full overflow-scroll scrollbar-hide">
          <table className="table-auto w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-2 text-center">Quiz Name</th>
                <th className="px-4 py-2 text-center">Quiz Code</th>
                <th className="px-4 py-2 text-center">Total Marks</th>
                <th className="px-4 py-2 text-center">Navigation</th>
                <th className="px-4 py-2 text-center">Action</th>
                <th className="px-4 py-2 text-center">Leaderboard</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2 text-center">{quiz.quizName}</td>
                  <td className="px-4 py-2 text-center">{quiz.quizCode}</td>
                  <td className="px-4 py-2 text-center">{quiz.totalMarks}</td>
                  <td className="px-4 py-2 text-center">
                    {quiz.navigate ? (
                      <span className="inline-block w-4 h-4 bg-green-500 rounded-full"></span>
                    ) : (
                      <span className="inline-block w-4 h-4 bg-red-500 rounded-full"></span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                      onClick={() => startquiz(quiz.quizCode)}
                    >
                      Attempt Quiz
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                      onClick={() => fetchLeaderboard(quiz.quizCode)} // Fetch leaderboard
                    >
                      View Leaderboard
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leaderboard Modal */}
      {showLeaderboardModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
            <table className="table-auto w-full text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2">Rank</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{entry.username}</td>
                    <td className="px-4 py-2">{entry.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-red-600"
              onClick={() => setShowLeaderboardModal(false)} // Close modal
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessQuiz;
