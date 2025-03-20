
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface GameSettingsProps {
  raceTo: number;
  setRaceTo: (value: number) => void;
}

const GameSettings = ({ raceTo, setRaceTo }: GameSettingsProps) => {
  const raceToOptions = [3, 5, 7, 9, 11, 15, 21];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="raceTo" className="text-sm font-medium">
          Race to
        </Label>
        <Select
          value={raceTo.toString()}
          onValueChange={(value) => setRaceTo(Number(value))}
        >
          <SelectTrigger className="w-full h-12">
            <SelectValue placeholder="Select race to" />
          </SelectTrigger>
          <SelectContent>
            {raceToOptions.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option} points
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default GameSettings;
