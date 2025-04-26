import React, { useEffect, useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import axios from 'axios';
import { toast } from 'react-toastify';
import convertUTCToIST from '../helper/Date';
import Quizfeedback from './Quizfeedback';

const QuizAttempts = ({ selectedQuiz, setShowAttempts}) => {

    const [attempts, setAttempts] = useState([]);
    const [attemptedQuizzes, setAttemptedQuizzes] = useState(false);
    const [quizid,setQuizId] = useState(null);

    const handleclickset = (value) =>{
        setAttemptedQuizzes(true);
        
        setQuizId(value);
    }
    useEffect(()=>{
        const fetchQuizDetails = async () => {
            const authToken = localStorage.getItem('authToken'); // Retrieve the auth token from local storage
          
            try {
              const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/testdetails/getusertestdetails/${selectedQuiz.quizCode}`, {
                headers: {
                  authorization: authToken, // Set the token in the Authorization header
                },
              });
          
              // Handle the response data
              const quizzes = response.data;
              setAttempts(quizzes)
            } catch (error) {
              // Handle errors
              toast.error('Failed to retrieve quiz details.');
            }
        };
        fetchQuizDetails();
    },[])
  return (
    <div>
    <div className='fixed w-full h-full bg-slate-500 top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-opacity-40'>
      <div className='bg-white p-4 pb-12 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
        <div className="m-6 mb-3 p-10 bg-gray-50 border border-gray-200 rounded-lg shadow-md overflow-y-scroll h-full scrollbar-hide">
          <div className='flex justify-between items-center pb-3'>
            <h2 className="text-xl font-semibold mb-4">Attempt Details</h2>
            <div className='w-fit border text-2xl hover:bg-red-600 cursor-pointer' onClick={() => setShowAttempts(false)}>
              <IoCloseSharp />
            </div>
          </div>
          <div className='mb-4'>
            <div className='flex items-center'>
              <p className="text-xl font-semibold">Quiz Name:</p>
              <p className="text-xl ml-2">{selectedQuiz.quizName}</p>
            </div>
            <div className='flex items-center pb-3'>
              <p className="text-xl font-semibold">Quiz Code:</p>
              <p className="text-xl ml-2">{selectedQuiz.quizCode}</p>
            </div>
          </div>
          <div className='border-t border-gray-300 pt-4'>
            <h3 className='text-lg font-semibold mb-2'>Attempts:</h3>
            {attempts.length > 0 ? (
              attempts.map((attempt, idx) => (
                <div key={idx} className='flex justify-between items-center py-2 border-b border-gray-200'>
                  <div>
                    <p className="text-md font-medium">Date: {convertUTCToIST(attempt.data)} </p>
                    <p className="text-md">Navigate: {attempt.navigate ? 'Allowed' : 'Not Allowed'}</p>
                    <p className="text-md">Score: {attempt.score}/{attempt.totalqueations}</p>
                  </div>
                  <button
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
                    onClick={() => handleclickset(attempt._id)}
                  >
                    View More{attempt.navigate}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No attempts found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
    {
        attemptedQuizzes? (<Quizfeedback setAttemptedQuizzes={setAttemptedQuizzes} id={quizid}/>):(
            <div></div>
        )
    }
    </div>
  );
};

export default QuizAttempts;
