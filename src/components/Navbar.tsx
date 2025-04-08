
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Database, Play } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-lg">PED Discovery</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button 
              variant={location.pathname === '/' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center"
            >
              <Home className="mr-2 h-4 w-4" />
              Documents
            </Button>
          </Link>
          
          <Link to="/queries">
            <Button 
              variant={location.pathname === '/queries' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center"
            >
              <Database className="mr-2 h-4 w-4" />
              Queries
            </Button>
          </Link>

          <Link to="/executions">
            <Button 
              variant={location.pathname === '/executions' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center"
            >
              <Play className="mr-2 h-4 w-4" />
              Executions
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
