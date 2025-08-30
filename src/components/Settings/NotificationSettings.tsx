import React, { useState } from 'react';
import { Save, Bell, Mail, Smartphone } from 'lucide-react';

interface NotificationSettingsProps {
  settings: any;
  onUpdate: (settings: any) => void;
}

export default function NotificationSettings({ settings, onUpdate }: NotificationSettingsProps) {
  const [formData, setFormData] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleNotificationChange = (category: string, enabled: boolean) => {
    const newNotifications = { ...formData.notifications, [category]: enabled };
    setFormData((prev: any) => ({ ...prev, notifications: newNotifications }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(formData);
    setHasChanges(false);
  };

  const notificationCategories = [
    { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email', icon: Mail },
    { key: 'push', label: 'Push Notifications', description: 'Browser push notifications', icon: Smartphone },
    { key: 'lowStock', label: 'Low Stock Alerts', description: 'Get notified when inventory is low', icon: Bell },
    { key: 'orderUpdates', label: 'Order Updates', description: 'Notifications for order status changes', icon: Bell },
    { key: 'paymentReminders', label: 'Payment Reminders', description: 'Reminders for due payments', icon: Bell }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">Notification Preferences</h3>
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

      <div className="space-y-4">
        {notificationCategories.map(category => {
          const Icon = category.icon;
          return (
            <div key={category.key} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{category.label}</p>
                  <p className="text-sm text-slate-500">{category.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifications[category.key]}
                  onChange={(e) => handleNotificationChange(category.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Notification Summary</h4>
        <div className="text-sm text-blue-700">
          <p>You will receive notifications via:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            {formData.notifications.email && <li>Email notifications</li>}
            {formData.notifications.push && <li>Browser push notifications</li>}
            {!formData.notifications.email && !formData.notifications.push && <li>No notification methods enabled</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}