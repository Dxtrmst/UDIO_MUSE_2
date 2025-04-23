'use server';
/**
 * @fileOverview A music prompt generator AI agent.
 *
 * - generateMusicPrompt - A function that handles the music prompt generation process.
 * - GenerateMusicPromptInput - The input type for the generateMusicPrompt function.
 * - GenerateMusicPromptOutput - The return type for the generateMusicPrompt function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateMusicPromptInputSchema = z.object({
  mode: z.enum(['Full Song', 'Lyrics Only', 'Instrumentation Only']).describe('The mode for music generation (Full Song, Lyrics Only, Instrumentation Only).'),
  specifications: z.string().describe('The user-provided specifications for the song.'),
});
export type GenerateMusicPromptInput = z.infer<typeof GenerateMusicPromptInputSchema>;

const GenerateMusicPromptOutputSchema = z.object({
  musicPrompt: z.string().describe('The generated music prompt (200-350 characters).').optional(),
  lyrics: z.string().describe('The generated lyrics.').optional(),
});
export type GenerateMusicPromptOutput = z.infer<typeof GenerateMusicPromptOutputSchema>;

export async function generateMusicPrompt(input: GenerateMusicPromptInput): Promise<GenerateMusicPromptOutput> {
  return generateMusicPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMusicPromptPrompt',
  input: {
    schema: z.object({
      mode: z.enum(['Full Song', 'Lyrics Only', 'Instrumentation Only']).describe('The mode for music generation (Full Song, Lyrics Only, Instrumentation Only).'),
      specifications: z.string().describe('The user-provided specifications for the song.'),
    }),
  },
  output: {
    schema: z.object({
      musicPrompt: z.string().describe('The generated music prompt (200-350 characters).').optional(),
      lyrics: z.string().describe('The generated lyrics.').optional(),
    }),
  },
  prompt: `You are an expert AI songwriter and musical prompt engineer. When given user specifications, you must check the top-line \"Mode:\" and then produce only what’s asked.\n\nMode: {{{mode}}}\n\nA) If Mode is Full Song or Instrumentation Only:\nMUSIC PROMPT: (200–350 chars to fit Udio’s box)\n• Genres; Moods; Theme; Tempo; Core groove; Instrumentation; Production; Vocal tone\n• STOP WORDS: neon, echoes, {any music references}\n\nB) If Mode is Full Song or Lyrics Only:\nLYRICS: [Verse 1] – 4 lines  [Pre-Chorus] – 2 lines (omit if not requested)  [Chorus] – 4 lines, hook repeated twice  [Verse 2] – 4 lines  [Bridge] – 2 lines (optional)  [Chorus] – repeat or vary 1–2 keywords\n\nUser specifications: {{{specifications}}}`,
});

const generateMusicPromptFlow = ai.defineFlow<
  typeof GenerateMusicPromptInputSchema,
  typeof GenerateMusicPromptOutputSchema
>(
  {
    name: 'generateMusicPromptFlow',
    inputSchema: GenerateMusicPromptInputSchema,
    outputSchema: GenerateMusicPromptOutputSchema,
  },
  async input => {
    const {mode} = input;
    const {output} = await prompt(input);

    return {
      musicPrompt: (mode === 'Full Song' || mode === 'Instrumentation Only') ? output?.musicPrompt : undefined,
      lyrics: (mode === 'Full Song' || mode === 'Lyrics Only') ? output?.lyrics : undefined,
    };
  }
);
