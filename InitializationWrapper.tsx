
import React from 'react';
import { useInitialization } from '@/hooks/use-initialization';

interface InitializationWrapperProps {
  children: React.ReactNode;
}

/**
 * A wrapper component that handles app initialization logic
 */
const InitializationWrapper: React.FC<InitializationWrapperProps> = ({ children }) => {
  // Use the initialization hook to set up starter data for new users
  useInitialization();
  
  // Just render children, this component just handles initialization logic
  return <>{children}</>;
};

export default InitializationWrapper;
