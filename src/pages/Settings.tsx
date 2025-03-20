
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useSettings } from '@/contexts/SettingsContext';
import { motion } from 'framer-motion';
import { toast } from "sonner";

// Import components
import Header from '@/components/settings/Header';
import SoundSettings from '@/components/settings/SoundSettings';
import TimerSettings from '@/components/settings/TimerSettings';
import VibrationSettings from '@/components/settings/VibrationSettings';
import ThemeSettings from '@/components/settings/ThemeSettings';

const Settings = () => {
  const navigate = useNavigate();
  const {
    soundEnabled,
    setSoundEnabled,
    timerDuration,
    setTimerDuration,
    timerEnabled,
    setTimerEnabled,
    theme,
    setTheme,
    vibrationEnabled,
    setVibrationEnabled
  } = useSettings();

  const [localTheme, setLocalTheme] = useState(theme);

  const handleSaveSettings = () => {
    setTheme(localTheme);
    toast.success("Settings saved successfully!");
  };

  const handleToggleSound = (checked: boolean) => {
    setSoundEnabled(checked);
  };

  const handleToggleTimer = (checked: boolean) => {
    setTimerEnabled(checked);
  };

  const handleToggleVibration = (checked: boolean) => {
    setVibrationEnabled(checked);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-md mx-auto">
        <Header onBack={() => navigate(-1)} />
        
        <SoundSettings 
          soundEnabled={soundEnabled} 
          onToggleSound={handleToggleSound} 
        />
        
        <TimerSettings 
          timerEnabled={timerEnabled}
          timerDuration={timerDuration}
          onToggleTimer={handleToggleTimer}
          onTimerDurationChange={setTimerDuration}
        />
        
        <VibrationSettings 
          vibrationEnabled={vibrationEnabled}
          onToggleVibration={handleToggleVibration}
        />
        
        <ThemeSettings 
          localTheme={localTheme}
          onThemeChange={setLocalTheme}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            onClick={handleSaveSettings} 
            className="w-full py-6 text-lg"
          >
            Save Settings
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
