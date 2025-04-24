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

  genres: z.array(z.string()).describe('The selected genres for the song.'),
  moods: z.array(z.string()).describe('The selected moods for the song.'),
});
export type GenerateMusicPromptInput = z.infer<typeof GenerateMusicPromptInputSchema>;

const GenerateMusicPromptOutputSchema = z.object({
  musicPrompt: z.string().describe('The generated music theme.').optional(),

});
export type GenerateMusicPromptOutput = z.infer<typeof GenerateMusicPromptOutputSchema>;

export async function generateMusicPrompt(input: GenerateMusicPromptInput): Promise<GenerateMusicPromptOutput> {
  return generateMusicPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMusicPromptPrompt',
  input: {
    schema: z.object({
      genres: z.array(z.string()).describe('The selected genres for the song.'),
      moods: z.array(z.string()).describe('The selected moods for the song.'),
    }),
  },
  output: {
    schema: z.object({
      musicPrompt: z.string().describe('The generated music theme.').optional(),    
    }),
  },
  prompt: `You are an expert AI songwriter and musical theme engineer. Given the genres and moods, you must generate a song theme, strictly following the specified output format, including the headers and structure shown in the examples below.

Genres: {{{genres}}}. Moods: {{{moods}}}


Produce ONLY the THEME section below, starting with 'THEME:' on a new line, followed by the content.
THEME: (1-2 short sentences.)

---

EXAMPLES: --- Example 1 ---
Genres: Neo-Soul, Contemporary R&B, Soul
Moods: Exciting, Thrilling, Invigorating, Energetic, Lively.
THEME: A journey of self-discovery, symbolized by finding a hidden forest waterfall. The song explores themes of wonder, energy, and the connection between nature and personal growth.

---

IMPORTANT: Ensure the output ONLY contains the requested section (THEME) with its header on separate lines, as demonstrated in the EXAMPLES section, and no conversational text or extra formatting outside of the generated content.`,
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
    const {output} = await prompt({...input});

    return {
      musicPrompt: output?.musicPrompt,
    };
  }
);

