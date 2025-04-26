import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
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
              <li key={subtopic._id} onClick={() => setSelectedSubtopic(subtopic)}>
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
        <button
          onClick={handleCreateQuiz}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Quiz for this Course
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;
