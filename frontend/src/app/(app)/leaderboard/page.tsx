
"use client";

import { usePlayers } from "@/hooks/use-players";
import { ALL_SPORTS, Player } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const getPerformanceScore = (player: Player): number => {
    if (!player.performanceData || player.performanceData.length === 0) {
         // Fallback score for players without performance data
        return player.skills.length + (player.verified ? 5 : 0);
    }
    // Simple scoring logic for demo. A real app would have a more complex system.
    const performanceBasedScore = player.performanceData.reduce((acc, metric) => acc + (metric.value / 10), 0);
    return performanceBasedScore + player.skills.length + (player.verified ? 5 : 0);
}

export default function LeaderboardPage() {
    const { players } = usePlayers();
    const [sportFilter, setSportFilter] = useState('all');

    const leaderboardData = useMemo(() => {
        return players
            .filter(p => sportFilter === 'all' || p.sport === sportFilter)
            .map(p => ({
                ...p,
                score: getPerformanceScore(p)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 50); // Top 50
    }, [players, sportFilter]);

    const getRankColor = (rank: number) => {
        if (rank === 0) return "text-amber-400"; // Gold
        if (rank === 1) return "text-slate-400"; // Silver
        if (rank === 2) return "text-amber-600"; // Bronze
        return "text-muted-foreground";
    }

    return (
        <div className="container mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold font-headline tracking-tight">Leaderboard</h1>
                <p className="text-muted-foreground">See who's at the top of their game.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Top Players</CardTitle>
                            <CardDescription>Ranked by overall performance score.</CardDescription>
                        </div>
                        <Select value={sportFilter} onValueChange={setSportFilter}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Sports" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sports</SelectItem>
                                {ALL_SPORTS.map(sport => (
                                <SelectItem key={sport} value={sport}>
                                    {sport}
                                </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Rank</TableHead>
                                <TableHead>Player</TableHead>
                                <TableHead>Sport</TableHead>
                                <TableHead className="text-right">Score</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaderboardData.map((player, index) => (
                                <TableRow key={player.id}>
                                    <TableCell>
                                        <div className={cn("flex items-center gap-2 font-bold text-lg", getRankColor(index))}>
                                            {index < 3 ? <Trophy className="w-5 h-5"/> : <Medal className="w-5 h-5"/>}
                                            {index + 1}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={player.avatar} alt={player.name} />
                                                <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{player.name}</p>
                                                <p className="text-xs text-muted-foreground">{player.location}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{player.sport}</TableCell>
                                    <TableCell className="text-right font-mono flex items-center justify-end gap-1">
                                        <Star className="w-3 h-3 text-primary" /> {player.score.toFixed(1)}
                                    </TableCell>
                                </TableRow>
                            ))}
                             {leaderboardData.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No players found for this sport.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
