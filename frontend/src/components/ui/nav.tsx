import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-md",
        isActive 
          ? "bg-primary/10 text-primary" 
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
};

const Nav = () => {
  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-card border-b z-50">
      <nav className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <Link to="/">
            <img src="/basketball.png" alt="Basketball Logo" className="w-10 h-10" />
          </Link>
          <span className="text-xl font-bold text-foreground">Development Tool</span>
        </div>
        
        {/* Navigation Links */}
        <div className="flex items-center gap-2">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/player-averages">Position Averages</NavLink>
          <NavLink to="/stat-help">Stat Guide</NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Nav;