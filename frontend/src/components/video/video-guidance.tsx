'use client';

import { useFormStatus } from 'react-dom';
import { handleVideoGuidance } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader, Video as VideoIcon, Bot } from 'lucide-react';
import { useState, useEffect, useActionState } from 'react';
import { Textarea } from '../ui/textarea';

const initialGuidanceState = {
    guidance: null,
    error: null,
};

function GuidanceSubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending}>{pending ? <><Loader className="w-4 h-4 mr-2 animate-spin"/>Getting Guidance...</> : 'Get Guidance'}</Button>;
}

const sportCriteria = {
    "Football": {
        defaults: {
            cameraAngle: "Angle capturing player's interaction with the ball",
            playerVisibility: "Player's body posture, goal area for shooting drills visible",
        }
    },
    "Cricket": {
        defaults: {
            cameraAngle: "Side view, slightly elevated",
            playerVisibility: "Bowler’s run-up, batsman stance, and full delivery visible",
        }
    },
};

type Sport = keyof typeof sportCriteria;

export function VideoGuidance() {
    const [guidanceState, guidanceAction] = useActionState(handleVideoGuidance, initialGuidanceState);

    const [selectedSport, setSelectedSport] = useState<Sport | ''>('');
    const [skill, setSkill] = useState('');
    const [cameraAngle, setCameraAngle] = useState('');
    const [playerVisibility, setPlayerVisibility] = useState('');
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        if (selectedSport && sportCriteria[selectedSport]) {
            setCameraAngle(sportCriteria[selectedSport].defaults.cameraAngle);
            setPlayerVisibility(sportCriteria[selectedSport].defaults.playerVisibility);
        } else {
            setCameraAngle('');
            setPlayerVisibility('');
        }
    }, [selectedSport]);

    return (
        <div className="max-w-xl mx-auto">
            <Card>
                <form action={guidanceAction}>
                    <CardHeader>
                        <CardTitle className="font-headline">Live Recording Guidance</CardTitle>
                        <CardDescription>Select your sport and describe your current setup to receive real-time AI feedback.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                             <Label htmlFor="sport-guidance">Sport</Label>
                            <Select name="sport" required value={selectedSport} onValueChange={(value: Sport) => setSelectedSport(value)}>
                                <SelectTrigger id="sport-guidance">
                                    <SelectValue placeholder="Select Sport" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(sportCriteria).map(sport => (
                                        <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="skill-guidance">Skill</Label>
                            <Input id="skill-guidance" name="skill" placeholder="e.g., Free Kick, Serve, Bowling" required value={skill} onChange={(e) => setSkill(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="camera-angle-guidance">Camera Angle</Label>
                            <Input id="camera-angle-guidance" name="cameraAngle" placeholder="e.g., Side view, behind the player" required value={cameraAngle} onChange={(e) => setCameraAngle(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="player-visibility-guidance">Player Visibility</Label>
                            <Textarea id="player-visibility-guidance" name="playerVisibility" placeholder="Describe what is visible in the frame..." required value={playerVisibility} onChange={(e) => setPlayerVisibility(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="video-file-guidance">Upload Your Video</Label>
                            <Input 
                                id="video-file-guidance" 
                                name="video" 
                                type="file" 
                                accept="video/*"
                                onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                            />
                            {fileName && <p className="text-xs text-muted-foreground flex items-center gap-2 pt-2"><VideoIcon className="w-4 h-4"/> Selected: {fileName}</p>}
                        </div>

                         <div className="pt-4 space-y-4">
                            {guidanceState.guidance && (
                                <Alert>
                                    <Bot className="w-4 h-4" />
                                    <AlertTitle>AI Guidance</AlertTitle>
                                    <AlertDescription>{guidanceState.guidance}</AlertDescription>
                                </Alert>
                            )}
                            {guidanceState.error && (
                                <Alert variant="destructive">
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{guidanceState.error}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <GuidanceSubmitButton />
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
