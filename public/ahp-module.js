/**
 * AHP Module 2.0 - Client-side Registration and Bot Tracking Script
 * Updated for Cloudflare Worker Infrastructure
 * 
 * This script provides:
 * 1. AI bot detection and tracking
 * 2. User registration via modal popup
 * 3. Improved UX with immediate feedback and persistent state tracking
 */

(function() {
  'use strict';

  // Configuration - Updated for new Cloudflare Worker infrastructure
  const config = {
    apiBaseUrl: 'https://ahp-email-scheduler.vicsicard.workers.dev',
    trackingEndpoint: '/track-bot',
    pendingFixesEndpoint: '/api/pending-fixes',
    registrationEndpoint: '/registration',
    registrationWorker: 'https://ahp-email-scheduler.vicsicard.workers.dev/registration',
    botTrackingWorker: 'https://ahp-email-scheduler.vicsicard.workers.dev/track-bot',
    storageKey: 'ahp_module_registration',
    sessionIdCookie: 'ahp_bot_session_id',
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    autoInit: true
  };

  // Parse script tag attributes
  const scriptTag = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  if (scriptTag) {
    config.autoInit = scriptTag.getAttribute('data-auto-init') !== 'false';
    
    // Allow overriding the API base URL
    const customApiUrl = scriptTag.getAttribute('data-api-base');
    if (customApiUrl) {
      config.apiBaseUrl = customApiUrl;
      config.registrationWorker = customApiUrl + '/registration';
      config.botTrackingWorker = customApiUrl + '/track-bot';
    }
  }

  // Utility functions
  const utils = {
    setCookie: function(name, value, days) {
      let expires = '';
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
      }
      document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; SameSite=Lax';
    },
    
    getCookie: function(name) {
      const nameEQ = name + '=';
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
      return null;
    },
    
    setLocalStorage: function(key, value, expirationDays) {
      try {
        const item = {
          value: value,
          expiry: expirationDays ? new Date().getTime() + (expirationDays * 24 * 60 * 60 * 1000) : null,
          timestamp: new Date().getTime()
        };
        localStorage.setItem(key, JSON.stringify(item));
        return true;
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
        return false;
      }
    },
    
    getLocalStorage: function(key) {
      try {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;
        
        const item = JSON.parse(itemStr);
        
        if (item.expiry && new Date().getTime() > item.expiry) {
          localStorage.removeItem(key);
          return null;
        }
        
        return item.value;
      } catch (e) {
        console.error('Error reading from localStorage:', e);
        try {
          localStorage.removeItem(key);
        } catch (cleanupError) {
          console.error('Failed to cleanup corrupted localStorage:', cleanupError);
        }
        return null;
      }
    },
    
    generateUUID: function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    
    ajax: function(url, method, data) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (e) {
              resolve(xhr.responseText);
            }
          } else {
            reject({
              status: xhr.status,
              statusText: xhr.statusText
            });
          }
        };
        
        xhr.onerror = function() {
          reject({
            status: xhr.status,
            statusText: xhr.statusText
          });
        };
        
        if (data) {
          xhr.send(JSON.stringify(data));
        } else {
          xhr.send();
        }
      });
    }
  };

  // AI Bot patterns database
  const AI_BOT_PATTERNS = [
    {
      name: 'ChatGPT',
      patterns: ['gptbot', 'chatgpt', 'openai', 'gpt-3', 'gpt-4', 'gpt-crawler'],
      confidence: 0.98,
      category: 'ai_assistant'
    },
    {
      name: 'Claude',
      patterns: ['claude', 'anthropic', 'claude-web', 'anthropic-ai'],
      confidence: 0.98,
      category: 'ai_assistant'
    },
    {
      name: 'Perplexity',
      patterns: ['perplexity', 'perplexitybot', 'perplexity-ai'],
      confidence: 0.98,
      category: 'search_ai'
    },
    {
      name: 'Gemini',
      patterns: ['gemini', 'bard', 'google-ai', 'gemini-pro'],
      confidence: 0.95,
      category: 'ai_assistant'
    }
  ];

  // Bot detection module
  const botDetection = {
    detectBotType: function() {
      const userAgent = navigator.userAgent.toLowerCase();
      
      for (const botPattern of AI_BOT_PATTERNS) {
        for (const pattern of botPattern.patterns) {
          if (userAgent.includes(pattern.toLowerCase())) {
            return {
              name: botPattern.name,
              confidence: botPattern.confidence,
              method: 'user_agent_primary',
              category: botPattern.category
            };
          }
        }
      }
      return null;
    },

    trackBotVisit: async function(detectionResult) {
      const visitData = {
        sessionId: utils.generateUUID(),
        url: window.location.href,
        referrer: document.referrer,
        title: document.title,
        timestamp: new Date().toISOString(),
        siteUrl: window.location.hostname,
        botType: detectionResult.name || 'Unknown',
        confidence: detectionResult.confidence || 0.5,
        detectionMethod: detectionResult.method || 'legacy',
        category: detectionResult.category || 'unknown',
        userAgent: navigator.userAgent
      };
      
      try {
        const response = await fetch(config.botTrackingWorker, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(visitData)
        });
        
        if (response.ok) {
          console.log('Bot visit tracked successfully');
        }
      } catch (error) {
        console.error('Error tracking bot visit:', error);
      }
    },

    detectAndTrackBot: async function() {
      const detectionResult = this.detectBotType();
      if (detectionResult) {
        console.log('AI Bot detected:', detectionResult);
        await this.trackBotVisit(detectionResult);
        return detectionResult;
      }
      return null;
    }
  };

  // Registration module
  const registration = {
    isRegistered: function() {
      const stored = utils.getLocalStorage(config.storageKey);
      const cookieFlag = utils.getCookie('ahp_registered');
      // More robust check to ensure we properly detect registration status
      return (stored && stored.registered === true) || cookieFlag === 'true';
    },

    markAsRegistered: function(email, customerCode) {
      const registrationData = {
        registered: true,
        email: email,
        customerCode: customerCode || null,
        timestamp: new Date().toISOString(),
        domain: window.location.hostname
      };
      
      // Ensure we're properly setting both storage mechanisms
      const localStorageSuccess = utils.setLocalStorage(config.storageKey, registrationData, 365);
      utils.setCookie('ahp_registered', 'true', 365);
      
      // Log registration status for debugging
      console.log('Registration marked complete:', { 
        localStorageSuccess, 
        cookieSet: true,
        email: email
      });
      
      return true;
    },

    showModal: function() {
      if (this.isRegistered()) return;
      
      let modalContainer = document.getElementById('ahp-registration-modal');
      if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'ahp-registration-modal';
        modalContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.5);z-index:9999;display:flex;justify-content:center;align-items:center;';
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = 'background-color:#fff;padding:30px;border-radius:8px;max-width:500px;width:90%;box-shadow:0 4px 12px rgba(0,0,0,0.15);position:relative;';
        
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.cssText = 'position:absolute;top:10px;right:15px;background:none;border:none;font-size:24px;cursor:pointer;';
        closeButton.onclick = this.hideModal.bind(this);
        
        const modalHeader = document.createElement('h2');
        modalHeader.textContent = scriptTag.getAttribute('data-modal-title') || 'Register for AHP Module 2.0';
        modalHeader.style.cssText = 'margin-top:0;color:#333;font-size:24px;';
        
        const modalDescription = document.createElement('p');
        modalDescription.textContent = scriptTag.getAttribute('data-modal-description') || 'Enhance your website\'s visibility to AI systems.';
        modalDescription.style.cssText = 'margin-bottom:20px;color:#666;';
        
        const form = document.createElement('form');
        form.id = 'ahp-registration-form';
        form.onsubmit = this.handleSubmit.bind(this);
        
        // Name field
        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Name:';
        nameLabel.style.cssText = 'display:block;margin-bottom:5px;font-weight:bold;';
        
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.name = 'name';
        nameInput.required = true;
        nameInput.style.cssText = 'width:100%;padding:10px;margin-bottom:15px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;';
        
        // Email field
        const emailLabel = document.createElement('label');
        emailLabel.textContent = 'Email:';
        emailLabel.style.cssText = 'display:block;margin-bottom:5px;font-weight:bold;';
        
        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.name = 'email';
        emailInput.required = true;
        emailInput.style.cssText = 'width:100%;padding:10px;margin-bottom:15px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;';
        
        // Customer code field (conditionally shown)
        let customerCodeLabel, customerCodeInput, customerCodeHelp;
        if (scriptTag.getAttribute('data-show-customer-code') === 'true') {
          customerCodeLabel = document.createElement('label');
          customerCodeLabel.textContent = 'Customer Code:';
          customerCodeLabel.style.cssText = 'display:block;margin-bottom:5px;font-weight:bold;';
          
          customerCodeInput = document.createElement('input');
          customerCodeInput.type = 'text';
          customerCodeInput.name = 'customerCode';
          customerCodeInput.placeholder = 'Optional - leave blank if you don\'t have a code';
          customerCodeInput.style.cssText = 'width:100%;padding:10px;margin-bottom:5px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;';
          
          customerCodeHelp = document.createElement('p');
          customerCodeHelp.textContent = 'If you don\'t have a customer code, leave this field blank';
          customerCodeHelp.style.cssText = 'margin:0 0 15px 0;color:#666;font-size:12px;font-style:italic;';
        }
        
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Register';
        submitButton.style.cssText = 'background-color:#4a90e2;color:#fff;border:none;padding:12px 20px;border-radius:4px;cursor:pointer;font-size:16px;';
        
        const statusMessage = document.createElement('div');
        statusMessage.id = 'ahp-registration-status';
        statusMessage.style.cssText = 'margin-top:15px;padding:10px;border-radius:4px;display:none;';
        
        form.appendChild(nameLabel);
        form.appendChild(nameInput);
        form.appendChild(emailLabel);
        form.appendChild(emailInput);
        
        if (customerCodeLabel) {
          form.appendChild(customerCodeLabel);
          form.appendChild(customerCodeInput);
          form.appendChild(customerCodeHelp);
        }
        
        form.appendChild(submitButton);
        
        modalContent.appendChild(closeButton);
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalDescription);
        modalContent.appendChild(form);
        modalContent.appendChild(statusMessage);
        
        modalContainer.appendChild(modalContent);
        document.body.appendChild(modalContainer);
      } else {
        modalContainer.style.display = 'flex';
      }
    },

    hideModal: function() {
      const modalContainer = document.getElementById('ahp-registration-modal');
      if (modalContainer) {
        modalContainer.style.display = 'none';
      }
    },

    showStatus: function(message, isError) {
      const statusElement = document.getElementById('ahp-registration-status');
      if (statusElement) {
        statusElement.textContent = message;
        statusElement.style.display = 'block';
        statusElement.style.backgroundColor = isError ? '#ffebee' : '#e8f5e9';
        statusElement.style.color = isError ? '#c62828' : '#2e7d32';
        statusElement.style.border = isError ? '1px solid #ffcdd2' : '1px solid #c8e6c9';
      }
    },

    handleSubmit: function(event) {
      event.preventDefault();
      
      const form = document.getElementById('ahp-registration-form');
      if (!form) return;
      
      const formData = {
        name: form.elements.name.value,
        email: form.elements.email.value,
        customerCode: form.elements.customerCode ? form.elements.customerCode.value.trim() || null : null,
        siteUrl: window.location.hostname,
        timestamp: new Date().toISOString()
      };
      
      // Mark as registered immediately
      this.markAsRegistered(formData.email, formData.customerCode);
      
      // Show success message
      this.showStatus('Thank you! Your registration has been submitted. Please check your email for confirmation.', false);
      
      // Close modal after delay
      setTimeout(() => {
        this.hideModal();
      }, 3000);
      
      // Submit to server
      utils.ajax(config.registrationWorker, 'POST', formData)
        .then(() => {
          console.log('Registration submitted successfully');
        })
        .catch(error => {
          console.error('Error submitting registration:', error);
        });
    },

    init: function() {
      // Double-check registration status
      if (this.isRegistered()) {
        console.log('User already registered, skipping modal');
        return;
      }
      
      // Show modal after delay with another registration check
      setTimeout(() => {
        // Check again in case registration happened during the timeout
        if (!this.isRegistered()) {
          this.showModal();
        }
      }, 2000);
    }
  };

  // Main initialization
  function init() {
    console.log('AHP Module 2.0 initializing...');
    
    // Always run bot detection in background
    botDetection.detectAndTrackBot().then(function(botType) {
      if (botType) {
        console.log('Bot detected:', botType);
      } else {
        console.log('No bot detected - human visitor');
      }
    }).catch(function(error) {
      console.error('Bot detection error:', error);
    });
    
    // Check registration status for modal
    if (registration.isRegistered()) {
      console.log('User already registered, skipping modal');
    } else {
      // Initialize registration modal for unregistered users
      if (config.autoInit) {
        registration.init();
      }
    }
    
    console.log('AHP Module 2.0 initialized');
  }

  // Expose public API
  window.AHPModule = {
    showRegistrationModal: registration.showModal.bind(registration),
    hideRegistrationModal: registration.hideModal.bind(registration),
    isRegistered: registration.isRegistered.bind(registration),
    markAsRegistered: registration.markAsRegistered.bind(registration),
    detectBot: botDetection.detectAndTrackBot.bind(botDetection),
    
    getCustomerCode: function() {
      const stored = utils.getLocalStorage(config.storageKey);
      return stored ? stored.customerCode : null;
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
