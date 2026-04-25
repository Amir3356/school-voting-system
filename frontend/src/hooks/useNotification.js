import { useState } from 'react';

export const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess: (msg) => showNotification(msg, 'success'),
    showError: (msg) => showNotification(msg, 'error'),
    showInfo: (msg) => showNotification(msg, 'info'),
    showWarning: (msg) => showNotification(msg, 'warning')
  };
};
