import { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Expenses from './pages/Expenses';
import DataViewer from './pages/DataViewer';

function Navbar({ onToggleTheme }: { onToggleTheme: () => void }) {
  const location = useLocation();
  return (
    <div className="flex items-center justify-between px-4 h-14 border-b bg-white dark:bg-gray-900 dark:text-gray-100">
      <div className="text-lg font-semibold">IMS Admin</div>
      <div className="flex-1 max-w-md mx-4">
        <input className="w-full px-3 py-2 rounded border dark:bg-gray-800" placeholder={`Search ${location.pathname.replace('/', '') || 'dashboard'}...`} />
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onToggleTheme} className="px-3 py-1 rounded border">🌓</button>
        <button className="px-3 py-1 rounded border">🔔</button>
        <div className="w-8 h-8 rounded-full bg-gray-300" />
      </div>
    </div>
  );
}

function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) => `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive ? 'bg-gray-100 dark:bg-gray-800' : ''}`;
  return (
    <div className="w-64 border-r h-full p-3 bg-white dark:bg-gray-900 dark:text-gray-100">
      <nav className="flex flex-col gap-1">
        <NavLink to="/" className={linkClass} end>🏠 Dashboard</NavLink>
        <NavLink to="/inventory" className={linkClass}>📦 Inventory</NavLink>
        <NavLink to="/users" className={linkClass}>👥 Users</NavLink>
        <NavLink to="/expenses" className={linkClass}>💳 Expenses</NavLink>
        <NavLink to="/settings" className={linkClass}>⚙️ Settings</NavLink>
        <NavLink to="/data" className={linkClass}>🧪 Data Viewer</NavLink>
      </nav>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState<'light'|'dark'>(() => (localStorage.getItem('theme') as 'light'|'dark') || 'light');
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="h-full flex flex-col">
      <Navbar onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 bg-gray-50 dark:bg-gray-950 dark:text-gray-100">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/data" element={<DataViewer />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}


