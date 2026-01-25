'use server';
/**
 * @fileOverview Generates an image representing a player's achievements.
 *
 * - generateAchievementImage - A function that handles the image generation process.
 * - GenerateAchievementImageInput - The input type for the generateAchievementImage function.
 * - GenerateAchievementImageOutput - The return type for the generateAchievementImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAchievementImageInputSchema = z.object({
  text: z.string().describe('A description of the player\'s achievements and bio.'),
  image: z.string().optional().describe(
      "An optional reference image of the player, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'.")
});
export type GenerateAchievementImageInput = z.infer<typeof GenerateAchievementImageInputSchema>;

const GenerateAchievementImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateAchievementImageOutput = z.infer<typeof GenerateAchievementImageOutputSchema>;

export async function generateAchievementImage(input: GenerateAchievementImageInput): Promise<GenerateAchievementImageOutput> {
  return generateAchievementImageFlow(input);
}

const generateAchievementImageFlow = ai.defineFlow(
  {
    name: 'generateAchievementImageFlow',
    inputSchema: GenerateAchievementImageInputSchema,
    outputSchema: GenerateAchievementImageOutputSchema,
  },
  async (input) => {
    const prompt = `Generate a symbolic and artistic image that represents the following player achievements: "${input.text}". The image should be abstract and visually compelling, suitable for a player profile.`;

    if (input.image) {
        const {media} = await ai.generate({
            model: 'googleai/gemini-2.5-flash-image-preview',
            prompt: [
                {media: {url: input.image}},
                {text: prompt},
            ],
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        });
        return { imageUrl: media!.url };
    } else {
        const { media } = await ai.generate({
            model: 'googleai/imagen-4.0-fast-generate-001',
            prompt: prompt,
        });
        return { imageUrl: media!.url };
    }
  }
);
