'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {generateLyrics} from '@/ai/flows/generate-lyrics';

const systemInstruction = `You are an expert AI songwriter and musical prompt engineer. When given user specifications, you must check the top-line “Mode:” and then produce only what’s asked.
Mode: (Full Song / Lyrics Only / Instrumentation Only)
A) If Mode is Full Song or Instrumentation Only:
MUSIC PROMPT: (200–350 chars to fit Udio’s box) • Genres; Moods; Theme; Tempo; Core groove; Instrumentation; Production; Vocal tone • STOP WORDS: neon, echoes, {any music references}
B) If Mode is Full Song or Lyrics Only:
LYRICS: [Verse 1] – 4 lines  [Pre-Chorus] – 2 lines (omit if not requested)  [Chorus] – 4 lines, hook repeated twice  [Verse 2] – 4 lines  [Bridge] – 2 lines (optional)  [Chorus] – repeat or vary 1–2 keywords`;

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'Full Song' | 'Lyrics Only' | 'Instrumentation Only'>('Full Song');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await generateLyrics({
        mode: mode,
        specifications: prompt,
      });
      setResponse(result.lyrics || 'No response received.');
    } catch (error: any) {
      console.error('Error generating lyrics:', error);
      setResponse(`Error: ${error.message || 'Failed to generate response.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-8 bg-background">
      <h1 className="text-2xl font-bold mb-4">Gemini Prompter</h1>
      <Card className="w-full max-w-md bg-card shadow-md rounded-lg overflow-hidden">
        <CardHeader className="py-3 px-4 bg-secondary">
          <CardTitle className="text-lg font-semibold">Prompt Input</CardTitle>
          <CardDescription>Enter your song specifications below</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <Select onValueChange={(value) => setMode(value as 'Full Song' | 'Lyrics Only' | 'Instrumentation Only')}>
            <SelectTrigger className="w-full mb-4">
              <SelectValue placeholder="Select Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full Song">Full Song</SelectItem>
              <SelectItem value="Lyrics Only">Lyrics Only</SelectItem>
              <SelectItem value="Instrumentation Only">Instrumentation Only</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your song specifications here..."
            className="mb-4 text-base"
          />
          <Button onClick={handleSubmit} className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
        </CardContent>
      </Card>

      {response && (
        <Card className="w-full max-w-md mt-8 bg-card shadow-md rounded-lg overflow-hidden">
          <CardHeader className="py-3 px-4 bg-secondary">
            <CardTitle className="text-lg font-semibold">AI Response</CardTitle>
            <CardDescription>Here is the generated output from Gemini</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-base whitespace-pre-line">{response}</p>
          </CardContent>
        </Card>
      )}

      <Card className="w-full max-w-md mt-8 bg-muted shadow-sm rounded-lg overflow-hidden">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm font-medium">System Instruction</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">{systemInstruction}</p>
        </CardContent>
      </Card>
    </div>
  );
}
