// src/context/LoadingContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Create the context with default values
const LoadingContext = createContext({
  isLoading: false, // The initial state of loading
  setLoading: () => {}, // A function to update the loading state
});

// Create a provider component that will wrap your app
export const LoadingProvider = ({ children }) => {
  const [isLoading, setLoading] = useState(false); // Local state for loading

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children} {/* Render the children components */}
    </LoadingContext.Provider>
  );
};

// Custom hook to use the LoadingContext in your components
export const useLoading = () => useContext(LoadingContext);
