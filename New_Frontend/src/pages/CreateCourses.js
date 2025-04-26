import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateCourses = () => {
  const [courses, setCourses] = useState([]);
  const [step, setStep] = useState(1);
  const [newCourse, setNewCourse] = useState({
    name: '',
    difficulty: 'Beginner',
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();

  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/courses/`,
          {
            headers: {
              authorization: authToken,
            },
          }
        );
        if (response.data.success) {
          setCourses(response.data.courses);
        } else {
          toast.error('Failed to fetch courses');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Error fetching courses');
      }
    };

    fetchCourses();
  }, [authToken]);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleCreateCourse = async () => {
    try {
      setShowModal(false);
      toast.success('Course created successfully');
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/courses/create`,
        {
          topic: newCourse.name,
          difficulty: newCourse.difficulty.toLowerCase(),
        },
        {
          headers: {
            authorization: authToken,
          },
        }
      );

      if (response.data.success) {
        const courseToAdd = {
          ...newCourse,
          progress: Math.floor(Math.random() * 100),
        };
        setCourses([...courses, courseToAdd]);
        setNewCourse({ name: '', difficulty: 'Beginner' });
        setStep(1);
      }
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleViewCourse = (course) => {
    navigate(`/course/${course._id}`);
  };

  const handleCreateQuiz = () => {
    navigate('/createquiz');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-4">My Courses</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        >
          Create Course
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <h2 className="text-2xl font-bold mb-4">Create New Course</h2>
            {step === 1 && (
              <div className="mb-4">
                <label className="block mb-2 font-semibold">Course Name:</label>
                <input
                  type="text"
                  value={newCourse.name}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, name: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
                <button
                  onClick={handleNext}
                  disabled={!newCourse.name}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
                >
                  Next
                </button>
              </div>
            )}
            {step === 2 && (
              <div className="mb-4">
                <label className="block mb-2 font-semibold">
                  Difficulty Level:
                </label>
                <select
                  value={newCourse.difficulty}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, difficulty: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleBack}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCreateCourse}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Create Course
                  </button>
                </div>
              </div>
            )}
            <button
              onClick={() => {
                setShowModal(false);
                setStep(1);
              }}
              className="absolute top-4 right-6 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {selectedCourse ? (
        <div className="bg-white shadow-md rounded-lg p-6 mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{selectedCourse.name}</h2>
            <button
              onClick={() => setSelectedCourse(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              Back to Courses
            </button>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Course Details:</h3>
            <p className="text-gray-600">
              Difficulty: {selectedCourse.difficulty}
            </p>
            <p className="text-gray-600">
              Progress: {selectedCourse.progress}%
            </p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Subtopics:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Introduction to {selectedCourse.name}</li>
              <li>Basic Concepts</li>
              <li>Advanced Topics</li>
              <li>Practical Applications</li>
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Course Content:</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">Module 1: Introduction</h4>
                <p className="text-gray-600">
                  Learn the fundamentals and basic concepts.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">Module 2: Core Concepts</h4>
                <p className="text-gray-600">
                  Dive deeper into the main topics.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">Module 3: Advanced Topics</h4>
                <p className="text-gray-600">
                  Explore advanced concepts and applications.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleCreateQuiz}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Quiz for this Course
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 mt-8">
          {courses.map((course, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6"
              style={{ width: '300px' }}
            >
              <h2 className="text-xl font-bold mb-2">{course.name}</h2>
              <div className="text-gray-600">Progress: {course.progress}%</div>
              <div className="text-gray-600">
                Difficulty: {course.difficulty}
              </div>
              <button
                onClick={() => handleViewCourse(course)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
              >
                View Course
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreateCourses;
