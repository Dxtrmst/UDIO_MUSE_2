'use client';

import {useState, useCallback} from 'react';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';
import {Check, ChevronDown} from 'lucide-react';
import {generateLyrics} from '@/ai/flows/generate-lyrics';
import {generateMusicPrompt} from '@/ai/flows/generate-music-prompt';

const genresList = [
  'Pop',
  'Rock',
  'Hip Hop',
  'R&B',
  'Country',
  'Electronic',
  'Classical',
  'Jazz',
  'Blues',
  'Folk',
  'Indie',
  'Metal',
  'Punk',
  'Reggae',
  'Ska',
  'Funk',
  'Disco',
  'Soul',
  'Gospel',
  'Latin',
];

const moodsList = [
  'Happy',
  'Sad',
  'Angry',
  'Relaxed',
  'Excited',
  'Romantic',
  'Melancholic',
  'Energetic',
  'Calm',
  'Hopeful',
  'Gloomy',
  'Peaceful',
  'Mysterious',
  'Dreamy',
  'Uplifting',
  'Dark',
  'Playful',
  'Serious',
  'Groovy',
  'Intense',
];

interface ListProps {
  items: string[];
  selected: string[];
  setSelected: (value: string[]) => void;
}

function List({items, selected, setSelected}: ListProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSelect = useCallback(
    (item: string) => {
      if (selected.includes(item)) {
        setSelected(selected.filter((s) => s !== item));
      } else {
        setSelected([...selected, item]);
      }
    },
    [selected, setSelected]
  );

  const filteredItems = items.filter((item) => item.toLowerCase().includes(searchValue.toLowerCase()));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selected.length > 0 ? selected.join(', ') : 'Select...'}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <input
          placeholder="Search items..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <ul>
          {filteredItems.map((item) => (
            <li
              key={item}
              onClick={() => {
                handleSelect(item);
              }}
            >
              <Check className={cn('mr-2 h-4 w-4', selected.includes(item) ? 'opacity-100' : 'opacity-0')} />
              {item}
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'Full Song' | 'Lyrics Only' | 'Instrumentation Only'>('Full Song');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [moods, setMoods] = useState<string[]>([]);
  const [theme, setTheme] = useState('');

  const handleThemeGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await generateMusicPrompt({
        genres: genres,
        moods: moods,
      });
      setTheme(result.musicPrompt || 'No theme generated.');
    } catch (error: any) {
      console.error('Error generating theme:', error);
      setTheme(`Error: ${error.message || 'Failed to generate theme.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await generateLyrics({
        mode: mode,
        specifications: prompt,
      });

      const formattedLyrics = result && result.lyrics ? formatLyrics(result.lyrics) : 'No response received.';

      const finalResponse = `Mode: ${mode}\n` +
        `Genre: ${genres.join(', ')}\n` +
        `Mood: ${moods.join(', ')}\n` +
        `Theme: ${theme}\n` +
        `LYRICS:\n${formattedLyrics}`;

      setResponse(finalResponse);

    } catch (error: any) {
      console.error('Error generating lyrics:', error);
      setResponse(`Error: ${error.message || 'Failed to generate response.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatLyrics = (lyrics: string) => {
    const sections = lyrics.split(/\[(.*?)\]/g);
    let formattedLyrics = '';

    for (let i = 1; i < sections.length; i += 2) {
      const sectionType = sections[i];
      const sectionContent = sections[i + 1] || '';
      formattedLyrics += `[${sectionType}]\n${sectionContent.trim()}\n\n`;
    }

    return formattedLyrics.trim();
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-8 bg-background">
      <h1 className="text-2xl font-bold mb-4">Gemini Prompter</h1>
      <Card className="w-full max-w-md bg-card shadow-md rounded-lg overflow-hidden">
        <CardHeader className="py-3 px-4 bg-secondary">
          <CardTitle>Gemini Prompter</CardTitle>
          <CardDescription>Enter your song specifications below</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <Select value={mode} onValueChange={(value) => setMode(value as 'Full Song' | 'Lyrics Only' | 'Instrumentation Only')}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full Song">Full Song</SelectItem>
              <SelectItem value="Lyrics Only">Lyrics Only</SelectItem>
              <SelectItem value="Instrumentation Only">Instrumentation Only</SelectItem>
            </SelectContent>
          </Select>
          <div>
            <label>Genres</label>
            <List items={genresList} selected={genres} setSelected={setGenres} />
          </div>
          <div>
            <label>Moods</label>
            <List items={moodsList} selected={moods} setSelected={setMoods} />
          </div>
          <div className="flex flex-col space-y-2">
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={isLoading}
              onClick={handleThemeGenerate}
            >
              {isLoading ? 'Generating Theme...' : 'Generate Theme'}
            </Button>
            <Textarea
              placeholder="Theme will be shown here..."
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Textarea
              placeholder="Enter additional song specifications here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? 'Generating...' : 'Generate!'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {response && (
        <Card className="w-full max-w-md mt-4 bg-card shadow-md rounded-lg overflow-hidden">
          <CardHeader className="py-3 px-4 bg-secondary">
            <CardTitle>AI Response</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Textarea
              placeholder="AI Response will be shown here..."
              value={response}
              readOnly
              className="min-h-[200px]"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
