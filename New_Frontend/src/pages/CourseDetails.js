import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import { 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  FileText,
  Award,
  List,
  Activity,
  BookmarkPlus
} from 'lucide-react';
import QuizAttempts from '../components/QuizAttempts';

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [showAttempts, setShowAttempts] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [progressHistory, setProgressHistory] = useState([]);
  const [viewingNotes, setViewingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [savedProgress, setSavedProgress] = useState(0);
  const authToken = localStorage.getItem('authToken');

  // Load data from localStorage on initial render
  useEffect(() => {
    const loadLocalData = () => {
      try {
        // Load notes for this course
        const savedNotes = localStorage.getItem(`course_notes_${courseId}`);
        if (savedNotes) setNotes(savedNotes);
        
        // Load progress history
        const savedHistory = localStorage.getItem(`course_progress_${courseId}`);
        if (savedHistory) setProgressHistory(JSON.parse(savedHistory));
        
        // Load last viewed subtopic
        const lastSubtopicId = localStorage.getItem(`last_subtopic_${courseId}`);
        if (lastSubtopicId) {
          // We'll use this later when we have the course data
          localStorage.setItem('temp_subtopic_id', lastSubtopicId);
        }
        
        // Load saved progress percentage
        const progress = localStorage.getItem(`course_percentage_${courseId}`);
        if (progress) setSavedProgress(parseInt(progress));
      } catch (error) {
        console.error('Error loading local data:', error);
      }
    };
    
    loadLocalData();
  }, [courseId]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
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
          
          // Check if we have a stored subtopic ID
          const tempSubtopicId = localStorage.getItem('temp_subtopic_id');
          
          if (tempSubtopicId && response.data.course.subtopics.length > 0) {
            const foundSubtopic = response.data.course.subtopics.find(
              st => st._id === tempSubtopicId
            );
            
            if (foundSubtopic) {
              setSelectedSubtopic(foundSubtopic);
            } else {
              setSelectedSubtopic(response.data.course.subtopics[0]);
            }
            
            // Clear temporary storage
            localStorage.removeItem('temp_subtopic_id');
          } else if (response.data.course.subtopics.length > 0) {
            setSelectedSubtopic(response.data.course.subtopics[0]);
          }
          
          // Record course visit in history
          updateProgressHistory();
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

  const updateProgressHistory = () => {
    const now = new Date();
    const newHistory = [...progressHistory, {
      date: now.toISOString(),
      action: 'visited'
    }];
    
    setProgressHistory(newHistory);
    localStorage.setItem(`course_progress_${courseId}`, JSON.stringify(newHistory));
  };

  const handleCreateQuiz = () => {
    navigate('/createquiz', { state: { courseId } });
  };

  const handleAttemptQuiz = async () => {
    if (!selectedSubtopic || !selectedSubtopic.quizId) {
      toast.error('This subtopic doesn\'t have a quiz yet.');
      return;
    }
    
    const quizCode = selectedSubtopic.quizId.quizCode;
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/runtest/start/${quizCode}`, 
        {
          headers: {
            authorization: authToken,
          },
        }
      );
      
      if (response.data.success) {
        // Record quiz attempt in history
        const newHistory = [...progressHistory, {
          date: new Date().toISOString(),
          action: 'attempted_quiz',
          quizName: selectedSubtopic.quizId.quizName
        }];
        
        setProgressHistory(newHistory);
        localStorage.setItem(`course_progress_${courseId}`, JSON.stringify(newHistory));
        
        // Update progress percentage
        const newProgress = Math.min(savedProgress + 10, 100);
        setSavedProgress(newProgress);
        localStorage.setItem(`course_percentage_${courseId}`, newProgress.toString());
        
        toast.success(response.data.message);
        navigate(`/quizruning/${response.data.data}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start quiz');
    } finally {
      setLoading(false);
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
      toast.error('This subtopic doesn\'t have a quiz yet.');
    }
  };

  const handleSelectSubtopic = (subtopic) => {
    setSelectedSubtopic(subtopic);
    localStorage.setItem(`last_subtopic_${courseId}`, subtopic._id);
    
    // Update progress percentage when viewing new content
    if (!progressHistory.some(p => p.subtopicId === subtopic._id)) {
      const newProgress = Math.min(savedProgress + 5, 100);
      setSavedProgress(newProgress);
      localStorage.setItem(`course_percentage_${courseId}`, newProgress.toString());
      
      // Record subtopic visit in history
      const newHistory = [...progressHistory, {
        date: new Date().toISOString(),
        action: 'viewed_subtopic',
        subtopicId: subtopic._id,
        subtopicName: subtopic.name
      }];
      
      setProgressHistory(newHistory);
      localStorage.setItem(`course_progress_${courseId}`, JSON.stringify(newHistory));
    }
  };

  const handleSaveNotes = () => {
    localStorage.setItem(`course_notes_${courseId}`, notes);
    toast.success('Notes saved successfully!');
  };

  const handleNextSubtopic = () => {
    if (!course || !selectedSubtopic) return;
    
    const currentIndex = course.subtopics.findIndex(
      st => st._id === selectedSubtopic._id
    );
    
    if (currentIndex < course.subtopics.length - 1) {
      handleSelectSubtopic(course.subtopics[currentIndex + 1]);
    }
  };

  const handlePrevSubtopic = () => {
    if (!course || !selectedSubtopic) return;
    
    const currentIndex = course.subtopics.findIndex(
      st => st._id === selectedSubtopic._id
    );
    
    if (currentIndex > 0) {
      handleSelectSubtopic(course.subtopics[currentIndex - 1]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-red-700 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">
            We couldn't find the course you're looking for. It may have been removed or the URL might be incorrect.
          </p>
          <button
            onClick={() => navigate('/createcourses')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-8">
      {/* Header Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/createcourses')}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Back to courses"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-800 truncate max-w-md">{course.name}</h1>
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center">
            <div className="w-40 bg-gray-200 rounded-full h-2.5 mr-2">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ width: `${savedProgress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">{savedProgress}% complete</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg flex items-center">
                  <List size={18} className="mr-2 text-blue-600" />
                  Subtopics
                </h2>
                <span className="text-sm text-gray-500">{course.subtopics.length} topics</span>
              </div>
              
              <ul className="space-y-1">
                {course.subtopics.map((subtopic, index) => (
                  <li key={subtopic._id}>
                    <button
                      onClick={() => handleSelectSubtopic(subtopic)}
                      className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                        selectedSubtopic && selectedSubtopic._id === subtopic._id 
                          ? 'bg-blue-50 text-blue-700 font-medium' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 text-xs mr-2">
                        {index + 1}
                      </span>
                      <span className="truncate">{subtopic.name}</span>
                      {subtopic.quizId && (
                        <CheckCircle size={16} className="ml-2 text-green-500" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="font-semibold text-lg flex items-center mb-4">
                <BookOpen size={18} className="mr-2 text-blue-600" />
                Course Info
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Award size={16} className="mr-2 text-yellow-500" />
                  <span className="text-sm">Difficulty: {course.difficulty}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Calendar size={16} className="mr-2 text-blue-500" />
                  <span className="text-sm">Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Activity size={16} className="mr-2 text-purple-500" />
                  <span className="text-sm">Last visited: {
                    progressHistory.length > 0 
                      ? new Date(progressHistory[progressHistory.length - 1].date).toLocaleDateString()
                      : 'Today'
                  }</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:w-3/4">
            {viewingNotes ? (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <FileText size={20} className="mr-2 text-blue-600" />
                    My Notes
                  </h2>
                  <button
                    onClick={() => setViewingNotes(false)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Back to Content
                  </button>
                </div>
                
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-64 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add your notes about this course here..."
                />
                
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleSaveNotes}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            ) : (
              <>
                {selectedSubtopic && (
                  <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">{selectedSubtopic.name}</h2>
                        <button
                          onClick={() => setViewingNotes(true)}
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <BookmarkPlus size={16} className="mr-1" />
                          View/Edit Notes
                        </button>
                      </div>
                    
                      <div className="prose max-w-none">
                        <ReactMarkdown>{selectedSubtopic.content}</ReactMarkdown>
                      </div>
                    </div>
                    
                    {selectedSubtopic.quizId && (
                      <div className="bg-blue-50 p-4 border-t border-blue-100 rounded-b-lg">
                        <div className="flex items-center mb-2">
                          <CheckCircle size={16} className="mr-2 text-green-500" />
                          <span className="font-medium">Quiz available: {selectedSubtopic.quizId.quizName}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Test your knowledge on this topic by taking the quiz.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={handleAttemptQuiz}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                          >
                            Take Quiz
                          </button>
                          <button
                            onClick={handleShowFeedback}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                          >
                            View Past Attempts
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Navigation buttons */}
                <div className="flex justify-between">
                  <button
                    onClick={handlePrevSubtopic}
                    disabled={!course.subtopics.length || course.subtopics.indexOf(selectedSubtopic) === 0}
                    className={`flex items-center px-4 py-2 rounded-md ${
                      !course.subtopics.length || course.subtopics.indexOf(selectedSubtopic) === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-blue-600 hover:bg-blue-50 shadow-sm'
                    }`}
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Previous Topic
                  </button>
                  
                  <button
                    onClick={handleNextSubtopic}
                    disabled={!course.subtopics.length || course.subtopics.indexOf(selectedSubtopic) === course.subtopics.length - 1}
                    className={`flex items-center px-4 py-2 rounded-md ${
                      !course.subtopics.length || course.subtopics.indexOf(selectedSubtopic) === course.subtopics.length - 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-blue-600 hover:bg-blue-50 shadow-sm'
                    }`}
                  >
                    Next Topic
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Quiz Attempts Modal */}
      {showAttempts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <QuizAttempts
              selectedQuiz={selectedQuiz}
              setShowAttempts={setShowAttempts}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;