
import { Vibrate } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion } from 'framer-motion';

interface VibrationSettingsProps {
  vibrationEnabled: boolean;
  onToggleVibration: (checked: boolean) => void;
}

const VibrationSettings = ({ 
  vibrationEnabled, 
  onToggleVibration 
}: VibrationSettingsProps) => {
  return (
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
          onCheckedChange={onToggleVibration} 
        />
      </div>
      <p className="text-sm text-gray-500">Enable or disable vibration when timer ends</p>
    </motion.div>
  );
};

export default VibrationSettings;
