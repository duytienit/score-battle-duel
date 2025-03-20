
import { Volume2 } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion } from 'framer-motion';

interface SoundSettingsProps {
  soundEnabled: boolean;
  onToggleSound: (checked: boolean) => void;
}

const SoundSettings = ({ soundEnabled, onToggleSound }: SoundSettingsProps) => {
  return (
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
          onCheckedChange={onToggleSound} 
        />
      </div>
      <p className="text-sm text-gray-500">Enable or disable sound effects during gameplay</p>
    </motion.div>
  );
};

export default SoundSettings;
