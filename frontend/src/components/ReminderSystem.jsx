import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Bell, BellOff, Clock } from 'lucide-react';

export const ReminderSystem = () => {
  const { triggerNotification } = useApp();
  const [reminderTime, setReminderTime] = useState(localStorage.getItem('study_reminder_time') || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(Notification.permission === 'granted');

  // Load reminder settings from server on mount
  useEffect(() => {
    async function loadReminderSettings() {
      try {
        const res = await api.getReminder();
        if (res && res.time) {
          setReminderTime(res.time);
          localStorage.setItem('study_reminder_time', res.time);
        }
      } catch (err) {
        console.error("Error fetching reminder from server:", err);
      }
    }
    loadReminderSettings();
  }, []);

  // Request browser permission for system notifications
  const requestPermission = async () => {
    if (!('Notification' in window)) {
      triggerNotification('Browser notifications are not supported in this browser.', 'red');
      return;
    }
    
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        triggerNotification('Notifications successfully enabled!', 'green');
      } else {
        setNotificationsEnabled(false);
        triggerNotification('Notification permission denied.', 'red');
      }
    } catch (err) {
      console.error("Error requesting notifications:", err);
    }
  };

  // Save the reminder time and check permissions
  const handleSaveReminder = async (e) => {
    e.preventDefault();
    try {
      if (reminderTime) {
        await api.saveReminder(reminderTime, true);
        localStorage.setItem('study_reminder_time', reminderTime);
        triggerNotification(`⏰ Study reminder set for ${reminderTime}!`, 'green');
        if (Notification.permission !== 'granted') {
          requestPermission();
        }
      } else {
        await api.saveReminder('', false);
        localStorage.removeItem('study_reminder_time');
        triggerNotification('⏰ Study reminder cleared.', 'yellow');
      }
    } catch (err) {
      console.error("Failed to save reminder settings:", err);
      triggerNotification('Failed to save reminder settings to server.', 'red');
    }
  };

  // Monitor time in the background
  useEffect(() => {
    const checkReminder = () => {
      const savedTime = localStorage.getItem('study_reminder_time');
      if (!savedTime) return;

      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeString = `${currentHours}:${currentMinutes}`;

      if (currentTimeString === savedTime) {
        // Ensure we only trigger once per minute
        const lastTriggered = localStorage.getItem('last_reminder_triggered');
        const todayDate = new Date().toDateString();
        
        if (lastTriggered !== `${todayDate} ${savedTime}`) {
          localStorage.setItem('last_reminder_triggered', `${todayDate} ${savedTime}`);
          
          // 1. Trigger in-app notification
          triggerNotification("🔔 Time to study! Open your daily study plan now.", "purple");
          
          // 2. Trigger browser-level notification
          if (Notification.permission === 'granted') {
            try {
              new Notification("Study Buddy ⏰", {
                body: "Study time! Complete today's learning plan and keep your streak alive!",
                tag: 'ap-study-reminder'
              });
            } catch (err) {
              console.error("Failed to trigger system notification:", err);
            }
          }
        }
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkReminder, 30000);
    checkReminder(); // Immediate check

    return () => clearInterval(interval);
  }, [triggerNotification]);

  return (
    <div className="card-buddy" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
        <Clock size={20} className="gradient-text-purple" style={{ color: 'var(--color-purple)' }} />
        <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>Study Reminders</h4>
      </div>
      
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
        Receive browser alerts and in-app reminders to help you build strong daily study habits.
      </p>

      <form onSubmit={handleSaveReminder} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: 'var(--radius-sm)',
            border: '2px solid var(--border-light)',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            outline: 'none',
            flex: 1
          }}
        />
        <button type="submit" className="btn-3d btn-3d-purple" style={{ padding: '10px 16px', textTransform: 'none', fontSize: '0.9rem' }}>
          Set
        </button>
      </form>

      <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {notificationsEnabled ? (
          <span style={{ fontSize: '0.8rem', color: 'var(--color-green)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Bell size={12} /> Browser Alerts Activated
          </span>
        ) : (
          <button 
            onClick={requestPermission}
            type="button"
            style={{
              background: 'none', border: 'none', color: 'var(--color-purple)', fontSize: '0.8rem',
              fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '4px'
            }}
          >
            <BellOff size={12} /> Enable Browser Alerts
          </button>
        )}
      </div>
    </div>
  );
};
