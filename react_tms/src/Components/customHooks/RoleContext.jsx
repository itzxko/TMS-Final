// RoleContext.js
import React, { createContext, useState, useEffect } from 'react';

const RoleContext = createContext();

const RoleProvider = ({ children }) => {
    const [role, setRole] = useState(() => {
        // Initialize state from localStorage if it exists
        const savedRole = localStorage.getItem('role');
        return savedRole || "";
      });
    
      useEffect(() => {
        // Save role to localStorage whenever it changes
        if (role) {
          localStorage.setItem('role', role);
        } else {
          localStorage.removeItem('role');
        }
      }, [role]);
  

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export { RoleContext, RoleProvider };
