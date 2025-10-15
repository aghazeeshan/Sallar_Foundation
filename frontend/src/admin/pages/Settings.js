import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('theme');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Theme Settings State
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: '#012a23',
    secondaryColor: '#eb9801',
    textDark: '#333333',
    textLight: '#666666'
  });

  // Logo Settings State
  const [logoSettings, setLogoSettings] = useState({
    headerLogo: null,
    stickyLogo: null,
    footerLogo: null,
    favicon: null
  });

  const [logoPreview, setLogoPreview] = useState({
    headerLogo: '',
    stickyLogo: '',
    footerLogo: '',
    favicon: ''
  });

  // Email Settings State
  const [emailSettings, setEmailSettings] = useState({
    adminEmail: '',
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPassword: '',
    sendDonationEmail: true,
    sendContactEmail: true,
    sendVolunteerEmail: true
  });

  useEffect(() => {
    loadSettings();
  }, [activeTab]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      // Load settings based on active tab
      const response = await fetch(`http://localhost:5000/api/settings/${activeTab}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (activeTab === 'theme' && data.data) {
          setThemeSettings(data.data);
          applyTheme(data.data);
        } else if (activeTab === 'logo' && data.data) {
          setLogoPreview(data.data);
        } else if (activeTab === 'email' && data.data) {
          setEmailSettings(data.data);
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    setLoading(false);
  };

  const applyTheme = (colors) => {
    Object.entries(colors).forEach(([property, value]) => {
        document.documentElement.style.setProperty(`--${property}`, value);
    });
  };

  // Theme Settings Handlers
  const handleThemeChange = (property, value) => {
    const newTheme = { ...themeSettings, [property]: value };
    setThemeSettings(newTheme);
    applyTheme(newTheme);
  };

  const handleThemeSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/settings/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(themeSettings)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Theme settings saved successfully!' });
        localStorage.setItem('themeColors', JSON.stringify(themeSettings));
      } else {
        setMessage({ type: 'error', text: 'Failed to save theme settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving theme settings' });
    }
    setLoading(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleThemeReset = () => {
    const defaultTheme = {
      primaryColor: '#012a23',
      secondaryColor: '#eb9801',
      textDark: '#333333',
      textLight: '#666666'
    };
    setThemeSettings(defaultTheme);
    applyTheme(defaultTheme);
    localStorage.removeItem('themeColors');
  };

  // Logo Settings Handlers
  const handleLogoChange = (type, file) => {
    if (file) {
      setLogoSettings({ ...logoSettings, [type]: file });
      setLogoPreview({ ...logoPreview, [type]: URL.createObjectURL(file) });
    }
  };

  const handleLogoSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      
      Object.entries(logoSettings).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });

      const response = await fetch('http://localhost:5000/api/settings/logo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Logos updated successfully!' });
        loadSettings();
      } else {
        setMessage({ type: 'error', text: 'Failed to update logos' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating logos' });
    }
    setLoading(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Email Settings Handlers
  const handleEmailChange = (field, value) => {
    setEmailSettings({ ...emailSettings, [field]: value });
  };

  const handleEmailSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/settings/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(emailSettings)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Email settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save email settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving email settings' });
    }
    setLoading(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleTestEmail = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/settings/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: emailSettings.adminEmail })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Test email sent successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to send test email' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error sending test email' });
    }
    setLoading(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <div className="settings-page">
      <div className="content-header">
        <h1>Settings</h1>
        <p>Manage website settings and configurations</p>
        </div>

      {/* Tabs */}
      <div className="settings-tabs">
        <button 
          className={`tab-button ${activeTab === 'theme' ? 'active' : ''}`}
          onClick={() => setActiveTab('theme')}
        >
          <i className="fas fa-palette"></i>
          <span>Theme</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'logo' ? 'active' : ''}`}
          onClick={() => setActiveTab('logo')}
        >
          <i className="fas fa-image"></i>
          <span>Logos</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'email' ? 'active' : ''}`}
          onClick={() => setActiveTab('email')}
        >
          <i className="fas fa-envelope"></i>
          <span>Email</span>
        </button>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert alert-${message.type}`}>
          <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
          {message.text}
        </div>
      )}

      {/* Theme Settings Tab */}
      {activeTab === 'theme' && (
        <div className="settings-content">
        <div className="settings-card">
            <h3><i className="fas fa-palette"></i> Theme Colors</h3>
            <div className="color-settings-grid">
            <div className="color-group">
              <label>Primary Color</label>
                <div className="color-input-wrapper">
                <input 
                  type="color" 
                    value={themeSettings.primaryColor}
                    onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                  />
                  <input 
                    type="text" 
                    value={themeSettings.primaryColor}
                    onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                    className="color-hex"
                  />
              </div>
            </div>

            <div className="color-group">
              <label>Secondary Color</label>
                <div className="color-input-wrapper">
                <input 
                  type="color" 
                    value={themeSettings.secondaryColor}
                    onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                  />
                  <input 
                    type="text" 
                    value={themeSettings.secondaryColor}
                    onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                    className="color-hex"
                  />
              </div>
            </div>

            <div className="color-group">
              <label>Text Dark</label>
                <div className="color-input-wrapper">
                <input 
                  type="color" 
                    value={themeSettings.textDark}
                    onChange={(e) => handleThemeChange('textDark', e.target.value)}
                  />
                  <input 
                    type="text" 
                    value={themeSettings.textDark}
                    onChange={(e) => handleThemeChange('textDark', e.target.value)}
                    className="color-hex"
                  />
              </div>
            </div>

            <div className="color-group">
              <label>Text Light</label>
                <div className="color-input-wrapper">
                <input 
                  type="color" 
                    value={themeSettings.textLight}
                    onChange={(e) => handleThemeChange('textLight', e.target.value)}
                  />
                  <input 
                    type="text" 
                    value={themeSettings.textLight}
                    onChange={(e) => handleThemeChange('textLight', e.target.value)}
                    className="color-hex"
                  />
            </div>
          </div>
        </div>

            <div className="settings-preview">
              <h4>Preview</h4>
              <div className="preview-buttons">
                <button style={{ backgroundColor: themeSettings.primaryColor }}>Primary Button</button>
                <button style={{ backgroundColor: themeSettings.secondaryColor }}>Secondary Button</button>
              </div>
              <div className="preview-text">
                <p style={{ color: themeSettings.textDark }}>Dark Text Sample</p>
                <p style={{ color: themeSettings.textLight }}>Light Text Sample</p>
              </div>
            </div>

            <div className="settings-actions">
              <button className="btn btn-secondary" onClick={handleThemeReset}>
                <i className="fas fa-undo"></i> Reset to Default
              </button>
              <button className="btn btn-primary" onClick={handleThemeSave} disabled={loading}>
                <i className="fas fa-save"></i> {loading ? 'Saving...' : 'Save Theme'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logo Settings Tab */}
      {activeTab === 'logo' && (
        <div className="settings-content">
          <div className="settings-card">
            <h3><i className="fas fa-image"></i> Logo Management</h3>
            
            <div className="logo-settings-grid">
              <div className="logo-upload-group">
                <label>Header Logo</label>
                <div className="logo-upload-box">
                  {logoPreview.headerLogo && (
                    <img src={logoPreview.headerLogo} alt="Header Logo" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleLogoChange('headerLogo', e.target.files[0])}
                    id="headerLogo"
                  />
                  <label htmlFor="headerLogo" className="upload-label">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <span>Upload Header Logo</span>
                  </label>
                </div>
                <p className="help-text">Recommended: PNG, 200x50px</p>
              </div>

              <div className="logo-upload-group">
                <label>Sticky Header Logo</label>
                <div className="logo-upload-box">
                  {logoPreview.stickyLogo && (
                    <img src={logoPreview.stickyLogo} alt="Sticky Logo" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleLogoChange('stickyLogo', e.target.files[0])}
                    id="stickyLogo"
                  />
                  <label htmlFor="stickyLogo" className="upload-label">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <span>Upload Sticky Logo</span>
                  </label>
                </div>
                <p className="help-text">Recommended: PNG, 200x50px (light version)</p>
              </div>

              <div className="logo-upload-group">
                <label>Footer Logo</label>
                <div className="logo-upload-box">
                  {logoPreview.footerLogo && (
                    <img src={logoPreview.footerLogo} alt="Footer Logo" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleLogoChange('footerLogo', e.target.files[0])}
                    id="footerLogo"
                  />
                  <label htmlFor="footerLogo" className="upload-label">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <span>Upload Footer Logo</span>
                  </label>
                </div>
                <p className="help-text">Recommended: PNG, 200x50px (light version)</p>
              </div>

              <div className="logo-upload-group">
                <label>Favicon</label>
                <div className="logo-upload-box favicon-box">
                  {logoPreview.favicon && (
                    <img src={logoPreview.favicon} alt="Favicon" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleLogoChange('favicon', e.target.files[0])}
                    id="favicon"
                  />
                  <label htmlFor="favicon" className="upload-label">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <span>Upload Favicon</span>
                  </label>
                </div>
                <p className="help-text">Recommended: PNG/ICO, 32x32px</p>
              </div>
            </div>

            <div className="settings-actions">
              <button className="btn btn-primary" onClick={handleLogoSave} disabled={loading}>
                <i className="fas fa-save"></i> {loading ? 'Uploading...' : 'Save Logos'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Settings Tab */}
      {activeTab === 'email' && (
        <div className="settings-content">
          <div className="settings-card">
            <h3><i className="fas fa-envelope"></i> Email Configuration</h3>
            
            <div className="email-settings-form">
              <div className="form-group">
                <label>Admin Email</label>
                <input 
                  type="email" 
                  value={emailSettings.adminEmail}
                  onChange={(e) => handleEmailChange('adminEmail', e.target.value)}
                  placeholder="admin@sallarfoundation.org"
                />
                <p className="help-text">Email address to receive form submissions</p>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>SMTP Host</label>
                  <input 
                    type="text" 
                    value={emailSettings.smtpHost}
                    onChange={(e) => handleEmailChange('smtpHost', e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div className="form-group">
                  <label>SMTP Port</label>
                  <input 
                    type="number" 
                    value={emailSettings.smtpPort}
                    onChange={(e) => handleEmailChange('smtpPort', e.target.value)}
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>SMTP Username</label>
                <input 
                  type="text" 
                  value={emailSettings.smtpUser}
                  onChange={(e) => handleEmailChange('smtpUser', e.target.value)}
                  placeholder="your-email@gmail.com"
                />
              </div>

              <div className="form-group">
                <label>SMTP Password</label>
                <input 
                  type="password" 
                  value={emailSettings.smtpPassword}
                  onChange={(e) => handleEmailChange('smtpPassword', e.target.value)}
                  placeholder="••••••••"
                />
                <p className="help-text">Use App Password for Gmail</p>
              </div>

              <div className="email-notifications">
                <h4>Email Notifications</h4>
                <div className="notification-toggles">
                  <label className="toggle-label">
                    <input 
                      type="checkbox" 
                      checked={emailSettings.sendDonationEmail}
                      onChange={(e) => handleEmailChange('sendDonationEmail', e.target.checked)}
                    />
                    <span>Send emails for donation submissions</span>
                  </label>

                  <label className="toggle-label">
                    <input 
                      type="checkbox" 
                      checked={emailSettings.sendContactEmail}
                      onChange={(e) => handleEmailChange('sendContactEmail', e.target.checked)}
                    />
                    <span>Send emails for contact form submissions</span>
                  </label>

                  <label className="toggle-label">
                    <input 
                      type="checkbox" 
                      checked={emailSettings.sendVolunteerEmail}
                      onChange={(e) => handleEmailChange('sendVolunteerEmail', e.target.checked)}
                    />
                    <span>Send emails for volunteer applications</span>
                  </label>
                </div>
          </div>
        </div>

        <div className="settings-actions">
              <button className="btn btn-secondary" onClick={handleTestEmail} disabled={loading}>
                <i className="fas fa-paper-plane"></i> Send Test Email
          </button>
              <button className="btn btn-primary" onClick={handleEmailSave} disabled={loading}>
                <i className="fas fa-save"></i> {loading ? 'Saving...' : 'Save Email Settings'}
          </button>
        </div>
      </div>
        </div>
      )}
    </div>
  );
};

export default Settings; 
