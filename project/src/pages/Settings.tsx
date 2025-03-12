import React, { useState } from 'react';
import { Bell, User, Settings as SettingsIcon, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const [systemSettings, setSystemSettings] = useState({
    hospitalName: 'City General Hospital',
    timeZone: 'UTC+00:00',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h'
  });

  const [userPreferences, setUserPreferences] = useState({
    theme: 'light',
    fontSize: 'medium',
    compactView: false,
    dashboardRefreshRate: '5'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    bedAlerts: true,
    staffingAlerts: true,
    maintenanceAlerts: true,
    criticalAlertsOnly: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSystemSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSystemSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleUserPreferencesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setUserPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleNotificationSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save settings to backend (to be implemented)
      // await api.saveSettings({ systemSettings, userPreferences, notificationSettings });
      
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings. Please try again.');
      console.error('Error saving settings:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeZoneOptions = [
    { value: 'UTC-12:00', label: '(UTC-12:00) International Date Line West' },
    { value: 'UTC-11:00', label: '(UTC-11:00) Coordinated Universal Time-11' },
    { value: 'UTC-10:00', label: '(UTC-10:00) Hawaii' },
    { value: 'UTC-09:00', label: '(UTC-09:00) Alaska' },
    { value: 'UTC-08:00', label: '(UTC-08:00) Pacific Time (US & Canada)' },
    { value: 'UTC-07:00', label: '(UTC-07:00) Mountain Time (US & Canada)' },
    { value: 'UTC-06:00', label: '(UTC-06:00) Central Time (US & Canada)' },
    { value: 'UTC-05:00', label: '(UTC-05:00) Eastern Time (US & Canada)' },
    { value: 'UTC+00:00', label: '(UTC+00:00) Greenwich Mean Time' },
    { value: 'UTC+01:00', label: '(UTC+01:00) Central European Time' },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button
          onClick={handleSubmit}
          isLoading={isSubmitting}
          icon={<Save size={16} />}
        >
          Save Changes
        </Button>
      </div>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon size={20} />
            System Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Hospital Name"
              name="hospitalName"
              value={systemSettings.hospitalName}
              onChange={handleSystemSettingsChange}
            />
            <Select
              label="Time Zone"
              name="timeZone"
              value={systemSettings.timeZone}
              onChange={handleSystemSettingsChange}
              options={timeZoneOptions}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Language"
              name="language"
              value={systemSettings.language}
              onChange={handleSystemSettingsChange}
              options={languageOptions}
            />
            <Select
              label="Date Format"
              name="dateFormat"
              value={systemSettings.dateFormat}
              onChange={handleSystemSettingsChange}
              options={[
                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
              ]}
            />
            <Select
              label="Time Format"
              name="timeFormat"
              value={systemSettings.timeFormat}
              onChange={handleSystemSettingsChange}
              options={[
                { value: '12h', label: '12-hour' },
                { value: '24h', label: '24-hour' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* User Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={20} />
            User Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Theme"
              name="theme"
              value={userPreferences.theme}
              onChange={handleUserPreferencesChange}
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'system', label: 'System' },
              ]}
            />
            <Select
              label="Font Size"
              name="fontSize"
              value={userPreferences.fontSize}
              onChange={handleUserPreferencesChange}
              options={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="compactView"
                name="compactView"
                checked={userPreferences.compactView}
                onChange={handleUserPreferencesChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="compactView" className="text-sm font-medium text-gray-700">
                Enable Compact View
              </label>
            </div>
            <Select
              label="Dashboard Refresh Rate (minutes)"
              name="dashboardRefreshRate"
              value={userPreferences.dashboardRefreshRate}
              onChange={handleUserPreferencesChange}
              options={[
                { value: '1', label: '1 minute' },
                { value: '5', label: '5 minutes' },
                { value: '10', label: '10 minutes' },
                { value: '15', label: '15 minutes' },
                { value: '30', label: '30 minutes' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={20} />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onChange={handleNotificationSettingsChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700">
                  Email Notifications
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="pushNotifications"
                  name="pushNotifications"
                  checked={notificationSettings.pushNotifications}
                  onChange={handleNotificationSettingsChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="pushNotifications" className="text-sm font-medium text-gray-700">
                  Push Notifications
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="criticalAlertsOnly"
                  name="criticalAlertsOnly"
                  checked={notificationSettings.criticalAlertsOnly}
                  onChange={handleNotificationSettingsChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="criticalAlertsOnly" className="text-sm font-medium text-gray-700">
                  Critical Alerts Only
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="bedAlerts"
                  name="bedAlerts"
                  checked={notificationSettings.bedAlerts}
                  onChange={handleNotificationSettingsChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="bedAlerts" className="text-sm font-medium text-gray-700">
                  Bed Status Alerts
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="staffingAlerts"
                  name="staffingAlerts"
                  checked={notificationSettings.staffingAlerts}
                  onChange={handleNotificationSettingsChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="staffingAlerts" className="text-sm font-medium text-gray-700">
                  Staffing Alerts
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="maintenanceAlerts"
                  name="maintenanceAlerts"
                  checked={notificationSettings.maintenanceAlerts}
                  onChange={handleNotificationSettingsChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="maintenanceAlerts" className="text-sm font-medium text-gray-700">
                  Maintenance Alerts
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;