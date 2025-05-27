import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, GitFork, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThreadStore } from '../../stores/threadStore';

function RemixModal({ isOpen, onClose, thread }) {
  const [isForking, setIsForking] = useState(false);
  const { forkThread } = useThreadStore();
  const navigate = useNavigate();

  const handleFork = async () => {
    setIsForking(true);
    
    const result = await forkThread(thread._id);
    
    if (result.success) {
      onClose();
      navigate(`/edit/${result.threadId}`, { 
        state: { 
          isRemix: true, 
          originalAuthor: thread.author?.username 
        } 
      });
    }
    
    setIsForking(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full border border-neutral-200 dark:border-neutral-700"
        >
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <GitFork className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              Remix Thread
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-2">
                "{thread.title}"
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                by {thread.author?.username || 'Anonymous'}
              </p>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-2">
                What happens when you remix?
              </h4>
              <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                <li>• Copy this thread as a draft in your account</li>
                <li>• Edit segments and add your own insights</li>
                <li>• Publish with "Inspired by {thread.author?.username}" attribution</li>
                <li>• Original author gets credit and fork count increases</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFork}
                disabled={isForking}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isForking ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Remixing...
                  </>
                ) : (
                  <>
                    <GitFork className="w-4 h-4" />
                    Remix Thread
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default RemixModal;
