
import { useState } from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Trophy, Mountain, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface MatchRecord {
  id: string;
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
  winner: string;
  timestamp: number;
  raceTo: number;
}

interface MatchHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matches: MatchRecord[];
  onClearHistory: () => void;
}

const MatchHistory = ({ open, onOpenChange, matches, onClearHistory }: MatchHistoryProps) => {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  
  const sortedMatches = [...matches].sort((a, b) => {
    return sortBy === 'newest' 
      ? b.timestamp - a.timestamp 
      : a.timestamp - b.timestamp;
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md max-h-[90vh]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-between">
            <span>Match History</span>
            <button 
              onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
              className="text-sm bg-secondary px-2 py-1 rounded-md text-secondary-foreground"
            >
              {sortBy === 'newest' ? 'Newest First' : 'Oldest First'}
            </button>
          </AlertDialogTitle>
          <AlertDialogDescription>
            View your previous matches
          </AlertDialogDescription>
        </AlertDialogHeader>

        {matches.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No match history yet
          </div>
        ) : (
          <ScrollArea className="h-[50vh] pr-4">
            <div className="space-y-4">
              {sortedMatches.map((match) => (
                <div 
                  key={match.id} 
                  className="bg-muted p-4 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar size={14} />
                      <span>{formatDistanceToNow(match.timestamp, { addSuffix: true })}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Clock size={14} />
                      <span>Race to {match.raceTo}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className={`text-base font-medium ${match.winner === match.player1Name ? 'text-green-600 font-bold' : ''}`}>
                      {match.player1Name}
                    </div>
                    <div className="text-base font-bold">
                      {match.player1Score} - {match.player2Score}
                    </div>
                    <div className={`text-base font-medium ${match.winner === match.player2Name ? 'text-green-600 font-bold' : ''}`}>
                      {match.player2Name}
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center gap-1.5 text-sm">
                    <Trophy size={14} className="text-amber-500" />
                    <span>Winner: <span className="font-medium">{match.winner}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <AlertDialogFooter className="gap-2 sm:gap-0">
          {matches.length > 0 && (
            <AlertDialogCancel onClick={onClearHistory}>
              Clear History
            </AlertDialogCancel>
          )}
          <AlertDialogAction>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MatchHistory;
