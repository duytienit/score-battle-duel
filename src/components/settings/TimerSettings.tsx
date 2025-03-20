
import { Clock } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { motion } from 'framer-motion';

interface TimerSettingsProps {
  timerEnabled: boolean;
  timerDuration: number;
  onToggleTimer: (checked: boolean) => void;
  onTimerDurationChange: (value: number) => void;
}

const TimerSettings = ({ 
  timerEnabled, 
  timerDuration, 
  onToggleTimer, 
  onTimerDurationChange 
}: TimerSettingsProps) => {
  const timerOptions = [15, 30, 45, 60, 90, 120];

  return (
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
          onCheckedChange={onToggleTimer} 
        />
      </div>
      <p className="text-sm text-gray-500 mb-4">Set a countdown timer for each player's turn</p>
      
      {timerEnabled && (
        <div className="mt-4">
          <Label htmlFor="timer-duration" className="text-sm font-medium">Timer Duration (seconds)</Label>
          <Select
            value={timerDuration.toString()}
            onValueChange={(value) => onTimerDurationChange(Number(value))}
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
  );
};

export default TimerSettings;
