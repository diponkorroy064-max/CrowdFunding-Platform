import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase.config';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync user with backend database to get role, credits, and JWT token
  const syncUserWithBackend = async (firebaseUser, roleChoice = 'supporter') => {
    try {
      if (!firebaseUser?.email) return null;

      // 1. Ensure user is in database (gets initial credits: 50 for supporter, 20 for creator)
      const res = await apiClient.post('/users', {
        name: firebaseUser.displayName || 'CrowdSpark Member',
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        role: roleChoice
      });

      // 2. Request JWT Token
      const jwtRes = await apiClient.post('/jwt', { email: firebaseUser.email });
      if (jwtRes.data?.token) {
        localStorage.setItem('crowdspark_access_token', jwtRes.data.token);
      }

      // 3. Fetch latest user details (credits, role)
      const userDetailsRes = await apiClient.get(`/users/${firebaseUser.email}`);
      const dbUser = userDetailsRes.data;

      const fullUser = {
        uid: firebaseUser.uid,
        displayName: dbUser.name || firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: dbUser.photoURL || firebaseUser.photoURL,
        role: dbUser.role || roleChoice,
        credits: dbUser.credits !== undefined ? dbUser.credits : 0,
        _id: dbUser._id
      };

      setUser(fullUser);
      return fullUser;
    } catch (error) {
      console.error('Failed to sync user with backend:', error);
      // Fallback local user representation if server is offline or connecting
      const fallbackUser = {
        uid: firebaseUser?.uid || 'temp_uid',
        displayName: firebaseUser?.displayName || 'User',
        email: firebaseUser?.email,
        photoURL: firebaseUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        role: roleChoice,
        credits: roleChoice === 'creator' ? 20 : 50
      };
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  // Register with email and password
  const registerUser = async (email, password, name, photoURL, role = 'supporter') => {
    setLoading(true);
    try {
      if (auth) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, {
          displayName: name,
          photoURL: photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
        });
        const updatedFirebaseUser = {
          ...result.user,
          displayName: name,
          photoURL: photoURL
        };
        const synced = await syncUserWithBackend(updatedFirebaseUser, role);
        setLoading(false);
        return synced;
      } else {
        // Fallback simulated auth
        const dummyUser = {
          uid: 'sim_' + Date.now(),
          displayName: name,
          email,
          photoURL: photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          role
        };
        const synced = await syncUserWithBackend(dummyUser, role);
        setLoading(false);
        return synced;
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Login with email and password
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      if (auth) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const synced = await syncUserWithBackend(result.user);
        setLoading(false);
        return synced;
      } else {
        // Fallback login
        const dummyUser = {
          uid: 'sim_' + Date.now(),
          email,
          displayName: email.split('@')[0],
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        };
        const synced = await syncUserWithBackend(dummyUser);
        setLoading(false);
        return synced;
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Google Sign-In
  const loginWithGoogle = async (roleChoice = 'supporter') => {
    setLoading(true);
    try {
      if (auth && googleProvider) {
        const result = await signInWithPopup(auth, googleProvider);
        const synced = await syncUserWithBackend(result.user, roleChoice);
        setLoading(false);
        return synced;
      } else {
        // Fallback simulated google user
        const dummyUser = {
          uid: 'google_' + Date.now(),
          displayName: 'Google Demo User',
          email: 'demo_user@gmail.com',
          photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        };
        const synced = await syncUserWithBackend(dummyUser, roleChoice);
        setLoading(false);
        return synced;
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Refetch user credits and info
  const refreshUser = async () => {
    if (!user?.email) return;
    try {
      const res = await apiClient.get(`/users/${user.email}`);
      if (res.data) {
        setUser((prev) => ({
          ...prev,
          credits: res.data.credits,
          role: res.data.role,
          displayName: res.data.name || prev.displayName,
          photoURL: res.data.photoURL || prev.photoURL
        }));
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  // Sign out
  const logOut = async () => {
    setLoading(true);
    try {
      if (auth) {
        await signOut(auth);
      }
      localStorage.removeItem('crowdspark_access_token');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  // Monitor auth state changes & handle reload resilience
  useEffect(() => {
    let unsubscribe = () => {};
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          await syncUserWithBackend(currentUser);
        } else {
          setUser(null);
          localStorage.removeItem('crowdspark_access_token');
        }
        setLoading(false);
      });
    } else {
      // If auth is not ready, load token or stop loading
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    setUser,
    loading,
    registerUser,
    loginUser,
    loginWithGoogle,
    refreshUser,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
