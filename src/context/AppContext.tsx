import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState } from '../types/app.types';
import { appReducer, initialState, AppAction } from './AppReducer';

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider props
interface AppProviderProps {
  children: ReactNode;
}

// Provider component
export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
