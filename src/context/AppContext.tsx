import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { 
  Company, 
  OperationalProfile, 
  User, 
  Notification,
  OnboardingData,
  LegalRequirement,
  Obligation,
  ActionPlan
} from '../types';

interface AppState {
  user: User | null;
  company: Company | null;
  operationalProfile: OperationalProfile | null;
  onboarding: OnboardingData | null;
  requirements: LegalRequirement[];
  obligations: Obligation[];
  actionPlans: ActionPlan[];
  notifications: Notification[];
  currentView: string;
  navigationParams: Record<string, any> | null;
  isLoading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_COMPANY'; payload: Company | null }
  | { type: 'SET_OPERATIONAL_PROFILE'; payload: OperationalProfile | null }
  | { type: 'SET_ONBOARDING'; payload: OnboardingData | null }
  | { type: 'UPDATE_ONBOARDING'; payload: Partial<OnboardingData> }
  | { type: 'SET_REQUIREMENTS'; payload: LegalRequirement[] }
  | { type: 'SET_OBLIGATIONS'; payload: Obligation[] }
  | { type: 'UPDATE_OBLIGATION'; payload: Obligation }
  | { type: 'SET_ACTION_PLANS'; payload: ActionPlan[] }
  | { type: 'ADD_ACTION_PLAN'; payload: ActionPlan }
  | { type: 'UPDATE_ACTION_PLAN'; payload: ActionPlan }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'NAVIGATE'; payload: { view: string; params?: Record<string, any> } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_STATE' };

const initialState: AppState = {
  user: null,
  company: null,
  operationalProfile: null,
  onboarding: null,
  requirements: [],
  obligations: [],
  actionPlans: [],
  notifications: [],
  currentView: 'home',
  navigationParams: null,
  isLoading: false,
  error: null
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_COMPANY':
      return { ...state, company: action.payload };
    
    case 'SET_OPERATIONAL_PROFILE':
      return { ...state, operationalProfile: action.payload };
    
    case 'SET_ONBOARDING':
      return { ...state, onboarding: action.payload };
    
    case 'UPDATE_ONBOARDING':
      return { 
        ...state, 
        onboarding: state.onboarding 
          ? { ...state.onboarding, ...action.payload }
          : null
      };
    
    case 'SET_REQUIREMENTS':
      return { ...state, requirements: action.payload };
    
    case 'SET_OBLIGATIONS':
      return { ...state, obligations: action.payload };
    
    case 'UPDATE_OBLIGATION':
      return {
        ...state,
        obligations: state.obligations.map(o => 
          o.id === action.payload.id ? action.payload : o
        )
      };
    
    case 'SET_ACTION_PLANS':
      return { ...state, actionPlans: action.payload };
    
    case 'ADD_ACTION_PLAN':
      return { 
        ...state, 
        actionPlans: [...state.actionPlans, action.payload]
      };
    
    case 'UPDATE_ACTION_PLAN':
      return {
        ...state,
        actionPlans: state.actionPlans.map(p => 
          p.id === action.payload.id ? action.payload : p
        )
      };
    
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [action.payload, ...state.notifications]
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, lida: true } : n
        )
      };
    
    case 'NAVIGATE':
      return { 
        ...state, 
        currentView: action.payload.view,
        navigationParams: action.payload.params || null
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  navigate: (view: string, params?: Record<string, any>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const navigate = (view: string, params?: Record<string, any>) => {
    dispatch({ type: 'NAVIGATE', payload: { view, params } });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, navigate, setLoading, setError }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export function useNavigation() {
  const { state, navigate } = useApp();
  return {
    currentView: state.currentView,
    params: state.navigationParams,
    navigate
  };
}

export function useCompany() {
  const { state, dispatch } = useApp();
  
  const setCompany = (company: Company | null) => {
    dispatch({ type: 'SET_COMPANY', payload: company });
  };
  
  return {
    company: state.company,
    setCompany
  };
}

export function useOnboarding() {
  const { state, dispatch } = useApp();
  
  const startOnboarding = (cnpj: string) => {
    dispatch({
      type: 'SET_ONBOARDING',
      payload: {
        cnpj,
        etapaAtual: 1,
        concluido: false
      }
    });
  };
  
  const updateOnboarding = (data: Partial<OnboardingData>) => {
    dispatch({ type: 'UPDATE_ONBOARDING', payload: data });
  };
  
  const completeOnboarding = () => {
    dispatch({ 
      type: 'UPDATE_ONBOARDING', 
      payload: { concluido: true }
    });
  };
  
  return {
    onboarding: state.onboarding,
    startOnboarding,
    updateOnboarding,
    completeOnboarding
  };
}

export function useNotifications() {
  const { state, dispatch } = useApp();
  
  const unreadCount = state.notifications.filter(n => !n.lida).length;
  
  const addNotification = (notification: Notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };
  
  const markAsRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };
  
  return {
    notifications: state.notifications,
    unreadCount,
    addNotification,
    markAsRead
  };
}
