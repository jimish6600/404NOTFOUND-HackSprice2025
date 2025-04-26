import { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { toast } from 'react-toastify';
import axios from 'axios';

const Quizfeedback = ( {setAttemptedQuizzes , id}) => {
    const [selectedQuiz,setSelectedQuiz] = useState(
        {
            questions : [],
            feedback : ""
        }
    )
    useEffect(()=>{
        const fetchQuizDetails = async () => {
            const authToken = localStorage.getItem('authToken'); // Retrieve the auth token from local storage
          
            try {
              const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/testdetails/getquizdetailsbyid/${id}`, {
                headers: {
                  authorization: authToken, // Set the token in the Authorization header
                },
              });
          
              // Handle the response data
              const quizzes = response.data;
              console.log(quizzes)
              setSelectedQuiz(quizzes)
            } catch (error) {
              // Handle errors
              toast.error('Failed to retrieve quiz details.');
            }
        };
        fetchQuizDetails();
    },[])

    return (
        <div className='fixed w-full h-full bg-slate-500 top-0 lef-0 right-0 bottom-0 flex justify-center items-center bg-opacity-40'>
        <div className='bg-white p-4 pb-12 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
        <div className="m-6 mb-3 p-10 bg-gray-50 border border-gray-200 rounded-lg shadow-md overflow-y-scroll h-full scrollbar-hide">
            <div className='flex justify-between items-center pb-3 '>
            <h2 className="text-xl font-semibold mb-4">Quiz Details</h2>
            <div className='w-fit border text-2xl hover:bg-red-600 cursor-pointer' onClick={() => setAttemptedQuizzes(false)}>
              <IoCloseSharp/>
            </div>
            </div>
            {selectedQuiz.questions.map((question, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{`Q${index + 1}: ${question.question}`}</h3>
                <ul className="list-disc pl-5 space-y-1">
                {question.options.map((option, idx) => {
                    const isUserAnswer = question.userAnswer === option;
                    const isCorrectAnswer = question.correctAnswer === option;
                    const isSelectedIncorrectly = isUserAnswer && !isCorrectAnswer;
                    const isSelectedcorrectly = isUserAnswer && isCorrectAnswer;

                    return (
                    <li
                        key={idx}
                        className={`text-gray-700 ${isSelectedcorrectly ? 'text-green-600 font-bold bg-green-200' : ''} ${isSelectedIncorrectly ? 'bg-red-200 text-red-600' : ''}`}
                    >
                        {option}
                    </li>
                    );
                })}
                </ul>
                <p className="text-sm text-amber-600 mt-2 font-medium">
                {`Correct Answer: ${question.correctAnswer}`}
                </p>
            </div>
            ))}

            <div className="mb-8 p-4 border border-gray-300 rounded-lg bg-white shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Feedback</h2>
            <p className="text-gray-800">{selectedQuiz.feedback}</p>
            </div>


        </div>
        </div>
        </div>
    )
}

export default Quizfeedback;
