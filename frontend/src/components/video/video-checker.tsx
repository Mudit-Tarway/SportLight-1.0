'use client';

import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { handleVideoCheck } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, FileCheck2, Film, Loader } from 'lucide-react';
import { useState } from 'react';
import { ALL_SPORTS } from '@/lib/mock-data';

const initialState = {
  analysis: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? <><Loader className="w-4 h-4 mr-2 animate-spin"/>Analyzing...</> : 'Analyze Video'}</Button>;
}

export function VideoChecker() {
  const [state, formAction] = useActionState(handleVideoCheck, initialState);
  const [fileName, setFileName] = useState('');

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle className="font-headline">AI Video Checker</CardTitle>
            <CardDescription>Upload a video to get AI analysis on angles, timing, and criteria fulfillment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sport-check">Sport</Label>
              <Select name="sport" required>
                <SelectTrigger id="sport-check">
                  <SelectValue placeholder="Select Sport" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_SPORTS.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="video-file">Video File</Label>
              <Input 
                id="video-file" 
                name="video" 
                type="file" 
                accept="video/*"
                onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                required 
              />
               {fileName && <p className="text-xs text-muted-foreground flex items-center gap-2 pt-2"><Film className="w-4 h-4"/> Selected: {fileName}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      <div className="space-y-4">
        {state.analysis && (
          <Card>
            <CardHeader className="flex-row items-start gap-4 space-y-0">
                <span className="bg-primary/20 p-2 rounded-full"><Bot className="w-6 h-6 text-primary" /></span>
                <div>
                    <CardTitle className="font-headline">AI Analysis Complete</CardTitle>
                    <CardDescription>Here's the feedback on your video.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <p className='border-l-2 border-primary pl-4'>{state.analysis}</p>
            </CardContent>
          </Card>
        )}
        {state.error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
        {!state.analysis && !state.error && (
            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
                <FileCheck2 className="w-12 h-12 text-muted-foreground" />
                <h3 className="font-headline mt-4 text-xl font-semibold">Awaiting Analysis</h3>
                <p className="text-muted-foreground mt-1">Upload a video and select a sport to see the AI feedback here.</p>
            </div>
        )}
      </div>
    </div>
  );
}
