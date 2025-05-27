import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Save } from 'lucide-react';
import { useCollectionStore } from '../../stores/collectionStore';

function CollectionForm({ existingCollection = null }) {
  const [formData, setFormData] = useState({
    name: existingCollection?.name || '',
    description: existingCollection?.description || '',
  });
  const [error, setError] = useState('');
  const { createCollection, updateCollection, isLoading } = useCollectionStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return setError('Collection name is required');
    }
    
    try {
      let result;
      
      if (existingCollection) {
        result = await updateCollection(existingCollection._id, formData);
      } else {
        result = await createCollection(formData);
      }
      
      if (result.success) {
        navigate(
          existingCollection 
            ? `/collections/${existingCollection._id}` 
            : `/collections/${result.collectionId}`
        );
      } else {
        setError(result.error || 'Failed to save collection');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
      {error && (
        <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 text-error-800 dark:text-error-200 px-4 py-3 rounded mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Collection Name*
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-input"
          placeholder="e.g., Career Wisdom"
          required
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Description (optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-input min-h-[100px]"
          placeholder="What's this collection about?"
        />
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn btn-primary flex items-center"
          disabled={isLoading}
        >
          <Save className="h-5 w-5 mr-1" />
          {isLoading ? 'Saving...' : existingCollection ? 'Update Collection' : 'Create Collection'}
        </button>
      </div>
    </form>
  );
}

export default CollectionForm;