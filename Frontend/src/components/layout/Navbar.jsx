import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Menu, X, BookOpen, PenLine, UserCircle, BarChart2, LogOut, Sun, Moon } from 'lucide-react';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  // Update dark mode classes whenever isDarkMode changes
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    if (isDarkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Initialize dark mode on mount
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    if (isDarkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="font-serif text-xl font-bold text-neutral-900 dark:text-white">
                ThreadSpire
              </span>
            </Link>
          </div>
          
          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              ) : (
                <Moon className="h-5 w-5 text-neutral-600" />
              )}
            </button>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/create"
                  className="btn btn-primary rounded-lg text-sm px-3 py-1.5"
                >
                  New Thread
                </Link>
                
                <div className="relative dropdown-container">
                  <button 
                    onClick={toggleDropdown}
                    className="flex items-center space-x-1 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white focus:outline-none" 
                  >
                    <span>{user?.username || 'Account'}</span>
                    <UserCircle className="h-5 w-5" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg overflow-hidden z-50 border border-neutral-200 dark:border-neutral-700">
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <UserCircle className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                        <Link
                          to="/analytics"
                          className="flex items-center px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <BarChart2 className="h-4 w-4 mr-2" />
                          Analytics
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-small"
              >
                Sign in
              </Link>
            )}
          </div>
          
          <div className="flex sm:hidden items-center">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 mr-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4 text-amber-500 dark:text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-neutral-600" />
              )}
            </button>
            
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden bg-white dark:bg-neutral-900 shadow-lg border-b border-neutral-200 dark:border-neutral-800">
          <div className="pt-2 pb-4 space-y-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/create"
                  className="flex items-center px-4 py-2 text-base font-medium text-primary-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <PenLine className="h-5 w-5 mr-2" />
                  New Thread
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-base font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <UserCircle className="h-5 w-5 mr-2" />
                  Profile
                </Link>
                <Link
                  to="/analytics"
                  className="flex items-center px-4 py-2 text-base font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <BarChart2 className="h-5 w-5 mr-2" />
                  Analytics
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-base font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center px-4 py-2 text-base font-medium text-primary-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;