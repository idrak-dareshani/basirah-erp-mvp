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
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        isCollapsed={sidebarCollapsed}
      />
      
      <div className="flex-1 flex flex-col">
        <Header 
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarCollapsed={sidebarCollapsed}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
}

export default App;