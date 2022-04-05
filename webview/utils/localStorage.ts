const highContrastKey = 'highContrast';

export const setStoredIsHighContrastMode = (isHighContrast: boolean) => {
  if (isHighContrast) {
    localStorage.setItem(highContrastKey, '1');
  } else {
    localStorage.removeItem(highContrastKey);
  }
};

export const getStoredIsHighContrastMode = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  const highContrast = localStorage.getItem(highContrastKey);
  return highContrast === '1';
};
