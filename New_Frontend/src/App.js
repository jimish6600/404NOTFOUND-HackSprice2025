import { createBrowserRouter, RouterProvider } from 'react-router-dom';import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Auth from './pages/Auth';
import Layout from './pages/Layout';
import QuizManager from './pages/Createquiz';
import AccessQuiz from './pages/AccessQuiz';
import AttemptedQuizzes from './pages/AttemptedQuizzes';
import CreateCourses from './pages/CreateCourses';
import CourseDetails from './pages/CourseDetails';
import './App.css';
import Quizruning from './pages/Quizruning';
import MyBot from './pages/MyBot';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/auth',
          element: <Auth />,
        },
        {
          path: '/createquiz',
          element: <QuizManager />,
        },
        {
          path: '/accessquiz',
          element: <AccessQuiz />,
        },
        {
          path: '/attemptedquizzes',
          element: <AttemptedQuizzes />,
        },
        {
          path: '/createcourses',
          element: <CreateCourses />,
        },
        {
          path:'course/:courseId',
          element:<CourseDetails/>
        },
        {
          path:'/mybot',
          element:<MyBot/>
        },
        {
          path:'/',
        }
      ],
    },
    {
      path: 'quizruning/:quizCode',
      element: <Quizruning />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
