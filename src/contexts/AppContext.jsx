import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Initial state
const initialState = {
  darkMode: false,
  language: 'ar',
  loading: false,
  user: null,
  sidebarOpen: false,
};

// Action types
const actionTypes = {
  SET_DARK_MODE: 'SET_DARK_MODE',
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_SIDEBAR: 'SET_SIDEBAR',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_DARK_MODE:
      return { ...state, darkMode: action.payload };
    case actionTypes.SET_LANGUAGE:
      return { ...state, language: action.payload };
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case actionTypes.SET_USER:
      return { ...state, user: action.payload };
    case actionTypes.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case actionTypes.SET_SIDEBAR:
      return { ...state, sidebarOpen: action.payload };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { i18n } = useTranslation();

  // Initialize theme and language from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedLanguage = localStorage.getItem('language');

    if (savedDarkMode) {
      const isDark = JSON.parse(savedDarkMode);
      dispatch({ type: actionTypes.SET_DARK_MODE, payload: isDark });
      
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Auto-detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch({ type: actionTypes.SET_DARK_MODE, payload: prefersDark });
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }

    if (savedLanguage) {
      dispatch({ type: actionTypes.SET_LANGUAGE, payload: savedLanguage });
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  // Update HTML attributes when language changes
  useEffect(() => {
    const html = document.documentElement;
    html.lang = state.language;
    html.dir = state.language === 'ar' ? 'rtl' : 'ltr';
  }, [state.language]);

  // Actions
  const actions = {
    setDarkMode: (isDark) => {
      dispatch({ type: actionTypes.SET_DARK_MODE, payload: isDark });
      localStorage.setItem('darkMode', JSON.stringify(isDark));
      
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },

    setLanguage: (lang) => {
      dispatch({ type: actionTypes.SET_LANGUAGE, payload: lang });
      localStorage.setItem('language', lang);
      i18n.changeLanguage(lang);
    },

    setLoading: (loading) => {
      dispatch({ type: actionTypes.SET_LOADING, payload: loading });
    },

    setUser: (user) => {
      dispatch({ type: actionTypes.SET_USER, payload: user });
    },

    toggleSidebar: () => {
      dispatch({ type: actionTypes.TOGGLE_SIDEBAR });
    },

    setSidebar: (open) => {
      dispatch({ type: actionTypes.SET_SIDEBAR, payload: open });
    },
  };

  const value = {
    ...state,
    ...actions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};