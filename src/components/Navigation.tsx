import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Settings, ShoppingBag, LineChart } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutGrid, label: 'POS' },
    { path: '/manage', icon: Settings, label: 'Products' },
    { path: '/sales', icon: LineChart, label: 'Sales' },
  ];

  return (
    <nav className="h-screen w-20 fixed left-0 top-0 glass-panel border-r border-white/20 flex flex-col items-center py-6">
      <div className="mb-8">
        <ShoppingBag size={32} className="text-blue-600" />
      </div>
      
      <div className="flex-1 flex flex-col gap-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative w-12 h-12 flex items-center justify-center rounded-xl transition-all group
                ${isActive 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-white/60'
                }`}
            >
              <Icon size={24} />
              <span className="absolute left-full ml-2 px-2 py-1 rounded bg-gray-800 text-white text-sm
                opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
