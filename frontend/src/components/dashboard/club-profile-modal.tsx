import type { Club } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, MapPin, Trophy, Users, Briefcase, AtSign } from "lucide-react";
import { Button } from "../ui/button";

interface ClubProfileModalProps {
  club: Club | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClubProfileModal({ club, open, onOpenChange }: ClubProfileModalProps) {
  if (!club) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-primary/50">
              <AvatarImage src={club.logo} alt={club.name} data-ai-hint="club logo" />
              <AvatarFallback>{club.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <DialogTitle className="font-headline text-2xl">{club.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-4">
                <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> {club.league}</span>
                {club.verified && (
                  <Badge variant="outline" className="border-primary text-primary">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-6 py-2 max-h-[60vh] overflow-y-auto pr-4">
            
            <div className="text-sm">
                <p className="text-muted-foreground">{club.description}</p>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
                 <div className="flex items-center gap-2">
                    <MapPin className="mr-2 h-4 w-4 text-primary" />
                    <span>{club.location}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <AtSign className="mr-2 h-4 w-4 text-primary" />
                    <span>{club.creatorEmail}</span>
                </div>
            </div>
          
            <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-base"><Users className="w-5 h-5 text-primary"/> Currently Scouting For</h4>
                <div className="flex flex-wrap gap-2">
                {club.scoutingFocus.map((focus) => (
                    <Badge key={focus} variant="secondary" className="bg-accent/20 text-accent-foreground text-sm py-1 px-3">
                    {focus}
                    </Badge>
                ))}
                </div>
            </div>
        </div>
        <DialogFooter className="sm:justify-between pt-4">
            <Button>
                <Briefcase className="mr-2 h-4 w-4" /> Contact Club
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
