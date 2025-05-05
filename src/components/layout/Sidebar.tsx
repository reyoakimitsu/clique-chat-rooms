
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import UserSearch from '@/components/search/UserSearch';
import SidebarNavButtons from './SidebarNavButtons';
import SidebarGroupSection from './SidebarGroupSection';
import SidebarUserSection from './SidebarUserSection';

const Sidebar: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <>
      <div className="h-screen bg-clique-dark w-20 flex-shrink-0 border-r border-border flex flex-col items-center py-4">
        {/* Navigation buttons at the top */}
        <SidebarNavButtons showSearch={showSearch} toggleSearch={toggleSearch} />

        <Separator className="my-4 w-10 bg-clique-purple/20" />

        {/* Groups section */}
        <SidebarGroupSection />

        {/* User section at the bottom */}
        <SidebarUserSection />
      </div>

      {/* User Search Dialog */}
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent className="sm:max-w-md">
          <UserSearch onClose={() => setShowSearch(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sidebar;
