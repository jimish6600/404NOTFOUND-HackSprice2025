import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import QuizAttempts from '../components/QuizAttempts';

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [showAttempts, setShowAttempts] = useState(false); // To control visibility of QuizAttempts
  const [selectedQuiz, setSelectedQuiz] = useState(null); // To store selected quiz info
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/courses/${courseId}`,
          {
            headers: {
              authorization: authToken,
            },
          }
        );
        if (response.data.success) {
          setCourse(response.data.course);
          if (response.data.course.subtopics.length > 0) {
            setSelectedSubtopic(response.data.course.subtopics[0]);
          }
        } else {
          toast.error('Failed to fetch course details');
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
        toast.error('Error fetching course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, authToken]);

  const handleCreateQuiz = () => {
    navigate('/createquiz', { state: { courseId } });
  };

  const handleAttemptQuiz = async () => {
    console.log(selectedSubtopic);
    if (selectedSubtopic && selectedSubtopic.quizId) {
      const quizCode = selectedSubtopic.quizId.quizCode;
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/runtest/start/${quizCode}`, {
          headers: {
            authorization: authToken,
          },
        });
        if (response.data.success) {
          toast.success(response.data.message);
          navigate(`/quizruning/${response.data.data}`);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    } else {
      toast.error('Please select a subtopic with a quiz to attempt.');
    }
  };

  const handleShowFeedback = () => {
    if (selectedSubtopic && selectedSubtopic.quizId) {
      setSelectedQuiz({
        quizName: selectedSubtopic.quizId.quizName,
        quizCode: selectedSubtopic.quizId.quizCode,
      });
      setShowAttempts(true);
    } else {
      toast.error('Please select a subtopic with a quiz to show feedback.');
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!course) {
    return <div className="container mx-auto p-4">Course not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{course.name}</h2>
          <button
            onClick={() => navigate('/createcourses')}
            className="text-gray-500 hover:text-gray-700"
          >
            Back to Courses
          </button>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Course Details:</h3>
          <p className="text-gray-600">Difficulty: {course.difficulty}</p>
          <p className="text-gray-600">Created At: {new Date(course.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Subtopics:</h3>
          <ul className="list-disc pl-5 space-y-2">
            {course.subtopics.map((subtopic) => (
              <li
                key={subtopic._id}
                onClick={() => setSelectedSubtopic(subtopic)}
                className={selectedSubtopic && selectedSubtopic._id === subtopic._id ? 'text-green-500' : ''}
              >
                {subtopic.name}
              </li>
            ))}
          </ul>
        </div>
        {selectedSubtopic && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">{selectedSubtopic.name}</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <ReactMarkdown>{selectedSubtopic.content}</ReactMarkdown>
            </div>
          </div>
        )}
        <div className="flex space-x-4">
          <button
            onClick={handleAttemptQuiz}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Attempt Quiz
          </button>
          <button
            onClick={handleShowFeedback}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Show Feedback
          </button>
        </div>

        {showAttempts && (
          <QuizAttempts
            selectedQuiz={selectedQuiz}
            setShowAttempts={setShowAttempts}
          />
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
