import React from 'react';
import { Database, Shield, Zap, HardDrive } from 'lucide-react';

export default function SystemSettings() {
  const systemInfo = {
    version: '1.0.0',
    database: 'Supabase PostgreSQL',
    uptime: '99.9%',
    lastBackup: '2024-01-28 03:00 AM',
    storage: '2.3 GB / 10 GB',
    apiCalls: '1,247 / 10,000'
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900">System Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="text-sm font-medium text-slate-900">Performance</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">System Version:</span>
              <span className="text-sm font-medium">{systemInfo.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Uptime:</span>
              <span className="text-sm font-medium text-green-600">{systemInfo.uptime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">API Calls:</span>
              <span className="text-sm font-medium">{systemInfo.apiCalls}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="text-sm font-medium text-slate-900">Database</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Database:</span>
              <span className="text-sm font-medium">{systemInfo.database}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Last Backup:</span>
              <span className="text-sm font-medium">{systemInfo.lastBackup}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Storage Used:</span>
              <span className="text-sm font-medium">{systemInfo.storage}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="text-sm font-medium text-slate-900">Security</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">SSL Certificate:</span>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Two-Factor Auth:</span>
              <span className="text-sm font-medium text-green-600">Enabled</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Data Encryption:</span>
              <span className="text-sm font-medium text-green-600">AES-256</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-orange-600" />
            </div>
            <h4 className="text-sm font-medium text-slate-900">Maintenance</h4>
          </div>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
              Run System Diagnostics
            </button>
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm">
              Create Backup
            </button>
            <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors text-sm">
              Clear Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}