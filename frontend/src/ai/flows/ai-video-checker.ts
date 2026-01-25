'use server';

/**
 * @fileOverview This file defines the AI video checker flow, which analyzes player videos to ensure they meet the required criteria for angles and timings.
 *
 * - aiVideoChecker - A function that takes a video and sport as input and returns an analysis of the video.
 * - AiVideoCheckerInput - The input type for the aiVideoChecker function.
 * - AiVideoCheckerOutput - The return type for the aiVideoChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiVideoCheckerInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video of a player performing a sport, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  sport: z.string().describe('The sport the player is performing.'),
});
export type AiVideoCheckerInput = z.infer<typeof AiVideoCheckerInputSchema>;

const AiVideoCheckerOutputSchema = z.object({
  analysis: z.string().describe('The analysis of the video, including whether the angles and timings are correct.'),
});
export type AiVideoCheckerOutput = z.infer<typeof AiVideoCheckerOutputSchema>;

export async function aiVideoChecker(input: AiVideoCheckerInput): Promise<AiVideoCheckerOutput> {
  return aiVideoCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiVideoCheckerPrompt',
  input: {schema: AiVideoCheckerInputSchema},
  output: {schema: AiVideoCheckerOutputSchema},
  prompt: `You are an expert sports analyst. You will analyze the video of the player performing the sport and determine if the angles and timings are correct.\n\nSport: {{{sport}}}\nVideo: {{media url=videoDataUri}}\n\nAnalysis:`,
});

const aiVideoCheckerFlow = ai.defineFlow(
  {
    name: 'aiVideoCheckerFlow',
    inputSchema: AiVideoCheckerInputSchema,
    outputSchema: AiVideoCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
