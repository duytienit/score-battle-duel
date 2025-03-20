import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSettings } from '@/contexts/SettingsContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, Clock, Vibrate, Palette } from 'lucide-react';
import { toast } from "sonner";

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

  const timerOptions = [15, 30, 45, 60, 90, 120];

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
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-6"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="card-subtle p-6 mb-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Volume2 size={18} className="text-gray-600" />
              <Label htmlFor="sound-toggle" className="text-lg font-medium">Sound Effects</Label>
            </div>
            <Switch 
              id="sound-toggle" 
              checked={soundEnabled}
              onCheckedChange={handleToggleSound} 
            />
          </div>
          <p className="text-sm text-gray-500">Enable or disable sound effects during gameplay</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card-subtle p-6 mb-5"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-gray-600" />
              <Label htmlFor="timer-toggle" className="text-lg font-medium">Turn Timer</Label>
            </div>
            <Switch 
              id="timer-toggle" 
              checked={timerEnabled}
              onCheckedChange={handleToggleTimer} 
            />
          </div>
          <p className="text-sm text-gray-500 mb-4">Set a countdown timer for each player's turn</p>
          
          {timerEnabled && (
            <div className="mt-4">
              <Label htmlFor="timer-duration" className="text-sm font-medium">Timer Duration (seconds)</Label>
              <Select
                value={timerDuration.toString()}
                onValueChange={(value) => setTimerDuration(Number(value))}
                disabled={!timerEnabled}
              >
                <SelectTrigger id="timer-duration" className="w-full mt-1">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {timerOptions.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option} seconds
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card-subtle p-6 mb-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Vibrate size={18} className="text-gray-600" />
              <Label htmlFor="vibration-toggle" className="text-lg font-medium">Vibration</Label>
            </div>
            <Switch 
              id="vibration-toggle" 
              checked={vibrationEnabled}
              onCheckedChange={handleToggleVibration} 
            />
          </div>
          <p className="text-sm text-gray-500">Enable or disable vibration when timer ends</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card-subtle p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Palette size={18} className="text-gray-600" />
            <Label className="text-lg font-medium">Theme</Label>
          </div>
          
          <RadioGroup 
            value={localTheme} 
            onValueChange={(value) => setLocalTheme(value as 'default' | 'dark' | 'high-contrast')}
            className="grid grid-cols-1 gap-4"
          >
            <div className={`relative flex items-center space-x-2 rounded-md border p-4 ${localTheme === 'default' ? 'bg-primary/5 border-primary/20' : 'border-gray-200'}`}>
              <RadioGroupItem value="default" id="theme-default" />
              <Label htmlFor="theme-default" className="flex-grow cursor-pointer">Default</Label>
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded-full bg-player1-DEFAULT"></div>
                <div className="w-4 h-4 rounded-full bg-player2-DEFAULT"></div>
              </div>
            </div>
            
            <div className={`relative flex items-center space-x-2 rounded-md border p-4 ${localTheme === 'dark' ? 'bg-primary/5 border-primary/20' : 'border-gray-200'}`}>
              <RadioGroupItem value="dark" id="theme-dark" />
              <Label htmlFor="theme-dark" className="flex-grow cursor-pointer">Dark Mode</Label>
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                <div className="w-4 h-4 rounded-full bg-purple-600"></div>
              </div>
            </div>
            
            <div className={`relative flex items-center space-x-2 rounded-md border p-4 ${localTheme === 'high-contrast' ? 'bg-primary/5 border-primary/20' : 'border-gray-200'}`}>
              <RadioGroupItem value="high-contrast" id="theme-high-contrast" />
              <Label htmlFor="theme-high-contrast" className="flex-grow cursor-pointer">High Contrast</Label>
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <div className="w-4 h-4 rounded-full bg-black"></div>
              </div>
            </div>
          </RadioGroup>
        </motion.div>

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
