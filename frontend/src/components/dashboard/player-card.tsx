
import type { Player } from "@/lib/mock-data";
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
import { CheckCircle, Shield, Medal } from "lucide-react";

interface PlayerCardProps {
  player: Player;
  onViewProfile: (player: Player) => void;
}

export function PlayerCard({ player, onViewProfile }: PlayerCardProps) {
  return (
    <Card className="hover:shadow-primary/20 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary/50">
          <AvatarImage src={player.avatar} alt={player.name} data-ai-hint="person portrait" />
          <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="font-headline text-2xl">{player.name}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            {player.sport}
            {player.verified && (
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
          {player.achievementsText}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {player.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="bg-accent/20 text-accent-foreground">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
            <p>{player.location}</p>
            <p>Age: {player.age}</p>
        </div>
        <Button onClick={() => onViewProfile(player)}>View Profile</Button>
      </CardFooter>
    </Card>
  );
}
