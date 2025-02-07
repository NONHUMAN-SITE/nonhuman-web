'use client'
import { useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeApplier({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  
  useEffect(() => {
    const root = document.documentElement;
    const colors = {
      '--primary-color': `var(--primary-color-${theme})`,
      '--background-color': `var(--background-color-${theme})`,
      '--text-color': `var(--text-color-${theme})`,
      '--accent-color': `var(--accent-color-${theme})`,
      '--border-color': `var(--border-color-${theme})`,
      '--grid-color': `var(--grid-color-${theme})`,
      '--cell-color': `var(--cell-color-${theme})`,
    };
    
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  return <>{children}</>;
} 