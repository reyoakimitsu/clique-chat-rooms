
import React from 'react';
import { Outlet, useParams, Navigate } from 'react-router-dom';
import GroupSidebar from './GroupSidebar';

// Mock function to check if a group exists
const groupExists = (groupId: string) => {
  // In a real app, this would check against a database
  return ["g1", "g2", "g3"].includes(groupId);
};

const GroupLayout: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  
  if (!groupId || !groupExists(groupId)) {
    return <Navigate to="/messages" replace />;
  }

  return (
    <div className="flex h-full">
      <GroupSidebar />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default GroupLayout;
