import { Home, LayoutDashboard, Moon, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const nav = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/models', label: 'Models', icon: LayoutDashboard }
];

export default function AppLayout({ children }) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-brand-600">FinModel Lab</h1>
          <button onClick={toggleTheme} className="rounded-xl border p-2 dark:border-slate-700">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl gap-4 px-4 py-6">
        <aside className="hidden w-56 space-y-2 md:block">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link key={item.to} className={`flex items-center gap-2 rounded-xl p-3 ${active ? 'bg-brand-500 text-white' : 'card p-3'}`} to={item.to}>
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </aside>
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
}
