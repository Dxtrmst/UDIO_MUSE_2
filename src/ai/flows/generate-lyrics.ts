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
      specifications: z.string().describe('User specifications for the song, including genre, mood, theme, tempo, core groove, instrumentation, production, and vocal tone.').optional(),
      mode: z.enum(['Full Song', 'Lyrics Only', 'Instrumentation Only']).describe('The mode of song generation: Full Song, Lyrics Only, or Instrumentation Only.'),
      shouldIncludeLyrics: z.boolean().describe('Flag indicating if lyrics should be generated.'),
      shouldIncludeMusicPrompt: z.boolean().describe('Flag indicating if a music prompt should be generated.'),
      theme: z.string().describe('The theme of the song.'),
      genres: z.string().describe('The genres of the song.'),
      moods: z.string().describe('The moods of the song.'),
      tempo: z.string().describe('The tempo of the song.'),
      coreGroove: z.string().describe('The core groove of the song.'),
      instrumentation: z.string().describe('The instrumentation of the song.'),
      production: z.string().describe('The production of the song.'),
      vocalTone: z.string().describe('The vocal tone of the song.'),
    }),
  },
  output: {
    schema: z.object({
      lyrics: z.string().describe('The generated lyrics in verse/chorus/bridge format.'),
      genres: z.string().optional(),
      moods: z.string().optional(),
      theme: z.string().optional(),

      tempo: z.string().optional(),
      coreGroove: z.string().optional(),
      instrumentation: z.string().optional(),
      production: z.string().optional(),
      vocalTone: z.string().optional(),
      tempo: z.string().optional(),
      coreGroove: z.string().optional(),
      instrumentation: z.string().optional(),
      production: z.string().optional(),
      vocalTone: z.string().optional(),
    }),
  },
  prompt: `You are an expert AI songwriter and musical prompt engineer. When given user specifications, you must check the top-line “Mode:” and then produce only what’s asked, strictly following the specified output format, including the headers and structure shown in the examples below.
Mode: {{{mode}}}


{{#if specifications}}
User specifications: {{{specifications}}}

{{#if shouldIncludeLyrics}}
Produce ONLY the LYRICS section below, starting with 'LYRICS:' on a new line, followed by the content.
LYRICS:
[Verse 1] – 4 lines
[Pre-Chorus] – 2 lines (omit if not requested)
[Chorus] – 4 lines, hook repeated twice
[Verse 2] – 4 lines
[Bridge] – 2 lines (optional)
[Chorus] – repeat or vary 1–2 keywords

{{/if}}

{{#if shouldIncludeMusicPrompt}}

Produce ONLY the MUSIC PROMPT section below, starting with 'MUSIC PROMPT:' on a new line, followed by the content, using the following format, and creating each variable content.

MUSIC PROMPT: Genres: {{{genres}}}; Moods: {{{moods}}}; Theme: {{theme}}; Tempo: {{{tempo}}}; Core groove: {{{coreGroove}}}; Instrumentation: {{{instrumentation}}}; Production: {{{production}}}; Vocal tone: {{{vocalTone}}}.
{{/if}}
{{/if}}

EXAMPLES:

--- Example 1: Full Song ---
Mode: Full Song    
MUSIC PROMPT: Genres: Neo-Soul, Contemporary R&B, Soul; Moods: Exciting, Thrilling, Invigorating, Energetic, Lively; Theme: A journey of self-discovery; Tempo: Medium-up; Core groove: Syncopated; Instrumentation: Electric piano, groovy bass, drums, synths; Production: Polished; Vocal tone: Smooth.

LYRICS: 
[Verse 1]
Through the woods, a path unknown
Whispers of a secret zone
Sunbeams dance in emerald light
Drawn by wonder, taking flight
[Chorus]
Oh, the hidden falls, a vibrant spree
Nature's anthem, wild and free
Oh, the hidden falls, a vibrant spree
Nature's anthem, wild and free
[Verse 2]
Cool mist rises, soft and low
Where the secret waters flow
Nature’s heart, a steady beat
In this haven, pure and sweet
[Bridge]
Here I find a piece of grace
In this wonderous, hidden place
[Chorus]
Oh, the hidden falls, a vibrant spree
Nature's anthem, wild and free
Oh, the hidden falls, a vibrant spree
Nature's anthem, wild and free

--- Example 2: Lyrics Only --- 
Mode: Lyrics Only.

LYRICS:
[Verse 1]
Sun is shining bright today
Birds are singing on the way
People smiling all around
On this happy park ground
[Chorus]
A perfect day to be outside
Nowhere to run and hide
A perfect day to be outside
With the clear blue sky as our guide

--- Example 3: Instrumentation Only --- 
Mode: Instrumentation Only.
MUSIC PROMPT: Genres: Ska, Reggae, Dancehall; Moods: Sprightly, Peppy, Bouncy, Lively; Theme: Carefree summer love; Tempo: Upbeat; Core groove: Driving; Instrumentation: Saxophone, brass, live band; Production: Lively; Vocal tone: Energetic.
  
IMPORTANT: Ensure the output ONLY contains the requested sections (LYRICS and/or MUSIC PROMPT) with their headers on separate lines, as demonstrated in the EXAMPLES section, and no conversational text or extra formatting outside of the generated content.

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
  const theme = "A journey of self-discovery, symbolized by finding a hidden forest waterfall. The song explores themes of wonder, energy, and the connection between nature and personal growth."
  
  const shouldIncludeLyrics = input.mode === 'Full Song' || input.mode === 'Lyrics Only';
  const shouldIncludeMusicPrompt = input.mode === 'Full Song' || input.mode === 'Instrumentation Only';
  const {output} = await prompt({
     ...input,
    theme,
    shouldIncludeLyrics,
        shouldIncludeMusicPrompt,
    genres: "Neo-Soul, Contemporary R&B, Soul", // Replace with AI-generated values
        moods: "Exciting, Thrilling, Invigorating, Energetic, Lively", // Replace with AI-generated values
        tempo: "Medium-up", // Replace with AI-generated values
        coreGroove: "Syncopated", // Replace with AI-generated values
        instrumentation: "Electric piano, groovy bass, drums, synths", // Replace with AI-generated values
        production: "Polished", // Replace with AI-generated values
        vocalTone: "Smooth", // Replace with AI-generated values

  });
  return {lyrics: output.lyrics,
        genres: output.genres,
        moods: output.moods,
        tempo: output.tempo,
        coreGroove: output.coreGroove,
        instrumentation: output.instrumentation,
        production: output.production,
        vocalTone: output.vocalTone};
});
