import React from 'react';
import { 
  LayoutDashboard, 
  DollarSign, 
  ShoppingCart, 
  Package,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'sales', label: 'Sales/Purchase', icon: ShoppingCart },
  { id: 'inventory', label: 'Inventory', icon: Package },
];

export default function Sidebar({ activeModule, onModuleChange, isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700">
          <h1 className="text-xl font-bold">ERP System</h1>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 rounded-md hover:bg-slate-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onModuleChange(item.id);
                  onToggle();
                }}
                className={`
                  w-full flex items-center px-6 py-3 text-left transition-colors duration-200
                  ${isActive 
                    ? 'bg-blue-600 text-white border-r-4 border-blue-400' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <Icon size={20} className="mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}