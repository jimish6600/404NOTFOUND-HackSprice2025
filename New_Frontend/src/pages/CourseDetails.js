import React, { useState, useEffect } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { useParams, useNavigate } from 'react-router-dom';

const CourseDetails = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [course, setCourse] = useState(null);
  const { courseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const mockCourse = {
      id: courseId,
      title: "React Development Course",
      category: "Web Development",
      difficulty: "Intermediate",
      topics: [
        { id: 1, name: "Introduction to React" },
        { id: 2, name: "Components and Props" },
        { id: 3, name: "State and Lifecycle" },
        { id: 4, name: "Hooks and Context" },
        { id: 5, name: "Routing and Navigation" }
      ]
    };
    setCourse(mockCourse);
  }, [courseId]);

  const handleNext = () => {
    if (course && activeStep < course.topics.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  const mockContent = {
    'Introduction to React': {
      title: 'Introduction to React',
      content: 'React is a JavaScript library for building user interfaces. Learn the fundamentals of React and how to create reusable components.',
      duration: '30 minutes',
      completed: true,
    },
    'Components and Props': {
      title: 'Components and Props',
      content: 'Components are the building blocks of React applications. Learn how to create and use components, and how to pass data using props.',
      duration: '45 minutes',
      completed: true,
    },
    'State and Lifecycle': {
      title: 'State and Lifecycle',
      content: 'Learn how to manage state in React components and understand the component lifecycle methods.',
      duration: '60 minutes',
      completed: false,
    },
    'Hooks and Context': {
      title: 'Hooks and Context',
      content: 'Modern React development using Hooks and Context API for state management.',
      duration: '50 minutes',
      completed: false,
    },
    'Routing and Navigation': {
      title: 'Routing and Navigation',
      content: 'Implement client-side routing in your React applications using React Router.',
      duration: '40 minutes',
      completed: false,
    },
  };

  if (!course) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-white px-4 md:px-10 py-10">
      {/* Close Button */}
      <button onClick={handleClose} className="fixed top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full z-10">
        <XMarkIcon className="w-6 h-6 text-gray-700" />
      </button>

      {/* Course Header */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900">{course.title}</h1>
        <p className="text-sm text-gray-500 mt-3">{course.category} • {course.difficulty}</p>
      </div>

      {/* Stepper */}
      <div className="max-w-4xl mx-auto flex justify-center gap-8 overflow-x-auto mb-12">
        {course.topics.map((topic, index) => (
          <div key={topic.id} className="flex flex-col items-center relative">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold
              ${index === activeStep ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}
              ${mockContent[topic.name]?.completed ? 'bg-green-500 text-white' : ''}
            `}>
              {mockContent[topic.name]?.completed ? (
                <CheckCircleIcon className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>
            <p className="text-xs text-center mt-2 w-24">{topic.name}</p>
            {index < course.topics.length - 1 && (
              <div className="absolute top-4 right-[-40px] w-20 h-0.5 bg-gray-200"></div>
            )}
          </div>
        ))}
      </div>

      {/* Blog Content */}
      <div className="max-w-3xl mx-auto prose prose-blue prose-lg mb-16">
        <h2>{course.topics[activeStep]?.name}</h2>
        <p>{mockContent[course.topics[activeStep]?.name]?.content}</p>
        <p className="text-sm text-gray-400 mt-4">
          Duration: {mockContent[course.topics[activeStep]?.name]?.duration}
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="max-w-3xl mx-auto flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={activeStep === 0}
          className={`flex items-center gap-2 text-blue-600 font-semibold 
            ${activeStep === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:underline'}`}
        >
          <ChevronLeftIcon className="w-5 h-5" />
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={activeStep === course.topics.length - 1}
          className={`flex items-center gap-2 text-blue-600 font-semibold 
            ${activeStep === course.topics.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:underline'}`}
        >
          Next
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;
