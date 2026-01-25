'use server';

/**
 * @fileOverview Provides real-time feedback during video recording to ensure proper camera alignment and visibility of skills.
 *
 * - getVideoRecordingGuidance - A function that returns the video recording guidance.
 * - VideoRecordingGuidanceInput - The input type for the getVideoRecordingGuidance function.
 * - VideoRecordingGuidanceOutput - The return type for the getVideoRecordingGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VideoRecordingGuidanceInputSchema = z.object({
  sport: z.string().describe('The sport for which the video is being recorded.'),
  skill: z.string().describe('The specific skill being demonstrated in the video.'),
  cameraAngle: z.string().describe('The current angle of the camera.'),
  playerVisibility: z.string().describe('Description of how visible the player is in the video.'),
});
export type VideoRecordingGuidanceInput = z.infer<typeof VideoRecordingGuidanceInputSchema>;

const VideoRecordingGuidanceOutputSchema = z.object({
  guidance: z.string().describe('Specific guidance for the player to improve their video recording.'),
});
export type VideoRecordingGuidanceOutput = z.infer<typeof VideoRecordingGuidanceOutputSchema>;

export async function getVideoRecordingGuidance(input: VideoRecordingGuidanceInput): Promise<VideoRecordingGuidanceOutput> {
  return videoRecordingGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'videoRecordingGuidancePrompt',
  input: {schema: VideoRecordingGuidanceInputSchema},
  output: {schema: VideoRecordingGuidanceOutputSchema},
  prompt: `You are an expert AI video recording guidance system for sports.

You will provide guidance to a player to improve their video recording based on the sport, skill, camera angle, and player visibility.

Sport: {{{sport}}}
Skill: {{{skill}}}
Camera Angle: {{{cameraAngle}}}
Player Visibility: {{{playerVisibility}}}

Provide specific guidance to the player to improve their video recording, for example, adjust camera angle, improve player visibility, etc.
`,
});

const videoRecordingGuidanceFlow = ai.defineFlow(
  {
    name: 'videoRecordingGuidanceFlow',
    inputSchema: VideoRecordingGuidanceInputSchema,
    outputSchema: VideoRecordingGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
