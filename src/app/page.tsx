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
          {selected?.length > 0 ? selected.join(', ') : 'Select...'}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <input placeholder="Search items..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
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
      // Call generateMusicPrompt to get the theme based on selected genres and moods
      const result = await generateMusicPrompt({
        genres: genres,
        moods: moods,
      });

      // Update the theme state with the generated music prompt
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

      const finalResponse =
        `Mode: ${mode}\n` +
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
    // Basic formatting - split by verse/chorus etc. and add line breaks
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
    
      
        Gemini Prompter
      
      
        Enter your song specifications below
      
      
        
          
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
          
          
            <label>Genres</label>
            <List items={genresList} selected={genres} setSelected={setGenres} />
          
          
            <label>Moods</label>
            <List items={moodsList} selected={moods} setSelected={setMoods} />
          
          
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
          
          
            <Textarea
              placeholder="Enter additional song specifications here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          
          
            
              
                {isLoading ? 'Generating...' : 'Generate!'}
              
            
          
        
      

      {response && (
        
          
            
              AI Response
            
          
          
            
              {response}
            
          
        
      )}
    
  );
}
