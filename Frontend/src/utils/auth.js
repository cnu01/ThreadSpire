// Get auth header with token
export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Format error message
export const formatError = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  return error?.message || 'An unexpected error occurred';
};