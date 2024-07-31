import React, { createContext, useContext, useState } from 'react';

// Create a context for the auth
const AuthContext = createContext(null);

// AuthProvider component to wrap around your application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

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
