import React, { useState } from 'react';

const CreateCourses = () => {
  const [courses, setCourses] = useState([]);
  const [step, setStep] = useState(1);
  const [newCourse, setNewCourse] = useState({
    name: '',
    difficulty: 'Beginner',
    subtopics: '',
    progress: 0,
  });
  const [showModal, setShowModal] = useState(false);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleCreateCourse = () => {
    const courseToAdd = {
      ...newCourse,
      progress: Math.floor(Math.random() * 100),
    };
    setCourses([...courses, courseToAdd]);
    setNewCourse({ name: '', difficulty: 'Beginner', subtopics: '', progress: 0 });
    setStep(1);
    setShowModal(false);
  };

  return (
    <div className="container mx-auto p-4">
        <div className='flex justify-between items-center'>
      <h1 className="text-3xl font-bold mb-4">Create Courses</h1>

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
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
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
                <label className="block mb-2 font-semibold">Difficulty Level:</label>
                <select
                  value={newCourse.difficulty}
                  onChange={(e) => setNewCourse({ ...newCourse, difficulty: e.target.value })}
                  className="border p-2 rounded w-full"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
                <div className="flex gap-2 mt-4">
                  <button onClick={handleBack} className="bg-gray-300 px-4 py-2 rounded">Back</button>
                  <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Next</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mb-4">
                <label className="block mb-2 font-semibold">Subtopics (comma separated):</label>
                <input
                  type="text"
                  value={newCourse.subtopics}
                  onChange={(e) => setNewCourse({ ...newCourse, subtopics: e.target.value })}
                  className="border p-2 rounded w-full"
                />
                <div className="flex gap-2 mt-4">
                  <button onClick={handleBack} className="bg-gray-300 px-4 py-2 rounded">Back</button>
                  <button onClick={handleCreateCourse} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Create Course</button>
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

      <div className="grid grid-cols-1 gap-4 mt-8">
        {courses.map((course, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2">{course.name}</h2>
            <div className="text-gray-600">Progress: {course.progress}%</div>
            <div className="text-gray-600">Difficulty: {course.difficulty}</div>
            <div className="text-gray-600 mt-2">
              <strong>Subtopics:</strong>
              <ul className="list-disc ml-5 mt-1">
                {course.subtopics.split(',').map((topic, idx) => (
                  <li key={idx}>{topic.trim()}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateCourses;