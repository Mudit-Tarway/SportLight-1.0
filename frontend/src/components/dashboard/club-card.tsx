import type { Club } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, MapPin } from "lucide-react";

interface ClubCardProps {
  club: Club;
  onViewProfile: (club: Club) => void;
}

export function ClubCard({ club, onViewProfile }: ClubCardProps) {
  return (
    <Card className="hover:shadow-primary/20 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary/50">
          <AvatarImage src={club.logo} alt={club.name} data-ai-hint="club logo" />
          <AvatarFallback>{club.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="font-headline text-2xl">{club.name}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            {club.league}
            {club.verified && (
              <Badge variant="outline" className="border-primary text-primary">
                <CheckCircle className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            )}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
          {club.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs font-semibold mr-2">Scouting For:</span>
          {club.scoutingFocus.map((focus) => (
            <Badge key={focus} variant="secondary" className="bg-accent/20 text-accent-foreground">
              {focus}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground flex items-center">
            <MapPin className="mr-1 h-3 w-3" />
            {club.location}
        </div>
        <Button onClick={() => onViewProfile(club)}>View Details</Button>
      </CardFooter>
    </Card>
  );
}
