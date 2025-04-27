import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StoreContext } from '../context/authentication';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { userName, currectLogin, setCurrectLogin, setUserName } = useContext(StoreContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  // Check if the link is active
  const isActive = (path) => {
    return location.pathname === path ? "border-b-2 border-blue-400" : "";
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUserName('');
    setCurrectLogin(false);
    setIsProfileOpen(false);
  };

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`relative text-gray-200 hover:text-white transition-colors duration-200 py-2 ${isActive(to)}`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-white text-2xl font-bold bg-blue-600 px-3 py-1 rounded-lg">
              AI<span className="text-yellow-300">Genius</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 text-base font-medium">
            <NavLink to="/accessquiz">Access Quiz</NavLink>
            <NavLink to="/createquiz">Quiz Manager</NavLink>
            <NavLink to="/attemptedquizzes">Attempted Quizzes</NavLink>
            <NavLink to="/createcourses">My Courses</NavLink>
            <NavLink to="/mybot">My Bot</NavLink>
          </div>

          {/* Auth Section */}
          <div className="hidden md:block">
            {currectLogin ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <User size={18} />
                  <span>{userName}</span>
                  <ChevronDown size={16} className={`transform transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-10">
                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      Profile Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
              >
                Login / Sign Up
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-2 shadow-inner">
          <div className="flex flex-col space-y-3 pb-3">
            <Link to="/accessquiz" className="text-gray-200 hover:text-white py-2 border-b border-gray-700">
              Access Quiz
            </Link>
            <Link to="/createquiz" className="text-gray-200 hover:text-white py-2 border-b border-gray-700">
              Quiz Manager
            </Link>
            <Link to="/attemptedquizzes" className="text-gray-200 hover:text-white py-2 border-b border-gray-700">
              Attempted Quizzes
            </Link>
            <Link to="/createcourses" className="text-gray-200 hover:text-white py-2 border-b border-gray-700">
              My Courses
            </Link>
            <Link to="/mybot" className="text-gray-200 hover:text-white py-2 border-b border-gray-700">
              My Bot
            </Link>
            
            {currectLogin ? (
              <div className="pt-2 flex flex-col space-y-2">
                <div className="bg-gray-700 text-white px-4 py-2 rounded-lg">
                  Signed in as <span className="font-medium">{userName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/auth" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 mt-2 text-center">
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;