
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Search } from 'lucide-react';

interface SidebarNavButtonsProps {
  showSearch: boolean;
  toggleSearch: () => void;
}

const SidebarNavButtons: React.FC<SidebarNavButtonsProps> = ({ showSearch, toggleSearch }) => {
  return (
    <>
      {/* Search button */}
      <div className="group flex flex-col items-center justify-center mb-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className={`rounded-full mb-1 ${showSearch ? 'bg-clique-purple' : 'bg-clique-purple/10 hover:bg-clique-purple/20'}`}
          onClick={toggleSearch}
        >
          <Search className={`h-6 w-6 ${showSearch ? 'text-white' : 'text-clique-purple'}`} />
        </Button>
        <span className="text-xs text-muted-foreground group-hover:text-foreground">Search</span>
      </div>

      {/* DM section */}
      <Link to="/messages" className="group flex flex-col items-center justify-center">
        <Button variant="ghost" size="icon" className="rounded-full mb-1 bg-clique-purple/10 hover:bg-clique-purple/20">
          <MessageSquare className="h-6 w-6 text-clique-purple" />
        </Button>
        <span className="text-xs text-muted-foreground group-hover:text-foreground">DMs</span>
      </Link>
    </>
  );
};

export default SidebarNavButtons;
