import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  activeModule: string;
}

const moduleLabels = {
  dashboard: 'Dashboard',
  finance: 'Finance Management',
  sales: 'Sales & Purchase',
  inventory: 'Inventory Management'
};

export default function Header({ onMenuToggle, activeModule }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-md hover:bg-slate-100 mr-4"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-xl font-semibold text-slate-800">
          {moduleLabels[activeModule as keyof typeof moduleLabels]}
        </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-slate-100 relative">
          <Bell size={20} className="text-slate-600" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <span className="text-sm font-medium text-slate-700">Admin User</span>
        </div>
      </div>
    </header>
  );
}