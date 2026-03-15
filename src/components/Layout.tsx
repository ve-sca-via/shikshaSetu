import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, Zap, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = localStorage.getItem('user');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0a0a0a] font-sans dark:text-slate-200 selection:bg-amber-500/30 transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl transition-colors duration-300">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-lg shadow-amber-500/20">
              <BookOpen className="h-5 w-5" />
            </div>
            <Link to="/" className="text-2xl font-serif font-bold tracking-tight text-slate-900 dark:text-white">
              Shiksha <span className="text-amber-500">Setu</span>
            </Link>
          </div>
          
          {user && (
            <nav className="flex items-center gap-8">
              <Link 
                to="/instant-doubt" 
                className={`flex items-center gap-2 text-sm font-medium transition-all ${location.pathname === '/instant-doubt' ? 'text-amber-500 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-300'}`}
              >
                <Zap className="h-4 w-4" />
                Instant Doubt
              </Link>
              <Link 
                to="/" 
                className={`flex items-center gap-2 text-sm font-medium transition-all ${location.pathname === '/' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              
              <div className="h-4 w-px bg-slate-300 dark:bg-white/10" />
              
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
