import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ADMIN, INITIAL_USERS } from '../data/initialData';
import { calculateDaysRemaining, determineUserStatus } from '../utils/helpers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Try to load persisted user or start with Rajesh Kumar as demo user
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('asan_bill_current_user');
      return saved ? JSON.parse(saved) : INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  });

  // Keep localStorage updated
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('asan_bill_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('asan_bill_current_user');
    }
  }, [currentUser]);

  const login = (identifier, password, allUsers) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Check Admin
    if (
      (cleanId === INITIAL_ADMIN.username || cleanId === INITIAL_ADMIN.email.toLowerCase()) &&
      (cleanPass === 'admin' || cleanPass === 'admin123')
    ) {
      const adminObj = { ...INITIAL_ADMIN };
      setCurrentUser(adminObj);
      return { success: true, role: 'admin', user: adminObj };
    }

    // Check Users
    const userPool = allUsers && allUsers.length > 0 ? allUsers : INITIAL_USERS;
    const found = userPool.find(
      (u) =>
        (u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId) &&
        (u.password === cleanPass || cleanPass === 'user123' || cleanPass === 'admin123' || !cleanPass)
    );

    if (found) {
      // Evaluate expiry
      const dynamicStatus = determineUserStatus(found.expiryDate, found.status);
      const updatedUser = { ...found, status: dynamicStatus };
      setCurrentUser(updatedUser);
      return { success: true, role: 'user', user: updatedUser, isExpired: dynamicStatus === 'expired' };
    }

    return { success: false, message: 'Invalid username/email or password.' };
  };

  const loginAs = (type, userObj = null) => {
    if (type === 'admin') {
      setCurrentUser(INITIAL_ADMIN);
    } else if (userObj) {
      const dynamicStatus = determineUserStatus(userObj.expiryDate, userObj.status);
      setCurrentUser({ ...userObj, status: dynamicStatus });
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Expiry states
  const isExpired = currentUser?.role === 'user' && (
    currentUser?.status === 'expired' || calculateDaysRemaining(currentUser?.expiryDate) < 0
  );

  const daysRemaining = currentUser?.role === 'user' && currentUser?.expiryDate
    ? calculateDaysRemaining(currentUser.expiryDate)
    : null;

  const isExpiringSoon = currentUser?.role === 'user' && !isExpired && daysRemaining !== null && daysRemaining <= 15;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        loginAs,
        logout,
        isAdmin: currentUser?.role === 'admin',
        isUser: currentUser?.role === 'user',
        isExpired,
        isExpiringSoon,
        daysRemaining
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
