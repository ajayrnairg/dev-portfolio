import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
// Import icons (assuming you use react-icons, adjust imports if you use something else)
import { RiMoonClearLine, RiSunLine } from 'react-icons/ri'; 

const ThemeButton = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect ensures we only render the toggle on the client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="bg-accent/20 p-3 rounded-full text-accent hover:bg-accent/40 transition-all duration-300 backdrop-blur-sm z-50"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <RiSunLine className="text-xl" /> // Sun icon for Dark mode (to switch to light)
      ) : (
        <RiMoonClearLine className="text-xl" /> // Moon icon for Light mode
      )}
    </button>
  );
};

export default ThemeButton;