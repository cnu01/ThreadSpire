import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const location = useLocation();
  
  // Check if we have a redirect location from a protected route
  const from = location.state?.from?.pathname;
  const redirectMessage = from 
    ? `Sign in to access ${from === '/create' ? 'thread creation' : 'this page'}`
    : null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-sm"
      >
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto" />
          <h1 className="mt-4 text-3xl font-serif font-bold text-neutral-900 dark:text-white">
            Welcome to ThreadSpire
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            {redirectMessage || 'Sign in to your account or create a new one'}
          </p>
        </div>
        
        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('login')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'login'
                  ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'register'
                  ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
              }`}
            >
              Create Account
            </button>
          </nav>
        </div>
        
        <div className="mt-8">
          {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </motion.div>
    </div>
  );
}

export default AuthPage;