import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { AlertCircle } from 'lucide-react';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the location the user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return setError('Please fill in all fields');
    }
    
    const result = await login(formData);
    
    if (result.success) {
      // Navigate to the page they were trying to access
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 text-error-800 dark:text-error-200 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
          placeholder="you@example.com"
          required
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="form-input"
          placeholder="••••••••"
          required
        />
      </div>
      <div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">test1@a.com/test@a.com</p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">123456</p>
      </div>
      <div>
        <button
          type="submit"
          className="w-full btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
    </form>
  );
}

export default LoginForm;