// Use server directive is crucial for Genkit flows.
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating song lyrics based on user specifications.
 *
 * - generateLyrics - A function that takes song specifications as input and returns generated lyrics.
 * - GenerateLyricsInput - The input type for the generateLyrics function, defining the structure of the song specifications.
 * - GenerateLyricsOutput - The output type for the generateLyrics function, defining the structure of the generated lyrics.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateLyricsInputSchema = z.object({
  mode: z.enum(['Full Song', 'Lyrics Only', 'Instrumentation Only']).describe('The mode of song generation: Full Song, Lyrics Only, or Instrumentation Only.'),
  specifications: z.string().describe('User specifications for the song, including genre, mood, theme, tempo, core groove, instrumentation, production, and vocal tone.'),
});
export type GenerateLyricsInput = z.infer<typeof GenerateLyricsInputSchema>;

const GenerateLyricsOutputSchema = z.object({
  lyrics: z.string().describe('The generated lyrics in verse/chorus/bridge format.'),
});
export type GenerateLyricsOutput = z.infer<typeof GenerateLyricsOutputSchema>;

export async function generateLyrics(input: GenerateLyricsInput): Promise<GenerateLyricsOutput> {
  return generateLyricsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLyricsPrompt',
  input: {
    schema: z.object({
      mode: z.enum(['Full Song', 'Lyrics Only', 'Instrumentation Only']).describe('The mode of song generation: Full Song, Lyrics Only, or Instrumentation Only.'),
      specifications: z.string().describe('User specifications for the song, including genre, mood, theme, tempo, core groove, instrumentation, production, and vocal tone.'),
    }),
  },
  output: {
    schema: z.object({
      lyrics: z.string().describe('The generated lyrics in verse/chorus/bridge format.'),
    }),
  },
  prompt: `You are an expert AI songwriter and musical prompt engineer. When given user specifications, you must check the top-line “Mode:” and then produce only what’s asked.

Mode: {{{mode}}}

{{#if mode}}
  {{#if (eq mode "Full Song")}}
LYRICS: [Verse 1] – 4 lines  [Pre-Chorus] – 2 lines (omit if not requested)  [Chorus] – 4 lines, hook repeated twice  [Verse 2] – 4 lines  [Bridge] – 2 lines (optional)  [Chorus] – repeat or vary 1–2 keywords
  {{else}}
    {{#if (eq mode "Lyrics Only")}}
LYRICS: [Verse 1] – 4 lines  [Pre-Chorus] – 2 lines (omit if not requested)  [Chorus] – 4 lines, hook repeated twice  [Verse 2] – 4 lines  [Bridge] – 2 lines (optional)  [Chorus] – repeat or vary 1–2 keywords
    {{else}}
MUSIC PROMPT: (200–350 chars to fit Udio’s box) • Genres; Moods; Theme; Tempo; Core groove; Instrumentation; Production; Vocal tone • STOP WORDS: neon, echoes, {any music references}
    {{/if}}
  {{/if}}
{{/if}}

User specifications: {{{specifications}}}
`,
});

const generateLyricsFlow = ai.defineFlow<
  typeof GenerateLyricsInputSchema,
  typeof GenerateLyricsOutputSchema
>({
  name: 'generateLyricsFlow',
  inputSchema: GenerateLyricsInputSchema,
  outputSchema: GenerateLyricsOutputSchema,
}, async (input) => {
  const {output} = await prompt(input);
  return output!;
});
