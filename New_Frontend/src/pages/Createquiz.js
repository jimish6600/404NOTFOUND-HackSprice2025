import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IoCloseSharp } from "react-icons/io5";
import { FaCopy } from "react-icons/fa";
import queationsdetailscreated from '../components/queationsdetailscreated';

const QuizManager = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [quizName, setQuizName] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [mcqCount, setMcqCount] = useState(10);
  const [navigate, setNavigate] = useState(false); // New state for Navigate option
  const [view , setView] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(false); // New loading state
  // Get the auth token from localStorage
  const authToken = localStorage.getItem('authToken');
  // Fetch quizzes from the backend
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        // authToken = localStorage.getItem('authToken');
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/createtest/getquizs`,
          {
            headers: {
              authorization: authToken, // Add Authorization header
            },
          }
        );
        console.log(response.data.quizzes)
        setQuizzes(response.data.quizzes);
      } catch (error) {
        toast.error('Error fetching quizzes');
      }
    };
    fetchQuizzes();
  }, []);

  // Handle copying quiz code
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Quiz code copied to clipboard');
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  // Handle quiz creation
  const handleCreateQuiz = async (e) => {
    e.preventDefault();

    if (!quizName || !pdfFile || !mcqCount) {
      toast.error('Please fill all fields');
      return;
    }

    const formData = new FormData();
    formData.append('quizName', quizName);
    formData.append('Files', pdfFile);
    formData.append('mcqCount', mcqCount);
    formData.append('navigate', navigate); // Append navigate value

    

    try {
      setLoading(true); // Show loader
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/createtest/uploadfilecreate`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: authToken, // Add Authorization header
          },
        }
        
      );
      
      if (response.data.success) {
        toast.success('Quiz created successfully');
        setQuizzes([...quizzes, response.data.quiz]); // Add newly created quiz to the list
        setShowCreatePanel(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Error creating quiz');
    } finally {
      setLoading(false); // Hide loader
    }
  };


  const handleToggleNavigate = async (quizId, newStatus) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/createtest/updatenavigatestatus/${quizId}`, {
        navigate: newStatus
      }, {
        headers: {
          'authorization': authToken
        }
      });
      
      if (response.data.success) {
        toast.success('Navigate status updated');
        // Update the local quizzes state with new navigate status
        setQuizzes(prevQuizzes =>
          prevQuizzes.map(quiz =>
            quiz.id === quizId ? { ...quiz, navigate: newStatus } : quiz
          )
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Error updating navigate status');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/createtest/deletequiz/${quizId}`, {
        headers: {
          'authorization': authToken
        }
      });
      if (response.data.success) {
        toast.success('Quiz deleted successfully');
        setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz.id !== quizId));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Error deleting quiz');
    }
  };  

  // Handle showing quiz details
  const handleViewQuiz = async (quizId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/createtest/getquizdetails/${quizId}`,{
        headers: {
          'authorization': authToken
        }
      });
      setView(true)
      setSelectedQuiz(response.data.quiz);
    } catch (error) {
      toast.error('Error fetching quiz details');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className='flex justify-between items-center pb-3'>
      <h1 className="text-3xl font-bold mb-4">Quiz Manager</h1>
      {/* Button to show create quiz panel */}
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setShowCreatePanel(!showCreatePanel)}
      >
        {showCreatePanel ? 'Close Create Quiz Panel' : 'Create New Quiz'}
      </button>
      </div>
      {/* Existing Quizzes */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Created Quizzes</h2>
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Quiz Name</th>
            <th className="py-2 px-4 border-b">Quiz Code</th>
            <th className="py-2 px-4 border-b">Navigate Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>

          <tbody>
          {quizzes.map((quiz) => (
            <tr key={quiz.id} className="text-center">
              <td className="py-2 px-4 border-b">{quiz.quizName}</td>
              
              {/* Quiz code with a copy icon */}
              <td className="py-2 px-4 border-b">
                <span >{quiz.quizCode}</span>
                <button
                  className="text-blue-500 hover:text-blue-700 px-2"
                  onClick={() => handleCopyCode(quiz.quizCode)}
                >
                  <FaCopy />
                </button>
              </td>
              
              {/* Navigate status with toggle */}
              <td className="py-2 px-4 border-b">
                {/* Toggle switch */}
                <div className="flex items-center justify-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={quiz.navigate}
                    onChange={() => handleToggleNavigate(quiz.id, !quiz.navigate)}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full shadow-inner"></div>
                  <div
                    className={`absolute w-4 h-4 rounded-full shadow transform transition-transform ${
                      quiz.navigate ? 'inline-block w-4 h-4 bg-green-600 translate-x-5 shadow-[0_0_10px_#16a34a] rounded-full' : 'inline-block w-4 h-4 bg-red-600 translate-x-1  shadow-[0_0_10px_#dc2626] rounded-full'
                    }`}
                    style={{ transition: 'transform 0.3s ease' }}
                  ></div>
                </label>

                </div>
              </td>

              
              {/* Action buttons: View and Delete */}
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-semibold py-1 px-4 rounded mr-2"
                  onClick={() => handleViewQuiz(quiz.id)} 
                >
                  View Quiz
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-semibold py-1 px-4 rounded"
                  onClick={() => handleDeleteQuiz(quiz.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          </tbody>
        </table>
      </div>

      

      {/* Create Quiz Panel */}
      {showCreatePanel && (
        <div className='fixed w-full h-full bg-slate-200 top-0 lef-0 right-0 bottom-0 flex justify-center items-center bg-opacity-40'>
        <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
          <div className='flex justify-between items-center pb-3'>
          <h2 className="text-xl font-semibold mb-4">Create New Quiz</h2>
            <div className='w-fit border text-2xl hover:bg-red-600 cursor-pointer' onClick={() => setShowCreatePanel(!showCreatePanel)}>
              <IoCloseSharp/>
            </div>
          </div>
          
          <form onSubmit={handleCreateQuiz} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Quiz Name:</label>
              <input
                type="text"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Upload PDF:</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Number of MCQs:</label>
              <input
                type="number"
                value={mcqCount}
                onChange={(e) => setMcqCount(e.target.value)}
                min="1"
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Navigate (Can change answers after attempt):</label>
              <input
                type="checkbox"
                checked={navigate}
                onChange={(e) => setNavigate(e.target.checked)}
                className="w-4 h-4"
              />
            </div>

            {/* Loader */}
            {loading ? (
              <div className="text-center">
                <div className="loader"></div> {/* Add a CSS loader */}
                <p>Creating quiz...</p>
              </div>
            ) : (
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Create Quiz
              </button>
            )}
          </form>
        </div>
        </div>
      )}

      {/* Quiz Details Panel */}
      {view && (
        queationsdetailscreated(selectedQuiz,setView)
      )}
    </div>
  );
};

export default QuizManager;
