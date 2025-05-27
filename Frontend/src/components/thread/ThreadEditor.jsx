import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { Plus, Minus, Save, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThreadStore } from '../../stores/threadStore';
import { COMMON_TAGS, MAX_SEGMENT_LENGTH, MAX_TITLE_LENGTH, MAX_SEGMENTS } from '../../utils/constants';

function ThreadEditor({ existingThread = null }) {
  const [title, setTitle] = useState('');
  const [segments, setSegments] = useState([{ content: '', id: Date.now() }]);
  const [tags, setTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const [isDraft, setIsDraft] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { createThread, updateThread } = useThreadStore();
  const navigate = useNavigate();
  
  // Set initial values from existing thread if editing
  useEffect(() => {
    if (existingThread) {
      setTitle(existingThread.title || '');
      setSegments(
        existingThread.segments.map(segment => ({
          content: segment.content,
          id: segment._id || Date.now() + Math.random(),
        }))
      );
      setTags(existingThread.tags || []);
      setIsDraft(existingThread.isDraft || false);
    }
  }, [existingThread]);
  
  // Handle title change
  const handleTitleChange = (e) => {
    if (e.target.value.length <= MAX_TITLE_LENGTH) {
      setTitle(e.target.value);
      setError('');
    }
  };
  
  // Handle segment content change
  const handleSegmentChange = (index, value) => {
    if (value.length <= MAX_SEGMENT_LENGTH) {
      const updatedSegments = [...segments];
      updatedSegments[index].content = value;
      setSegments(updatedSegments);
      setError('');
    }
  };
  
  // Add a new segment
  const addSegment = () => {
    if (segments.length >= MAX_SEGMENTS) {
      setError(`You can only add up to ${MAX_SEGMENTS} segments`);
      return;
    }
    
    setSegments([...segments, { content: '', id: Date.now() }]);
  };
  
  // Remove a segment
  const removeSegment = (index) => {
    if (segments.length <= 1) {
      setError('Thread must have at least one segment');
      return;
    }
    
    const updatedSegments = [...segments];
    updatedSegments.splice(index, 1);
    setSegments(updatedSegments);
  };
  
  // Add a tag
  const addTag = (tag) => {
    if (tags.includes(tag)) return;
    if (tags.length >= 5) {
      setError('You can only add up to 5 tags');
      return;
    }
    
    setTags([...tags, tag]);
    setCustomTag('');
  };
  
  // Add custom tag
  const handleAddCustomTag = (e) => {
    e.preventDefault();
    if (!customTag.trim()) return;
    addTag(customTag.trim());
  };
  
  // Remove a tag
  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  // Validate form
  const validateForm = () => {
    if (!title.trim()) {
      setError('Please add a title');
      return false;
    }
    
    if (segments.some(segment => !segment.content.trim())) {
      setError('Please fill in all segments');
      return false;
    }
    
    return true;
  };
  
  // Save thread
  const saveThread = async (publish = false) => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    setError('');
    
    const threadData = {
      title,
      segments: segments.map(segment => ({ content: segment.content })),
      tags,
      isDraft: !publish,
    };
    
    try {
      let result;
      
      if (existingThread) {
        result = await updateThread(existingThread._id, threadData);
      } else {
        result = await createThread(threadData);
      }
      
      if (result.success) {
        setSuccessMessage(publish ? 'Thread published successfully!' : 'Draft saved successfully!');
        
        // Redirect after a short delay to show the success message
        setTimeout(() => {
          navigate(publish ? `/thread/${result.threadId || existingThread._id}` : '/profile');
        }, 1500);
      } else {
        setError(result.error || 'Failed to save thread');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Save as draft
  const saveAsDraft = () => saveThread(false);
  
  // Publish thread
  const publishThread = () => saveThread(true);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Success message */}
      {successMessage && (
        <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 text-success-800 dark:text-success-200 px-4 py-3 rounded mb-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 text-error-800 dark:text-error-200 px-4 py-3 rounded mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}
      
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 mb-6">
        {/* Title input */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Thread Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="What's your thread about?"
            className="form-input text-xl font-serif"
            maxLength={MAX_TITLE_LENGTH}
          />
          <div className="flex justify-end mt-1">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {title.length}/{MAX_TITLE_LENGTH}
            </span>
          </div>
        </div>
        
        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Tags (up to 5)
          </label>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <div 
                key={tag} 
                className="tag bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100 flex items-center"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-primary-800 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-100"
                  aria-label={`Remove ${tag} tag`}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              placeholder="Add a custom tag"
              className="form-input flex-grow"
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTag(e)}
            />
            <button
              onClick={handleAddCustomTag}
              className="ml-2 btn btn-secondary"
              disabled={!customTag.trim() || tags.length >= 5}
            >
              Add
            </button>
          </div>
          
          {/* Common tags */}
          <div className="mt-2">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
              Common tags:
            </p>
            <div className="flex flex-wrap gap-2">
              {COMMON_TAGS.slice(0, 8).map(tag => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  disabled={tags.includes(tag) || tags.length >= 5}
                  className={`tag ${
                    tags.includes(tag)
                      ? 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600 cursor-not-allowed'
                      : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 cursor-pointer'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Thread segments */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Thread Segments
          </label>
          
          <AnimatePresence>
            {segments.map((segment, index) => (
              <motion.div
                key={segment.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mb-4 relative"
              >
                <div className="flex">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
                    {index + 1}
                  </div>
                  
                  <div className="flex-grow">
                    <TextareaAutosize
                      value={segment.content}
                      onChange={(e) => handleSegmentChange(index, e.target.value)}
                      placeholder={`Add segment ${index + 1} content...`}
                      className="form-input w-full min-h-[100px] resize-none segment-editor"
                      maxLength={MAX_SEGMENT_LENGTH}
                    />
                    
                    <div className="flex justify-end mt-1">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {segment.content.length}/{MAX_SEGMENT_LENGTH}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeSegment(index)}
                    className="ml-2 text-neutral-500 hover:text-error-600 dark:text-neutral-400 dark:hover:text-error-400 self-start mt-2"
                    aria-label="Remove segment"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <div className="flex justify-center mt-4">
            <button
              onClick={addSegment}
              disabled={segments.length >= MAX_SEGMENTS}
              className={`
                btn btn-outline flex items-center
                ${segments.length >= MAX_SEGMENTS ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <Plus className="h-5 w-5 mr-1" />
              Add Segment
            </button>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={saveAsDraft}
            disabled={isSaving}
            className="btn btn-outline flex items-center"
          >
            <Save className="h-5 w-5 mr-1" />
            Save as Draft
          </button>
          
          <button
            onClick={publishThread}
            disabled={isSaving}
            className="btn btn-primary flex items-center"
          >
            <CheckCircle className="h-5 w-5 mr-1" />
            {isDraft ? 'Publish Thread' : 'Update Thread'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThreadEditor;