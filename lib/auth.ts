// Auth utility functions for client-side authentication

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user_id');
  }
  return null;
};

export const getUsername = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('username');
  }
  return null;
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
  }
};

export const isLoggedIn = () => {
  return getAuthToken() !== null;
};
