// src/components/Navbar.jsximport React, { useContext } from 'react';import { Link } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { StoreContext } from '../context/authentication';
import { useContext } from 'react';

const Navbar = () => {
  const { userName, currectLogin, setCurrectLogin, setUserName } =
    useContext(StoreContext);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUserName('');
    setCurrectLogin(false);
  };
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-4xl font-bold ">QuizGenius</div>
        <div className="flex space-x-4 text-lg">
          <Link
            to={'/accessquiz'}
            href="/accessquiz"
            className="text-white hover:text-gray-300"
          >
            Access Quiz
          </Link>
          <Link
            to={'/createquiz'}
            href="/upload-product"
            className="text-white hover:text-gray-300 "
          >
            Quiz Manager
          </Link>
          <Link
            to={'/attemptedquizzes'}
            href="/list-of-products"
            className="text-white hover:text-gray-300"
          >
            Attempted Quizzes
          </Link>
          <Link
            to={'/createcourses'}
            href="/createcourses"
            className="text-white hover:text-gray-300"
          >
            My Courses
          </Link>
        </div>
        <div>
          {currectLogin ? (
            <div className="flex">
              <p className="bg-blue-200 text-white mr-6 px-4 py-2 rounded hover:bg-blue-200">
                {userName}
              </p>
              <button
                href="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => handleLogout()}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to={'/auth'}
              href="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
