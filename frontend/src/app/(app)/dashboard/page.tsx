"use client";

import { PlayerDashboard } from '@/components/dashboard/player-dashboard';
import { usePlayers } from '@/hooks/use-players';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { RecruiterDashboard } from '@/components/dashboard/recruiter-dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


function PlayerCardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className='space-y-2'>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </CardHeader>
            <CardHeader className="flex flex-row items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className='space-y-2'>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </CardHeader>
        </Card>
    )
}

export default function DashboardPage() {
    const { players, loading } = usePlayers();

    return (
        <div className="container mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold font-headline tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Toggle between player and recruiter views.</p>
            </div>
            <Tabs defaultValue="players" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto">
                    <TabsTrigger value="players">Player View</TabsTrigger>
                    <TabsTrigger value="recruiters">Recruiter View</TabsTrigger>
                </TabsList>
                <TabsContent value="players" className="mt-6">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold font-headline tracking-tight">Discover Players</h2>
                        <p className="text-muted-foreground">Find talented players from around the world.</p>
                    </div>
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => <PlayerCardSkeleton key={i} />)}
                        </div>
                    ) : (
                        <PlayerDashboard players={players} />
                    )}
                </TabsContent>
                <TabsContent value="recruiters" className="mt-6">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold font-headline tracking-tight">Scout Clubs</h2>
                        <p className="text-muted-foreground">Explore top clubs from various leagues.</p>
                    </div>
                    <RecruiterDashboard />
                </TabsContent>
            </Tabs>
        </div>
    );
}
