'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Switch } from '../components/switch/Switch';
import useSound from 'use-sound';

const DarkModeBtn = () => {
  const [mounted, setMounted] = useState(false);
  const { systemTheme, theme, setTheme } = useTheme();
  const [play] = useSound('/sound/bubble-sound.mp3', { volume: 0.5 });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  function handlePlay() {
    play();
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const isDarkMode = currentTheme === 'dark';

  const handleToggle = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
    handlePlay();
  };

  return (
    <div>
      <Switch
        checked={isDarkMode}
        onCheckedChange={handleToggle}
        aria-label="Toggle dark mode"
        className="dark:bg-slate-800"
      />
    </div>
  );
};

export default DarkModeBtn;
