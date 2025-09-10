import React from 'react';
import { 
  LayoutDashboard, 
  DollarSign, 
  ShoppingCart, 
  Package,
  Users,
  Calculator,
  FileText,
  Settings,
  Building2
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  isCollapsed: boolean;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'sales', label: 'Sales/Purchase', icon: ShoppingCart },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'hr', label: 'Human Resources', icon: Users },
  { id: 'accounting', label: 'Accounting', icon: Calculator },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeModule, onModuleChange, isCollapsed }: SidebarProps) {
  return (
    <div className={`
      bg-white border-r border-slate-200 h-full flex flex-col transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Logo Section - Only show when collapsed */}
      {isCollapsed && (
        <div className="flex items-center justify-center h-16 border-b border-slate-200">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 size={24} className="text-white" />
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onModuleChange(item.id)}
              className={`
                w-full flex items-center px-4 py-3 text-left transition-colors duration-200 group
                ${isActive 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={20} className={`${isCollapsed ? 'mx-auto' : 'mr-3'} flex-shrink-0`} />
              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}