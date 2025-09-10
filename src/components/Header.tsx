import React from 'react';
import { Menu, Building2 } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  sidebarCollapsed: boolean;
}

export default function Header({ onMenuToggle, sidebarCollapsed }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-md hover:bg-slate-100 transition-colors"
        >
          <Menu size={20} className="text-slate-600" />
        </button>
        
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Basirah-ERP</h1>
              <p className="text-xs text-slate-500">ERP System</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-900">Admin User</p>
          <p className="text-xs text-slate-500">admin@basirah.com</p>
        </div>
      </div>
    </header>
  );
}