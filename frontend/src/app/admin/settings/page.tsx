'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import React from 'react';

// Simple error boundary component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by error boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="p-4 bg-red-50 text-red-700 rounded-lg">
          <h2 className="font-bold">Something went wrong</h2>
          <p className="mb-2">{this.state.error?.message || 'An unknown error occurred'}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
import { useAuth } from '@/lib/context/AuthContext';
import { useLanguage } from '@/lib/context/LanguageContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import {
  Cog6ToothIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  CreditCardIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

type TabType = 'general' | 'users' | 'roles' | 'notifications' | 'billing' | 'integrations' | 'advanced';

interface SettingSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = ({ 
  title, 
  description, 
  icon, 
  children 
}) => (
  <div className="bg-white shadow-soft rounded-2xl overflow-hidden border border-gray-200">
    <div className="px-6 py-6 sm:px-8">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 bg-gradient-to-r from-primary-900 to-primary-700 rounded-xl p-3 shadow-lg">
          <div className="h-6 w-6 text-white">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
    <div className="border-t-2 border-gray-100 px-6 py-6 sm:px-8 sm:py-8">
      {children}
    </div>
  </div>
);

interface ToggleSwitchProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  label: string;
  description?: string;
}

const ToggleSwitch = ({ enabled, setEnabled, label, description }: ToggleSwitchProps) => (
  <div className="flex items-center justify-between">
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-900">{label}</span>
      {description && <span className="text-xs text-gray-500">{description}</span>}
    </div>
    <button
      type="button"
      className={`${enabled ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
      onClick={() => setEnabled(!enabled)}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`${enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  </div>
);

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  description?: string;
  required?: boolean;
}

const InputField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  description,
  required = false,
}: InputFieldProps) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="mt-1">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>
    {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
  </div>
);

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  description?: string;
  required?: boolean;
  className?: string;
}

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  description,
  required = false,
}: SelectFieldProps) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      required={required}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
  </div>
);

interface SaveButtonProps {
  onClick: () => void;
  loading?: boolean;
  success?: boolean;
  error?: string | null;
}

const SaveButton = ({ onClick, loading = false, success = false, error = null }: SaveButtonProps) => (
  <div className="flex items-center">
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        loading
          ? 'bg-indigo-400 hover:bg-indigo-500 focus:ring-indigo-500'
          : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
      }`}
    >
      {loading ? (
        <>
          <ArrowPathIcon className="-ml-1 mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        'Save Changes'
      )}
    </button>
    
    {success && (
      <div className="ml-4 flex items-center">
        <CheckCircleIcon className="h-5 w-5 text-green-500" />
        <span className="ml-1 text-sm text-green-600">Settings saved successfully</span>
      </div>
    )}
    
    {error && (
      <div className="ml-4 flex items-center">
        <XCircleIcon className="h-5 w-5 text-red-500" />
        <span className="ml-1 text-sm text-red-600">{error}</span>
      </div>
    )}
  </div>
);

const SettingsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // General Settings
  const [siteName, setSiteName] = useState('Sahara Student Services');
  const [siteDescription, setSiteDescription] = useState('Empowering students for a brighter future');
  const [timezone, setTimezone] = useState('Africa/Cairo');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState('12h');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  
  // User Settings
  const [allowRegistrations, setAllowRegistrations] = useState(true);
  const [emailVerification, setEmailVerification] = useState(true);
  const [defaultUserRole, setDefaultUserRole] = useState('student');
  
  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [notificationEmail, setNotificationEmail] = useState('notifications@example.com');
  
  // Billing Settings
  const [paymentGateway, setPaymentGateway] = useState('stripe');
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState('0');
  
  // Timezone options (simplified list)
  const timezones = [
    { value: 'Africa/Cairo', label: '(GMT+02:00) Cairo' },
    { value: 'Europe/London', label: '(GMT+01:00) London' },
    { value: 'America/New_York', label: '(GMT-04:00) New York' },
    { value: 'Asia/Dubai', label: '(GMT+04:00) Dubai' },
    { value: 'Asia/Riyadh', label: '(GMT+03:00) Riyadh' },
  ];
  
  // Date format options
  const dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  ];
  
  // Time format options
  const timeFormats = [
    { value: '12h', label: '12-hour' },
    { value: '24h', label: '24-hour' },
  ];
  
  // User role options
  const userRoles = [
    { value: 'student', label: 'Student' },
    { value: 'instructor', label: 'Instructor' },
    { value: 'admin', label: 'Administrator' },
  ];
  
  // Payment gateway options
  const paymentGateways = [
    { value: 'stripe', label: 'Stripe' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'bank', label: 'Bank Transfer' },
  ];
  
  // Currency options (simplified list)
  const currencies = [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'EGP', label: 'Egyptian Pound (EGP)' },
    { value: 'SAR', label: 'Saudi Riyal (SAR)' },
    { value: 'AED', label: 'UAE Dirham (AED)' },
  ];
  
  // Load settings on component mount
  useEffect(() => {
    if (!authLoading && user) {
      // In a real app, you would fetch settings from your API
      const fetchSettings = async () => {
        try {
          // const response = await api.get('/admin/settings');
          // const settings = response.data;
          // 
          // // Update state with fetched settings
          // setSiteName(settings.siteName || '');
          // setSiteDescription(settings.siteDescription || '');
          // setTimezone(settings.timezone || 'UTC');
          // setDateFormat(settings.dateFormat || 'MM/DD/YYYY');
          // setTimeFormat(settings.timeFormat || '12h');
          // setMaintenanceMode(settings.maintenanceMode || false);
          // setAllowRegistrations(settings.allowRegistrations !== false);
          // setEmailVerification(settings.emailVerification !== false);
          // setDefaultUserRole(settings.defaultUserRole || 'student');
          // setEmailNotifications(settings.emailNotifications !== false);
          // setPushNotifications(settings.pushNotifications !== false);
          // setNotificationEmail(settings.notificationEmail || '');
          // setPaymentGateway(settings.paymentGateway || 'stripe');
          // setCurrency(settings.currency || 'USD');
          // setTaxRate(settings.taxRate || '0');
          
          setLoading(false);
        } catch (error) {
          console.error('Failed to load settings:', error);
          setLoading(false);
        }
      };
      
      fetchSettings();
    }
  }, [authLoading, user]);
  
  // Handle save settings
  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);
      setSaveError(null);
      
      // In a real app, you would send the updated settings to your API
      // const settings = {
      //   siteName,
      //   siteDescription,
      //   timezone,
      //   dateFormat,
      //   timeFormat,
      //   maintenanceMode,
      //   allowRegistrations,
      //   emailVerification,
      //   defaultUserRole,
      //   emailNotifications,
      //   pushNotifications,
      //   notificationEmail,
      //   paymentGateway,
      //   currency,
      //   taxRate: parseFloat(taxRate) || 0,
      // };
      // 
      // await api.put('/admin/settings', settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveError('Failed to save settings. Please try again.');
      setTimeout(() => setSaveError(null), 5000);
    } finally {
      setSaving(false);
    }
  };
  
  // Reset settings to defaults
  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to their default values? This cannot be undone.')) {
      // Reset all settings to default values
      setSiteName('Sahara Student Services');
      setSiteDescription('Empowering students for a brighter future');
      setTimezone('Africa/Cairo');
      setDateFormat('MM/DD/YYYY');
      setTimeFormat('12h');
      setMaintenanceMode(false);
      setAllowRegistrations(true);
      setEmailVerification(true);
      setDefaultUserRole('student');
      setEmailNotifications(true);
      setPushNotifications(true);
      setNotificationEmail('notifications@example.com');
      setPaymentGateway('stripe');
      setCurrency('USD');
      setTaxRate('0');
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };
  
  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
            <p className="mt-2 text-base text-gray-600">
              Manage your application settings and configurations
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="inline-flex items-center px-6 py-3 border-2 border-gray-300 shadow-sm text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b-2 border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('general')}
              className={`${
                activeTab === 'general'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <div className="flex items-center">
                <Cog6ToothIcon className="h-5 w-5 mr-2" />
                General
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <div className="flex items-center">
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Users
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('roles')}
              className={`${
                activeTab === 'roles'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <div className="flex items-center">
                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                Roles & Permissions
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('notifications')}
              className={`${
                activeTab === 'notifications'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <div className="flex items-center">
                <BellIcon className="h-5 w-5 mr-2" />
                Notifications
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('billing')}
              className={`${
                activeTab === 'billing'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <div className="flex items-center">
                <CreditCardIcon className="h-5 w-5 mr-2" />
                Billing
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('integrations')}
              className={`${
                activeTab === 'integrations'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <div className="flex items-center">
                <GlobeAltIcon className="h-5 w-5 mr-2" />
                Integrations
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('advanced')}
              className={`${
                activeTab === 'advanced'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <div className="flex items-center">
                <Cog6ToothIcon className="h-5 w-5 mr-2" />
                Advanced
              </div>
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="pb-5">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <SettingSection
                title="General Settings"
                description="Basic settings for your application"
                icon={<Cog6ToothIcon />}
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <InputField
                    label="Site Name"
                    name="siteName"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="Your Site Name"
                    required
                  />
                  
                  <InputField
                    label="Site Description"
                    name="siteDescription"
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                    placeholder="A brief description of your site"
                  />
                  
                  <SelectField
                    label="Timezone"
                    name="timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    options={timezones}
                    description="This will be used for all date and time displays"
                  />
                  
                  <SelectField
                    label="Date Format"
                    name="dateFormat"
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    options={dateFormats}
                  />
                  
                  <SelectField
                    label="Time Format"
                    name="timeFormat"
                    value={timeFormat}
                    onChange={(e) => setTimeFormat(e.target.value)}
                    options={timeFormats}
                  />
                  
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Maintenance Mode</h4>
                      <p className="text-sm text-gray-500">
                        When enabled, only administrators can access the site
                      </p>
                    </div>
                    <button
                      type="button"
                      className={`${maintenanceMode ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                      onClick={() => setMaintenanceMode(!maintenanceMode)}
                    >
                      <span className="sr-only">Use setting</span>
                      <span
                        aria-hidden="true"
                        className={`${maintenanceMode ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <SaveButton 
                    onClick={handleSaveSettings} 
                    loading={saving} 
                    success={saveSuccess}
                    error={saveError}
                  />
                </div>
              </SettingSection>
              
              <SettingSection
                title="System Information"
                description="Information about your system and environment"
                icon={<Cog6ToothIcon />}
              >
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Application Version</h4>
                      <p className="mt-1 text-sm text-gray-900">1.0.0</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Environment</h4>
                      <p className="mt-1 text-sm text-gray-900">Production</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <ArrowPathIcon className="-ml-0.5 mr-2 h-4 w-4" />
                      Check for Updates
                    </button>
                  </div>
                </div>
              </SettingSection>
            </div>
          )}
          
          {activeTab === 'users' && (
            <div className="space-y-6">
              <SettingSection
                title="User Registration"
                description="Manage user registration and account settings"
                icon={<UserGroupIcon />}
              >
                <div className="space-y-6">
                  <ToggleSwitch
                    enabled={allowRegistrations}
                    setEnabled={setAllowRegistrations}
                    label="Allow New User Registrations"
                    description="If disabled, only administrators can create new user accounts"
                  />
                  
                  <ToggleSwitch
                    enabled={emailVerification}
                    setEnabled={setEmailVerification}
                    label="Require Email Verification"
                    description="Users must verify their email address before they can log in"
                  />
                  
                  <SelectField
                    label="Default User Role"
                    name="defaultUserRole"
                    value={defaultUserRole}
                    onChange={(e) => setDefaultUserRole(e.target.value)}
                    options={userRoles}
                    description="The default role assigned to new users"
                  />
                  
                  <div className="pt-4 border-t border-gray-200">
                    <SaveButton 
                      onClick={handleSaveSettings} 
                      loading={saving} 
                      success={saveSuccess}
                      error={saveError}
                    />
                  </div>
                </div>
              </SettingSection>
              
              <SettingSection
                title="User Profiles"
                description="Customize user profile settings"
                icon={<UserGroupIcon />}
              >
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="profile-avatar"
                        name="profile-avatar"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="profile-avatar" className="font-medium text-gray-700">
                        Enable Profile Avatars
                      </label>
                      <p className="text-gray-500">Allow users to upload profile pictures</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="profile-cover"
                        name="profile-cover"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="profile-cover" className="font-medium text-gray-700">
                        Enable Profile Cover Photos
                      </label>
                      <p className="text-gray-500">Allow users to customize their profile with a cover photo</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="profile-location"
                        name="profile-location"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="profile-location" className="font-medium text-gray-700">
                        Show Location in Profiles
                      </label>
                      <p className="text-gray-500">Display user location on their profile</p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <SaveButton 
                      onClick={handleSaveSettings} 
                      loading={saving} 
                      success={saveSuccess}
                      error={saveError}
                    />
                  </div>
                </div>
              </SettingSection>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <SettingSection
                title="Email Notifications"
                description="Configure email notification settings"
                icon={<BellIcon />}
              >
                <div className="space-y-6">
                  <ToggleSwitch
                    enabled={emailNotifications}
                    setEnabled={setEmailNotifications}
                    label="Enable Email Notifications"
                    description="Send email notifications for important events"
                  />
                  
                  <InputField
                    label="Notification Email Address"
                    name="notificationEmail"
                    type="email"
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                    placeholder="notifications@example.com"
                    description="This email will be used as the sender for all system notifications"
                  />
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Email Templates</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Customize the email templates used for notifications
                    </p>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <DocumentTextIcon className="-ml-0.5 mr-2 h-4 w-4" />
                      Manage Email Templates
                    </button>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <SaveButton 
                      onClick={handleSaveSettings} 
                      loading={saving} 
                      success={saveSuccess}
                      error={saveError}
                    />
                  </div>
                </div>
              </SettingSection>
              
              <SettingSection
                title="Push Notifications"
                description="Configure push notification settings"
                icon={<BellIcon />}
              >
                <div className="space-y-6">
                  <ToggleSwitch
                    enabled={pushNotifications}
                    setEnabled={setPushNotifications}
                    label="Enable Push Notifications"
                    description="Allow users to receive browser push notifications"
                  />
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          To enable push notifications, you need to configure a service worker and obtain a VAPID key.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <SaveButton 
                      onClick={handleSaveSettings} 
                      loading={saving} 
                      success={saveSuccess}
                      error={saveError}
                    />
                  </div>
                </div>
              </SettingSection>
            </div>
          )}
          
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <SettingSection
                title="Payment Settings"
                description="Configure payment gateway and currency settings"
                icon={<CreditCardIcon />}
              >
                <div className="space-y-6">
                  <SelectField
                    label="Payment Gateway"
                    name="paymentGateway"
                    value={paymentGateway}
                    onChange={(e) => setPaymentGateway(e.target.value)}
                    options={paymentGateways}
                    description="Select the payment gateway you want to use"
                  />
                  
                  <SelectField
                    label="Currency"
                    name="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    options={currencies}
                  />
                  
                  <InputField
                    label="Tax Rate (%)"
                    name="taxRate"
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    placeholder="0"
                    description="The default tax rate to apply to all transactions"
                  />
                  
                  <div className="pt-4 border-t border-gray-200">
                    <SaveButton 
                      onClick={handleSaveSettings} 
                      loading={saving} 
                      success={saveSuccess}
                      error={saveError}
                    />
                  </div>
                </div>
              </SettingSection>
              
              <SettingSection
                title="Payment Gateway Configuration"
                description="Configure your selected payment gateway"
                icon={<CreditCardIcon />}
              >
                {paymentGateway === 'stripe' ? (
                  <div className="space-y-4">
                    <InputField
                      label="Stripe Publishable Key"
                      name="stripePublishableKey"
                      type="password"
                      value=""
                      onChange={() => {}}
                      placeholder="pk_test_..."
                    />
                    
                    <InputField
                      label="Stripe Secret Key"
                      name="stripeSecretKey"
                      type="password"
                      value=""
                      onChange={() => {}}
                      placeholder="sk_test_..."
                    />
                    
                    <p className="text-sm text-gray-500">
                      You can find your API keys in the{' '}
                      <a 
                        href="https://dashboard.stripe.com/test/apikeys" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        Stripe Dashboard
                      </a>.
                    </p>
                    
                    <div className="pt-4">
                      <SaveButton 
                        onClick={handleSaveSettings} 
                        loading={saving} 
                        success={saveSuccess}
                        error={saveError}
                      />
                    </div>
                  </div>
                ) : paymentGateway === 'paypal' ? (
                  <div className="space-y-4">
                    <InputField
                      label="PayPal Client ID"
                      name="paypalClientId"
                      type="password"
                      value=""
                      onChange={() => {}}
                      placeholder="AeA1..."
                    />
                    
                    <InputField
                      label="PayPal Secret"
                      name="paypalSecret"
                      type="password"
                      value=""
                      onChange={() => {}}
                      placeholder="EC..."
                    />
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="paypal-sandbox"
                          name="paypal-sandbox"
                          type="checkbox"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="paypal-sandbox" className="font-medium text-gray-700">
                          Enable Sandbox Mode
                        </label>
                        <p className="text-gray-500">Use PayPal sandbox for testing</p>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <SaveButton 
                        onClick={handleSaveSettings} 
                        loading={saving} 
                        success={saveSuccess}
                        error={saveError}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <InputField
                      label="Bank Name"
                      name="bankName"
                      value=""
                      onChange={() => {}}
                      placeholder="e.g. Chase Bank"
                    />
                    
                    <InputField
                      label="Account Name"
                      name="accountName"
                      value=""
                      onChange={() => {}}
                      placeholder="Your Company Name"
                    />
                    
                    <InputField
                      label="Account Number"
                      name="accountNumber"
                      value=""
                      onChange={() => {}}
                      placeholder="1234567890"
                    />
                    
                    <InputField
                      label="Routing Number (US) / Sort Code (UK)"
                      name="routingNumber"
                      value=""
                      onChange={() => {}}
                      placeholder="e.g. 123456789"
                    />
                    
                    <InputField
                      label="IBAN (International)"
                      name="iban"
                      value=""
                      onChange={() => {}}
                      placeholder="e.g. GB29 NWBK 6016 1331 9268 19"
                    />
                    
                    <InputField
                      label="SWIFT/BIC Code"
                      name="swiftBic"
                      value=""
                      onChange={() => {}}
                      placeholder="e.g. NWBKGB2L"
                    />
                    
                    <div className="pt-4">
                      <SaveButton 
                        onClick={handleSaveSettings} 
                        loading={saving} 
                        success={saveSuccess}
                        error={saveError}
                      />
                    </div>
                  </div>
                )}
              </SettingSection>
            </div>
          )}
          
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <SettingSection
                title="Google Analytics"
                description="Track visitors and get insights about your website traffic"
                icon={<GlobeAltIcon />}
              >
                <div className="space-y-4">
                  <InputField
                    label="Google Analytics Tracking ID"
                    name="gaTrackingId"
                    value=""
                    onChange={() => {}}
                    placeholder="UA-XXXXXXXXX-X"
                    description="Your Google Analytics 4 Measurement ID (starts with 'G-' or 'UA-') or your Universal Analytics Tracking ID (starts with 'UA-') "
                  />
                  
                  <div className="pt-4">
                    <SaveButton 
                      onClick={handleSaveSettings} 
                      loading={saving} 
                      success={saveSuccess}
                      error={saveError}
                    />
                  </div>
                </div>
              </SettingSection>
              
              <SettingSection
                title="Google reCAPTCHA"
                description="Protect your forms from spam and abuse"
                icon={<ShieldCheckIcon />}
              >
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="recaptcha-enabled"
                        name="recaptcha-enabled"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="recaptcha-enabled" className="font-medium text-gray-700">
                        Enable reCAPTCHA
                      </label>
                      <p className="text-gray-500">Protect your forms from spam and abuse</p>
                    </div>
                  </div>
                  
                  <InputField
                    label="reCAPTCHA Site Key"
                    name="recaptchaSiteKey"
                    value=""
                    onChange={() => {}}
                    placeholder="6Lc..."
                  />
                  
                  <InputField
                    label="reCAPTCHA Secret Key"
                    name="recaptchaSecretKey"
                    type="password"
                    value=""
                    onChange={() => {}}
                    placeholder="6Lc..."
                  />
                  
                  <p className="text-sm text-gray-500">
                    Get your reCAPTCHA v2 keys from the{' '}
                    <a 
                      href="https://www.google.com/recaptcha/admin" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      Google reCAPTCHA Admin Console
                    </a>.
                  </p>
                  
                  <div className="pt-4">
                    <SaveButton 
                      onClick={handleSaveSettings} 
                      loading={saving} 
                      success={saveSuccess}
                      error={saveError}
                    />
                  </div>
                </div>
              </SettingSection>
              
              <SettingSection
                title="Email Service"
                description="Configure how your application sends emails"
                icon={<EnvelopeIcon />}
              >
                <div className="space-y-4">
                  <SelectField
                    label="Mail Driver"
                    name="mailDriver"
                    value="smtp"
                    onChange={() => {}}
                    options={[
                      { value: 'smtp', label: 'SMTP' },
                      { value: 'mailgun', label: 'Mailgun' },
                      { value: 'ses', label: 'Amazon SES' },
                      { value: 'sendmail', label: 'Sendmail' },
                      { value: 'mail', label: 'PHP Mail' },
                    ]}
                  />
                  
                  <InputField
                    label="Mail Host"
                    name="mailHost"
                    value="smtp.mailtrap.io"
                    onChange={() => {}}
                    placeholder="smtp.mailtrap.io"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="Mail Port"
                      name="mailPort"
                      type="number"
                      value="2525"
                      onChange={() => {}}
                      placeholder="2525"
                    />
                    
                    <SelectField
                      label="Encryption"
                      name="mailEncryption"
                      value="tls"
                      onChange={() => {}}
                      options={[
                        { value: 'tls', label: 'TLS' },
                        { value: 'ssl', label: 'SSL' },
                        { value: '', label: 'None' },
                      ]}
                    />
                  </div>
                  
                  <InputField
                    label="Mail Username"
                    name="mailUsername"
                    value=""
                    onChange={() => {}}
                    placeholder="Your SMTP username"
                  />
                  
                  <InputField
                    label="Mail Password"
                    name="mailPassword"
                    type="password"
                    value=""
                    onChange={() => {}}
                    placeholder="Your SMTP password"
                  />
                  
                  <InputField
                    label="Mail From Address"
                    name="mailFromAddress"
                    type="email"
                    value="noreply@example.com"
                    onChange={() => {}}
                    placeholder="noreply@example.com"
                  />
                  
                  <InputField
                    label="Mail From Name"
                    name="mailFromName"
                    value="Sahara Student Services"
                    onChange={() => {}}
                    placeholder="Your Application Name"
                  />
                  
                  <div className="pt-4">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Send Test Email
                    </button>
                    
                    <p className="mt-2 text-sm text-gray-500">
                      Send a test email to verify your settings
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <SaveButton 
                      onClick={handleSaveSettings} 
                      loading={saving} 
                      success={saveSuccess}
                      error={saveError}
                    />
                  </div>
                </div>
              </SettingSection>
            </div>
          )}
          
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <SettingSection
                title="Cache"
                description="Manage the application cache"
                icon={<Cog6ToothIcon />}
              >
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Application Cache</h4>
                        <p className="text-sm text-gray-500">Clear the application cache to free up memory</p>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <ArrowPathIcon className="-ml-0.5 mr-2 h-4 w-4" />
                        Clear Cache
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">View Cache</h4>
                        <p className="text-sm text-gray-500">View cached data and configuration</p>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        View Cache
                      </button>
                    </div>
                  </div>
                </div>
              </SettingSection>
              
              <SettingSection
                title="Maintenance Mode"
                description="Take your application offline for maintenance"
                icon={<Cog6ToothIcon />}
              >
                <div className="space-y-4">
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          When maintenance mode is enabled, only administrators will be able to access the site.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Enable Maintenance Mode</h4>
                      <p className="text-sm text-gray-500">
                        Put the application into maintenance mode
                      </p>
                    </div>
                    <button
                      type="button"
                      className={`${maintenanceMode ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                      onClick={() => setMaintenanceMode(!maintenanceMode)}
                    >
                      <span className="sr-only">Use setting</span>
                      <span
                        aria-hidden="true"
                        className={`${maintenanceMode ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                  
                  <div className="pt-4">
                    <SaveButton 
                      onClick={handleSaveSettings} 
                      loading={saving} 
                      success={saveSuccess}
                      error={saveError}
                    />
                  </div>
                </div>
              </SettingSection>
              
              <SettingSection
                title="Backup & Restore"
                description="Backup your application data and settings"
                icon={<ArrowPathIcon />}
              >
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Create Backup</h4>
                        <p className="text-sm text-gray-500">Create a complete backup of your application</p>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Create Backup
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Restore from Backup</h4>
                        <p className="text-sm text-gray-500">Restore your application from a previous backup</p>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Scheduled Backups</h4>
                        <p className="text-sm text-gray-500">Set up automatic backups</p>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
              </SettingSection>
              
              <SettingSection
                title="System Information"
                description="View system information and logs"
                icon={<Cog6ToothIcon />}
              >
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">PHP Version</h4>
                      <p className="mt-1 text-sm text-gray-900">8.1.0</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Laravel Version</h4>
                      <p className="mt-1 text-sm text-gray-900">9.0.0</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Server Software</h4>
                      <p className="mt-1 text-sm text-gray-900">Apache/2.4.41 (Ubuntu)</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Database</h4>
                      <p className="mt-1 text-sm text-gray-900">MySQL 8.0.28-0ubuntu0.20.04.3</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Environment</h4>
                      <p className="mt-1 text-sm text-gray-900">Production</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Debug Mode</h4>
                      <p className="mt-1 text-sm text-gray-900">Off</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Logs</h4>
                    <div className="bg-black text-green-400 font-mono text-xs p-4 rounded-md overflow-x-auto">
                      <pre>
                        [2023-04-15 10:30:45] local.INFO: Application started
                        [2023-04-15 10:31:12] local.INFO: User logged in (ID: 1)
                        [2023-04-15 10:35:21] local.INFO: Settings updated
                      </pre>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        View All Logs
                      </button>
                    </div>
                  </div>
                </div>
              </SettingSection>
            </div>
          )}
          
          {activeTab === 'roles' && (
            <div className="space-y-6">
              <SettingSection
                title="Roles & Permissions"
                description="Manage user roles and their permissions"
                icon={<ShieldCheckIcon />}
              >
                <div className="space-y-6">
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      <li>
                            <div className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-indigo-600 truncate">
                                  Administrator
                                </p>
                                <div className="ml-2 flex-shrink-0 flex">
                                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Default Role
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                  <p className="flex items-center text-sm text-gray-500">
                                    Full access to all features and settings
                                  </p>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                  <button
                                    type="button"
                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-700"
                                    disabled
                                  >
                                    <span className="sr-only">Delete</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-indigo-600 truncate">
                                  Student
                                </p>
                              </div>
                              <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                  <p className="flex items-center text-sm text-gray-500">
                                    Can view and apply to courses
                                  </p>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                  <button
                                    type="button"
                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    <span className="sr-only">Delete</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-indigo-600 truncate">
                                  Instructor
                                </p>
                              </div>
                              <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                  <p className="flex items-center text-sm text-gray-500">
                                    Can create and manage courses
                                  </p>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                  <button
                                    type="button"
                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    <span className="sr-only">Delete</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                          Add New Role
                        </button>
                      </div>
                    </div>
                  </SettingSection>
                  
                  <SettingSection
                    title="Permission Groups"
                    description="Manage permission groups and their assignments"
                    icon={<ShieldCheckIcon />}
                  >
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                      <ul className="divide-y divide-gray-200">
                        <li>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-indigo-600 truncate">
                                Content Management
                              </p>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">
                                  Manage pages, posts, and media
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <button
                                  type="button"
                                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                                >
                                  Edit Permissions
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-indigo-600 truncate">
                                User Management
                              </p>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">
                                  Manage users, roles, and permissions
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <button
                                  type="button"
                                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                                >
                                  Edit Permissions
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-indigo-600 truncate">
                                Course Management
                              </p>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">
                                  Create and manage courses and lessons
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <button
                                  type="button"
                                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                                >
                                  Edit Permissions
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        Add New Permission Group
                      </button>
                    </div>
                  </SettingSection>
                </div>
              )}
            </div>
          </div>
        </DashboardLayout>
      );
    };

// Wrap the component with error boundary
const SettingsPageWrapper = () => (
  <ErrorBoundary>
    <SettingsPage />
  </ErrorBoundary>
);

export default SettingsPageWrapper;
