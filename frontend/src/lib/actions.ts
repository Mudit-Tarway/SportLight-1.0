'use server';

import { aiChatbot } from "@/ai/flows/ai-powered-chatbot";
import { aiVideoChecker } from "@/ai/flows/ai-video-checker";
import { getVideoRecordingGuidance } from "@/ai/flows/video-recording-guidance";
import { generateAchievementImage } from "@/ai/flows/generate-achievement-image";
import { generateSportsVideo } from "@/ai/flows/generate-sports-video";
import { z } from "zod";

const chatSchema = z.object({
  query: z.string(),
});

export async function handleChat(prevState: any, formData: FormData) {
  const validatedFields = chatSchema.safeParse({
    query: formData.get('query'),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      error: 'Invalid input.',
    };
  }

  try {
    const result = await aiChatbot(validatedFields.data);
    return {
      ...prevState,
      response: result.response,
      error: null,
    };
  } catch (error) {
    return {
      ...prevState,
      response: null,
      error: 'Failed to get response from AI.',
    };
  }
}

const guidanceSchema = z.object({
    sport: z.string().min(1, 'Sport is required'),
    skill: z.string().min(1, 'Skill is required'),
    cameraAngle: z.string().min(1, 'Camera Angle is required'),
    playerVisibility: z.string().min(1, 'Player Visibility is required'),
});

export async function handleVideoGuidance(prevState: any, formData: FormData) {
    const validatedFields = guidanceSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            ...prevState,
            guidance: null,
            error: 'All fields are required.',
        };
    }

    try {
        const result = await getVideoRecordingGuidance(validatedFields.data);
        return {
            ...prevState,
            guidance: result.guidance,
            error: null,
        };
    } catch (error) {
        return {
            ...prevState,
            guidance: null,
            error: 'Failed to get guidance from AI.',
        };
    }
}

const checkerSchema = z.object({
    sport: z.string().min(1, 'Sport is required'),
    video: z.instanceof(File),
});

async function fileToDataUri(file: File) {
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:${file.type};base64,${base64}`;
}

export async function handleVideoCheck(prevState: any, formData: FormData) {
    const validatedFields = checkerSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            ...prevState,
            analysis: null,
            error: 'Sport and a video file are required.',
        };
    }

    try {
        const videoDataUri = await fileToDataUri(validatedFields.data.video);
        const result = await aiVideoChecker({ sport: validatedFields.data.sport, videoDataUri: videoDataUri });
        return {
            ...prevState,
            analysis: result.analysis,
            error: null,
        };
    } catch (error) {
        return {
            ...prevState,
            analysis: null,
            error: 'Failed to get analysis from AI.',
        };
    }
}


const achievementImageSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  image: z.string().optional(),
});

export async function handleAchievementImage(prevState: any, formData: FormData) {
    const validatedFields = achievementImageSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            ...prevState,
            imageUrl: null,
            error: 'Text prompt is required to generate an image.',
        };
    }

    try {
        const result = await generateAchievementImage(validatedFields.data);
        return {
            ...prevState,
            imageUrl: result.imageUrl,
            error: null,
        };
    } catch (error) {
        console.error(error);
        return {
            ...prevState,
            imageUrl: null,
            error: 'Failed to generate image. Please try again.',
        };
    }
}


const videoGenerationSchema = z.object({
    prompt: z.string().min(1, 'Prompt is required.'),
    sport: z.string().min(1, 'Sport is required.'),
});

export async function handleVideoGeneration(prevState: any, formData: FormData) {
    const validatedFields = videoGenerationSchema.safeParse(Object.fromEntries(formData.entries()));
    
    if (!validatedFields.success) {
        return {
            ...prevState,
            videoUrl: null,
            error: 'A prompt is required to generate an example.',
        };
    }

    try {
        const result = await generateSportsVideo({prompt: validatedFields.data.prompt});
        return {
            ...prevState,
            videoUrl: result.videoUrl,
            error: null,
        }
    } catch (error: any) {
        console.error(error);
        const errorMessage = error.message.includes('Project has not completed onboarding in Vertex AI') 
            ? 'Video generation requires a Google Cloud project with billing enabled. Please set up a billed account and try again.'
            : (error.message || 'Failed to generate example video. The model may be unavailable.');

        return {
            ...prevState,
            videoUrl: null,
            error: errorMessage,
        }
    }
}
