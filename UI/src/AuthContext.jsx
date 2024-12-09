import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for the auth
const AuthContext = createContext(null);

// AuthProvider component to wrap around your application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve user information from local storage if it exists
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    // Update local storage whenever the user state changes
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
