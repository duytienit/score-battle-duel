
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PlayerSetupProps {
  player1Name: string;
  player2Name: string;
  setPlayer1Name: (name: string) => void;
  setPlayer2Name: (name: string) => void;
}

const PlayerSetup = ({ 
  player1Name, 
  player2Name, 
  setPlayer1Name, 
  setPlayer2Name 
}: PlayerSetupProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="player1" className="text-sm font-medium">
          Player 1
        </Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-player1-DEFAULT" />
          <Input
            id="player1"
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
            className="pl-9 h-12"
            placeholder="Enter player name"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="player2" className="text-sm font-medium">
          Player 2
        </Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-player2-DEFAULT" />
          <Input
            id="player2"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
            className="pl-9 h-12"
            placeholder="Enter player name"
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerSetup;
