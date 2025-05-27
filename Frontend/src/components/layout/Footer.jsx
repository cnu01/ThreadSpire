import { Link } from 'react-router-dom';
import { Heart} from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 py-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-2 md:mb-0">
            <Link to="/" className="flex items-center space-x-1">
              <span className="font-serif text-base font-bold text-neutral-900 dark:text-white">
                <span className="text-primary-600 dark:text-primary-400">Thread</span>Spire
              </span>
            </Link>
          </div>
          
          <div className="flex space-x-6 text-xs text-neutral-500 dark:text-neutral-400">
            <Link to="/about" className="hover:text-primary-600 dark:hover:text-primary-400">
              About
            </Link>
            <Link to="/privacy" className="hover:text-primary-600 dark:hover:text-primary-400">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-primary-600 dark:hover:text-primary-400">
              Terms
            </Link>
            <span className="flex items-center">
              Made with <Heart className="h-3 w-3 text-error-500 mx-1" /> © {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;