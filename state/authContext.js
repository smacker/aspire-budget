import React, { createContext } from 'react';

export const AuthContext = createContext({});

export const AuthProvider = (props) => {
  const { login, logout, children } = props;

  const context = {
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};
