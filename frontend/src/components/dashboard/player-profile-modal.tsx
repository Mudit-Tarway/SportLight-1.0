import type { Player } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, MapPin, Cake, Star, Award, Ruler, Scale, Heart, VenetianMask, Trash2, ShieldAlert, AtSign, BarChartHorizontal, Zap, StarHalf, Verified, Phone } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { usePlayers } from "@/hooks/use-players";
import { Progress } from "../ui/progress";

interface PlayerProfileModalProps {
  player: Player | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock benchmark data for demonstration
const benchmarks = {
    'Football': { 'Sprint Speed': { value: 30, unit: 'km/h', higherIsBetter: true } },
    'Cricket': { 'Top Bowling Speed': { value: 130, unit: 'kph', higherIsBetter: true } },
};

const getPerformanceScore = (player: Player): number => {
    if (!player.performanceData || player.performanceData.length === 0) return 0;
    // Simple scoring logic for demo. A real app would have a more complex system.
    return player.performanceData.reduce((acc, metric) => acc + (metric.value / 10), 0) + player.skills.length;
}


export function PlayerProfileModal({ player, open, onOpenChange }: PlayerProfileModalProps) {
  const { deletePlayer } = usePlayers();
  
  if (!player) return null;

  // Since auth is removed, anyone can delete. In a real app, this would be protected.
  const isOwner = true; 
  const score = getPerformanceScore(player);


  const handleDelete = () => {
    if (player && isOwner) {
      deletePlayer(player.id);
      onOpenChange(false);
    }
  };

  const getBenchmark = (sport: any, metric: string) => {
    // @ts-ignore
    return benchmarks[sport]?.[metric] || null;
  }

  const getBadge = (score: number) => {
    if (score > 30) return { icon: <Verified className="w-4 h-4 text-blue-400" />, label: 'Elite Performer' };
    if (score > 15) return { icon: <Star className="w-4 h-4 text-amber-400" />, label: 'Rising Star' };
    return { icon: <StarHalf className="w-4 h-4 text-orange-400" />, label: 'Promising Talent' };
  }
  
  const badge = getBadge(score);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-primary/50">
              <AvatarImage src={player.avatar} alt={player.name} data-ai-hint="person portrait" />
              <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <DialogTitle className="font-headline text-2xl">{player.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-4">
                <span>{player.sport}</span>
                {player.verified && (
                  <Badge variant="outline" className="border-primary text-primary">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                )}
                 <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-500">
                    {badge.icon}
                    {badge.label}
                 </Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="mr-2 h-3 w-3" />
              <span>{player.location}</span>
            </div>
            <div className="flex items-center">
              <Cake className="mr-2 h-3 w-3" />
              <span>{player.age} years old</span>
            </div>
            <div className="flex items-center">
              <Phone className="mr-2 h-3 w-3" />
              <span>{player.mobile}</span>
            </div>
            <div className="flex items-center">
              <Ruler className="mr-2 h-3 w-3" />
              <span>{player.height} cm</span>
            </div>
            <div className="flex items-center">
              <Scale className="mr-2 h-3 w-3" />
              <span>{player.weight} kg</span>
            </div>
            <div className="flex items-center">
              <VenetianMask className="mr-2 h-3 w-3" />
              <span>{player.gender}</span>
            </div>
             <div className="flex items-center">
              <Heart className="mr-2 h-3 w-3" />
              <span>{player.dreamClub}</span>
            </div>
             <div className="flex items-center">
              <AtSign className="mr-2 h-3 w-3" />
              <span className="truncate">{player.creatorEmail}</span>
            </div>
          </div>
          <div className="pt-2">
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm"><Star className="w-4 h-4 text-primary" /> Skills</h4>
            <div className="flex flex-wrap gap-1">
              {player.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-accent/20 text-accent-foreground text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
           {player.performanceData && player.performanceData.length > 0 && (
             <div className="pt-2">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm"><BarChartHorizontal className="w-4 h-4 text-primary"/> Performance Data</h4>
                <div className="space-y-3">
                    {player.performanceData.map((data) => {
                        const benchmark = getBenchmark(player.sport, data.metric);
                        const progress = benchmark ? Math.min((data.value / benchmark.value) * 100, 100) : 0;
                        return (
                            <div key={data.metric}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="text-xs font-medium">{data.metric}</span>
                                    <span className="text-xs text-muted-foreground">
                                        Your's: {data.value} {data.unit}
                                        {benchmark && ` / Avg: ${benchmark.value} ${benchmark.unit}`}
                                    </span>
                                </div>
                                {benchmark && <Progress value={progress} className="h-2" />}
                            </div>
                        )
                    })}
                </div>
             </div>
           )}
          <div className="pt-2">
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm"><Award className="w-4 h-4 text-primary"/> Achievements</h4>
            <div className="bg-muted/50 p-2 rounded-md space-y-2">
              {player.achievementsImage && (
                <Image
                    src={player.achievementsImage}
                    alt="Player achievements visualization"
                    width={200}
                    height={150}
                    className="rounded-md object-cover w-full"
                    data-ai-hint="achievement award"
                />
              )}
              <p className="text-xs text-foreground/80">{player.achievementsText}</p>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-between pt-2">
            {isOwner ? (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Profile
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            player profile for {player.name}.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            ) : (
                <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 rounded-md bg-muted">
                    <ShieldAlert className="w-4 h-4" />
                    <span>You are not the owner of this profile.</span>
                </div>
            )}
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
