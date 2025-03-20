
import { Palette } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from 'framer-motion';

type ThemeType = 'default' | 'dark' | 'high-contrast';

interface ThemeSettingsProps {
  localTheme: ThemeType;
  onThemeChange: (value: ThemeType) => void;
}

const ThemeSettings = ({ localTheme, onThemeChange }: ThemeSettingsProps) => {
  return (
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
        onValueChange={(value) => onThemeChange(value as ThemeType)}
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
  );
};

export default ThemeSettings;
