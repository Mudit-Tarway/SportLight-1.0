'use server';
/**
 * @fileOverview Generates a short video clip demonstrating a sports action.
 *
 * - generateSportsVideo - A function that handles the video generation process.
 * - GenerateSportsVideoInput - The input type for the generateSportsVideo function.
 * - GenerateSportsVideoOutput - The return type for the generateSportsVideo function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const GenerateSportsVideoInputSchema = z.object({
  prompt: z.string().describe('A descriptive prompt for the sports video to generate.'),
});
export type GenerateSportsVideoInput = z.infer<typeof GenerateSportsVideoInputSchema>;

const GenerateSportsVideoOutputSchema = z.object({
  videoUrl: z.string().describe('The data URI of the generated video.'),
});
export type GenerateSportsVideoOutput = z.infer<typeof GenerateSportsVideoOutputSchema>;

export async function generateSportsVideo(input: GenerateSportsVideoInput): Promise<GenerateSportsVideoOutput> {
  return generateSportsVideoFlow(input);
}

const generateSportsVideoFlow = ai.defineFlow(
  {
    name: 'generateSportsVideoFlow',
    inputSchema: GenerateSportsVideoInputSchema,
    outputSchema: GenerateSportsVideoOutputSchema,
  },
  async ({ prompt }) => {
    let { operation } = await ai.generate({
      model: googleAI.model('veo-3.0-generate-preview'),
      prompt: prompt,
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Poll for completion
    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      operation = await ai.checkOperation(operation);
    }

    if (operation.error) {
      throw new Error(`Failed to generate video: ${operation.error.message}`);
    }

    const videoPart = operation.output?.message?.content.find((p) => !!p.media);
    if (!videoPart || !videoPart.media) {
      throw new Error('Failed to find the generated video in the operation result');
    }
    
    // The video URL requires an API key to access, we need to fetch it server-side
    // and convert it to a data URI.
    const response = await fetch(
        `${videoPart.media.url}&key=${process.env.GEMINI_API_KEY}`
    );
    if (!response.ok || !response.body) {
        throw new Error(`Failed to download video: ${response.statusText}`);
    }
    const videoBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(videoBuffer).toString('base64');
    const contentType = response.headers.get('content-type') || 'video/mp4';

    return { videoUrl: `data:${contentType};base64,${base64}` };
  }
);
