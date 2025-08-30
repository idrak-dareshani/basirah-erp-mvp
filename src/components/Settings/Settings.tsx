import React, { useState } from 'react';
import { Save, Building, User, Bell, Palette } from 'lucide-react';
import CompanySettings from './CompanySettings';
import UserPreferences from './UserPreferences';
import NotificationSettings from './NotificationSettings';
import SystemSettings from './SystemSettings';
import { mockCompanySettings, mockUserSettings } from '../../data/mockData';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'company' | 'user' | 'notifications' | 'system'>('company');
  const [companySettings, setCompanySettings] = useLocalStorage('companySettings', mockCompanySettings);
  const [userSettings, setUserSettings] = useLocalStorage('userSettings', mockUserSettings);

  const tabs = [
    { id: 'company', label: 'Company', icon: Building },
    { id: 'user', label: 'User Preferences', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Palette }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        {/* Tab Navigation */}
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'company' && (
            <CompanySettings 
              settings={companySettings}
              onUpdate={setCompanySettings}
            />
          )}

          {activeTab === 'user' && (
            <UserPreferences 
              settings={userSettings}
              onUpdate={setUserSettings}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationSettings 
              settings={userSettings}
              onUpdate={setUserSettings}
            />
          )}

          {activeTab === 'system' && (
            <SystemSettings />
          )}
        </div>
      </div>
    </div>
  );
}