
import React, { ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <div className="flex-1 h-screen overflow-hidden">
      {children}
    </div>
  );
};

export default MainContent;
