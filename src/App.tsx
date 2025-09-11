import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard/Dashboard';
import Finance from './components/Finance/Finance';
import Sales from './components/Sales/Sales';
import Inventory from './components/Inventory/Inventory';
import HumanResources from './components/HumanResources/HumanResources';
import Accounting from './components/Accounting/Accounting';
import Reports from './components/Reports/Reports';
import Settings from './components/Settings/Settings';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const moduleTitles = {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Overview of your business performance and key metrics'
    },
    finance: {
      title: 'Finance Management',
      subtitle: 'Track income, expenses, and financial transactions'
    },
    sales: {
      title: 'Sales & Purchase Management',
      subtitle: 'Manage sales orders, purchase orders, customers, and vendors'
    },
    inventory: {
      title: 'Inventory Management',
      subtitle: 'Monitor stock levels, products, and inventory valuation'
    },
    hr: {
      title: 'Human Resources',
      subtitle: 'Employee management, payroll, and leave tracking'
    },
    accounting: {
      title: 'Accounting',
      subtitle: 'Chart of accounts, journal entries, and financial reports'
    },
    reports: {
      title: 'Reports & Analytics',
      subtitle: 'Generate and view business reports and analytics'
    },
    settings: {
      title: 'Settings',
      subtitle: 'Configure system preferences and company information'
    }
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'finance':
        return <Finance />;
      case 'sales':
        return <Sales />;
      case 'inventory':
        return <Inventory />;
      case 'hr':
        return <HumanResources />;
      case 'accounting':
        return <Accounting />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header 
        onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />
      
      <div className="flex flex-1 pt-16">
        <Sidebar
          activeModule={activeModule}
          onModuleChange={setActiveModule}
          isCollapsed={sidebarCollapsed}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {moduleTitles[activeModule as keyof typeof moduleTitles]?.title}
            </h1>
            <p className="text-slate-600">
              {moduleTitles[activeModule as keyof typeof moduleTitles]?.subtitle}
            </p>
          </div>
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
}

export default App;