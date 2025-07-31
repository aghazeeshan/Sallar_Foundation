import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = () => {
  const [colors, setColors] = useState({
    primaryColor: '#012a23',
    secondaryColor: '#eb9801',
    textDark: '#333333',
    textLight: '#666666',
    bgLight: '#f8f9fa',
    white: '#ffffff'
  });

  // Load saved colors on component mount
  useEffect(() => {
    const savedColors = localStorage.getItem('themeColors');
    if (savedColors) {
      const parsedColors = JSON.parse(savedColors);
      setColors(parsedColors);
      // Apply saved colors
      Object.entries(parsedColors).forEach(([property, value]) => {
        document.documentElement.style.setProperty(`--${property}`, value);
        if (property === 'primaryColor') {
          document.documentElement.style.setProperty('--primary-dark', value);
        }
      });
    }
  }, []);

  const handleColorChange = (property, value) => {
    const newColors = { ...colors, [property]: value };
    setColors(newColors);
    applyColors(newColors);
  };

  // Helper function to adjust color brightness
  const adjustColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;

    return '#' + (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
  };

  const handleReset = () => {
    const defaultColors = {
      primaryColor: '#012a23',
      secondaryColor: '#eb9801',
      textDark: '#333333',
      textLight: '#666666',
      bgLight: '#f8f9fa',
      white: '#ffffff'
    };

    setColors(defaultColors);
    
    // Apply default colors
    Object.entries(defaultColors).forEach(([property, value]) => {
      document.documentElement.style.setProperty(`--${property}`, value);
      if (property === 'primaryColor') {
        document.documentElement.style.setProperty('--primary-dark', value);
      }
    });

    // Clear saved colors
    localStorage.removeItem('themeColors');
  };

  const handleSave = () => {
    localStorage.setItem('themeColors', JSON.stringify(colors));
    applyColors(colors);
    
    // Force CSS refresh
    const styleSheets = document.styleSheets;
    for (let i = 0; i < styleSheets.length; i++) {
      try {
        const cssRules = styleSheets[i].cssRules;
        for (let j = 0; j < cssRules.length; j++) {
          const rule = cssRules[j];
          if (rule.style) {
            rule.style.cssText = rule.style.cssText;
          }
        }
      } catch (e) {
        console.log('Cannot access stylesheet', e);
      }
    }
    
    alert('Theme settings saved and applied successfully!');
  };

  const applyColors = (colors) => {
    // First, update CSS variables
    Object.entries(colors).forEach(([property, value]) => {
      document.documentElement.style.setProperty(`--${property}`, value);
      
      // Handle special cases
      switch(property) {
        case 'primaryColor':
          document.documentElement.style.setProperty('--primary-dark', value);
          document.documentElement.style.setProperty('--primary-hover', adjustColor(value, -10));
          break;
        case 'secondaryColor':
          document.documentElement.style.setProperty('--secondary-dark', adjustColor(value, -20));
          document.documentElement.style.setProperty('--secondary-hover', adjustColor(value, -10));
          break;
        default:
          break;
      }
    });

    // Force a repaint (fixed ESLint error)
    const { display } = document.body.style;
    document.body.style.display = 'none';
    // Force reflow by accessing offsetHeight
    const height = document.body.offsetHeight; // Store it to avoid the expression issue
    document.body.style.display = display || '';

    // Update specific elements that might need manual updating
    const elementsToUpdate = document.querySelectorAll('[class*="color"], [class*="bg-"], [style*="color"], [style*="background"]');
    elementsToUpdate.forEach(element => {
      element.style.color = '';
      element.style.backgroundColor = '';
    });
  };

  return (
    <div className="settings-page">
      <div className="content-header">
        <div className="header-left">
          <h1>Theme Settings</h1>
          <p>Customize website colors and appearance</p>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-card">
          <h3>Color Settings</h3>
          <div className="color-settings">
            <div className="color-group">
              <label>Primary Color</label>
              <div className="color-input">
                <input 
                  type="color" 
                  value={colors.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                />
                <span>{colors.primaryColor}</span>
              </div>
            </div>

            <div className="color-group">
              <label>Secondary Color</label>
              <div className="color-input">
                <input 
                  type="color" 
                  value={colors.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                />
                <span>{colors.secondaryColor}</span>
              </div>
            </div>

            <div className="color-group">
              <label>Text Dark</label>
              <div className="color-input">
                <input 
                  type="color" 
                  value={colors.textDark}
                  onChange={(e) => handleColorChange('textDark', e.target.value)}
                />
                <span>{colors.textDark}</span>
              </div>
            </div>

            <div className="color-group">
              <label>Text Light</label>
              <div className="color-input">
                <input 
                  type="color" 
                  value={colors.textLight}
                  onChange={(e) => handleColorChange('textLight', e.target.value)}
                />
                <span>{colors.textLight}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="preview-card">
          <h3>Live Preview</h3>
          <div className="preview-content">
            <button className="preview-btn primary">Primary Button</button>
            <button className="preview-btn secondary">Secondary Button</button>
            <p className="preview-text dark">Dark Text Example</p>
            <p className="preview-text light">Light Text Example</p>
          </div>
        </div>

        <div className="settings-actions">
          <button className="reset-btn" onClick={handleReset}>
            Reset to Default
          </button>
          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 