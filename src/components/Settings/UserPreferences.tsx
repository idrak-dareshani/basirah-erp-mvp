import React, { useState } from 'react';
import { Save } from 'lucide-react';

interface UserPreferencesProps {
  settings: any;
  onUpdate: (settings: any) => void;
}

export default function UserPreferences({ settings, onUpdate }: UserPreferencesProps) {
  const [formData, setFormData] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(formData);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">User Preferences</h3>
        {hasChanges && (
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
            <select
              value={formData.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
            <select
              value={formData.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date Format</label>
            <select
              value={formData.dateFormat}
              onChange={(e) => handleChange('dateFormat', e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Time Format</label>
            <select
              value={formData.timeFormat}
              onChange={(e) => handleChange('timeFormat', e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="12-hour">12-hour (AM/PM)</option>
              <option value="24-hour">24-hour</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6">
          <h4 className="text-sm font-medium text-slate-700 mb-4">Preview</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Current Date:</span>
              <span className="text-sm font-medium">
                {formData.dateFormat === 'MM/DD/YYYY' && new Date().toLocaleDateString('en-US')}
                {formData.dateFormat === 'DD/MM/YYYY' && new Date().toLocaleDateString('en-GB')}
                {formData.dateFormat === 'YYYY-MM-DD' && new Date().toISOString().split('T')[0]}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Current Time:</span>
              <span className="text-sm font-medium">
                {formData.timeFormat === '12-hour' 
                  ? new Date().toLocaleTimeString('en-US', { hour12: true })
                  : new Date().toLocaleTimeString('en-US', { hour12: false })
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Theme:</span>
              <span className="text-sm font-medium capitalize">{formData.theme}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Language:</span>
              <span className="text-sm font-medium">{formData.language}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}