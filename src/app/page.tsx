'use client';

import {useState, useCallback} from 'react';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import { ScrollArea } from "@/components/ui/scroll-area"; 
import {cn} from '@/lib/utils';
// Added ClipboardCopy and CheckCheck icons
import {Check, ChevronDown, ClipboardCopy, CheckCheck } from 'lucide-react';
import {generateLyrics} from '@/ai/flows/generate-lyrics';
import {generateMusicPrompt} from '@/ai/flows/generate-music-prompt';

const genresList = [
  'Acid House',
  'Acid Jazz',
  'Afrobeat',
  'Afro House',
  'Afro Pop',
  'Afro Punk',
  'Aggrotech',
  'Alternative',
  'Alternative Country',
  'Alternative Dance',
  'Alternative Hip Hop',
  'Alternative Metal',
  'Alternative Rock',
  'Ambient',
  'Anime',
  'Arabic Pop',
  'Arena Rock',
  'Arpa',
  'Art Pop',
  'Art Rock',
  'Asia Pop',
  'Atmospheric Black Metal',
  'Atmospheric Drum and Bass',
  'Atmospheric Folk Black Metal',
  'Atmospheric Sludge Metal',
  'Avant-Garde',
  'Avant-Garde Black Metal',
  'Avant-Garde Jazz',
  'Bachata',
  'Bachata Urbana',
  'Banda',
  'Baroque Pop',
  'Bass House',
  'Bass Music',
  'Bassline',
  'Bebop',
  'Big Band',
  'Black Metal',
  'Bluegrass',
  'Blues',
  'Blues Rock',
  'Bollywood',
  'Bongo Flava',
  'Bossa Nova',
  'Breakbeat',
  'Breakcore',
  'Britpop',
  'Brostep',
  'Bubblegum Dance',
  'City Pop',
  'Japanese City Pop',
  'Korean City Pop',
  'Japanese Fusion',
  'Cantonese Pop',
  'Celtic',
  'Celtic Folk',
  'Celtic Punk',
  'Chill Hop',
  'Chill Trance',
  'Chillwave',
  'Chinese Hip Hop',
  'Chinese Pop',
  'Christian & Gospel',
  'Christian Alternative Rock',
  'Christian Metal',
  'Christian Pop',
  'Christian Rock',
  'Classic Blues',
  'Classic Country',
  'Classic Hip Hop',
  'Classic House',
  'Classic Rock',
  'Classical',
  'Club',
  'Comedy',
  'Complextro',
  'Contemporary Blues',
  'Contemporary Country',
  'Contemporary Folk',
  'Contemporary R&B',
  'Cool Jazz',
  'Country',
  'Country Blues',
  'Country Folk',
  'Country Pop',
  'Crunk',
  'Crust Punk',
  'Cybergrind',
  'Dance',
  'DancePop',
  'DancePunk',
  'Dancehall',
  'Dark Ambient',
  'Dark Electro',
  'Dark Folk',
  'Dark Psytrance',
  'Darkwave',
  'Death Metal',
  'Deathcore',
  'Deep House',
  'Delta Blues',
  'Desert Rock',
  'Detroit Techno',
  'Digital Hardcore',
  'Disco',
  'Dixieland',
  'Djent',
  'Doom Metal',
  'Downtempo',
  'Dream Pop',
  'Drone',
  'Drum and Bass',
  'Dub',
  'Dub Techno',
  'Dubstep',
  'Dubstep Riddim',
  'Early Music',
  'East Coast Hip Hop',
  'Easy Listening',
  'EDM',
  'Electro',
  'Electro House',
  'Electro Pop',
  'Electro Rock',
  'Electronic',
  'Electronic Body Music',
  'Electronica',
  'Electropop',
  'Emo',
  'Enka',
  'Ethnic Electronica',
  'Europop',
  'Experimental',
  'Experimental Electronic',
  'Experimental Hip Hop',
  'Experimental Metal',
  'Fado',
  'Folk',
  'Folk Black Metal',
  'Folk Metal',
  'Folk Pop',
  'Folktronica',
  'Freak Folk',
  'Frenchcore',
  'Funk',
  'Funeral Doom Metal',
  'Funky House',
  'Fusion',
  'Gabber',
  'Gangsta Rap',
  'Garage',
  'Garage House',
  'Garage Rock',
  'German Hip Hop',
  'Glam Metal',
  'Glam Rock',
  'Glitch Hop',
  'Gospel',
  'Gothic Metal',
  'Gothic Rock',
  'Grime',
  'Grindcore',
  'Grunge',
  'Gypsy Jazz',
  'Happy Hardcore',
  'Hard Bop',
  'Hard House',
  'Hard Rock',
  'Hard Techno',
  'Hard Trance',
  'Hardcore',
  'Hardcore Hip Hop',
  'Hardcore Punk',
  'Hands Up',
  'Happy Punk',
  'Heavy Metal',
  'Hi-NRG',
  'Highlife',
  'Hip Hop',
  'Hip Hop Beats',
  'Holiday',
  'Honky Tonk',
  'House',
  'IDM',
  'Indian Pop',
  'Indie',
  'Indie Dance',
  'Indie Electronic',
  'Indie Folk',
  'Indie Pop',
  'Indie Rock',
  'Industrial',
  'Industrial Metal',
  'Industrial Rock',
  'Instrumental Hip Hop',
  'Instrumental Rock',
  'Intelligent Dance Music',
  'Irish Folk',
  'Italo Dance',
  'Italo Disco',
  'J-Pop',
  'J-Rock',
  'Jam Band',
  'Jazz',
  'Jazz Blues',
  'Jazz Fusion',
  'Jazz Funk',
  'Jazz Rap',
  'Jazz Rock',
  'Jungle',
  'K-Pop',
  'Kayokyoku',
  'Kizomba',
  'Krautrock',
  'Latin',
  'Latin Ballad',
  'Latin Hip Hop',
  'Latin Jazz',
  'Latin Pop',
  'Latin Rock',
  'LoFi',
  'LoFi Hip Hop',
  'Lounge',
  'Lowercase',
  'Madchester',
  'Mainstream Hip Hop',
  'Malaysian Pop',
  'Mambo',
  'Manele',
  'Maringue',
  'Mathcore',
  'Math Rock',
  'Medieval Folk',
  'Melodic Black Metal',
  'Melodic Death Metal',
  'Melodic Hardcore',
  'Melodic Metalcore',
  'Metal',
  'Metalcore',
  'Mexican Pop',
  'Microhouse',
  'Military Music',
  'Minimal',
  'Minimal Techno',
  'Modern Classical',
  'Modal Jazz',
  'Motown',
  'Neo Classical',
  'Neo Classical Darkwave',
  'Neo Classical Metal',
  'Neo Folk',
  'Neo Psychedelia',
  'Neo Soul',
  'Neofolk',
  'New Age',
  'New Jack Swing',
  'New Romantic',
  'New Wave',
  'New Wave Pop',
  'Nintendocore',
  'Noise',
  'Noise Pop',
  'Noisecore',
  'Nu Disco',
  'Nu Gaze',
  'Nu Jazz',
  'Nu Metal',
  'Oi!',
  'Old School Hip Hop',
  'Old-time Music',
  'Opera',
  'Outlaw Country',
  'Outsider House',
  'P-Funk',
  'Pagan Black Metal',
  'Pagan Metal',
  'Paisley Pop',
  'Pop',
  'Pop Punk',
  'Pop Rap',
  'Pop Rock',
  'Post Britpop',
  'Post Grunge',
  'Post Hardcore',
  'Post Metal',
  'Post Punk',
  'Post Rock',
  'Power Electronics',
  'Power Metal',
  'Power Pop',
  'Progressive',
  'Progressive Death Metal',
  'Progressive Electronic',
  'Progressive Folk',
  'Progressive House',
  'Progressive Metal',
  'Progressive Rock',
  'Psy_Trance',
  'Psychedelic',
  'Psychedelic Blues',
  'Psychedelic Folk',
  'Psychedelic Pop',
  'Psychedelic Rock',
  'Psychobilly',
  'Punk',
  'Punk Blues',
  'Punk Folk',
  'Punk Rock',
  'Queercore',
  'R&B',
  'Ragga-Jungle',
  'Raggaeton',
  'Raggae',
  'Ragtime',
  'Rap',
  'Rap Metal',
  'Rap Rock',
  'Rapcore',
  'Rave',
  'Reggae',
  'Reggaeton',
  'Regional Mexican',
  'Retro Electro',
  'Retro Rock',
  'Riot Grrrl',
  'Rock & Roll',
  'Rockabilly',
  'Rocksteady',
  'Roots Reggae',
  'Roots Rock',
  'Salsa',
  'Sambas',
  'Samba',
  'Sanat Müziği',
  'Schlager',
  'Screamo',
  'Shoegaze',
  'Singer-Songwriter',
  'Ska',
  'Ska Punk',
  'Skate Punk',
  'Slowcore',
  'Sludge Metal',
  'Smooth Jazz',
  'Soft Rock',
  'Soul',
  'Soul Funk',
  'Soundtrack',
  'Southern Rock',
  'Southern Soul',
  'Spanish Pop',
  'Speed Garage',
  'Speed Metal',
  'Speedcore',
  'Spoken Word',
  'Stoner Rock',
  'Straight Edge',
  'Surf Rock',
  'Swing',
  'Synth-pop',
  'Synthpop',
  'Synthwave',
  'T-Pop',
  'Tamil Pop',
  'Tech House',
  'Technical Death Metal',
  'Techno',
  'Tejano',
  'Terrorcore',
  'Thai Pop',
  'Thrash Metal',
  'Third Stream',
  'Timba',
  'Traditional Blues',
  'Traditional Celtic',
  'Traditional Country',
  'Traditional Folk',
  'Traditional Irish',
  'Trance',
  'Trap',
  'Trap Metal',
  'Tribal House',
  'Trip Hop',
  'Turkish Pop',
  'Turkish Rock',
  'Turk Halk Müziği',
  'Turk Sanat Müziği',
  'UK Garage',
  'UK Hip Hop',
  'Underground Hip Hop',
  'Urban Contemporary',
  'V-Pop',
  'Vallenato',
  'Vaporwave',
  'Viking Metal',
  'Visual Kei',
  'Vocal House',
  'Vocal Trance',
  'World',
  'World Beat',
  'World Fusion',
  'World Music',
  'Xmas',
  'Yacht Rock',
  'Zouk',
  'Worship'
];

const moodsList = [
  'Happy',
  'Joyful',
  'Cheerful',
  'Euphoric',
  'Blissful',
  'Upbeat',
  'Lighthearted',
  'Playful',
  'Whimsical',
  'Fun',
  'Jovial',
  'Exuberant',
  'Energetic',
  'Lively',
  'Excited',
  'Enthusiastic',
  'Optimistic',
  'Hopeful',
  'Uplifting',
  'Inspirational',
  'Empowering',
  'Confident',
  'Triumphant',
  'Victorious',
  'Proud',
  'Heroic',
  'Celebratory',
  'Festive',
  'Romantic',
  'Passionate',
  'Loving',
  'Affectionate',
  'Sensual',
  'Sexy',
  'Intimate',
  'Sentimental',
  'Warm',
  'Cozy',
  'Nostalgic',
  'Reflective',
  'Contemplative',
  'Thoughtful',
  'Meditative',
  'Calm',
  'Peaceful',
  'Serene',
  'Soothing',
  'Relaxing',
  'Tranquil',
  'Dreamy',
  'Ethereal',
  'Wistful',
  'Pensive',
  'Philosophical',
  'Mysterious',
  'Enigmatic',
  'Suspenseful',
  'Tense',
  'Anxious',
  'Nervous',
  'Apprehensive',
  'Fearful',
  'Scary',
  'Ominous',
  'Dark',
  'Brooding',
  'Melancholic',
  'Sad',
  'Sorrowful',
  'Mournful',
  'Grieving',
  'Heartbroken',
  'Despairing',
  'Depressed',
  'Gloomy',
  'Bleak',
  'Lonely',
  'Isolated',
  'Alienated',
  'Bittersweet',
  'Poignant',
  'Tragic',
  'Angry',
  'Aggressive',
  'Hostile',
  'Defiant',
  'Rebellious',
  'Resentful',
  'Frustrated',
  'Irritated',
  'Bitter',
  'Cynical',
  'Sarcastic',
  'Sardonic',
  'Dramatic',
  'Intense',
  'Powerful',
  'Dynamic',
  'Ambiguous',
  'Complex',
  'Conflicted',
  'Confused',
  'Uncertain',
  'Ambivalent',
  'Vulnerable',
  'Fragile',
  'Delicate',
  'Somber',
  'Grave',
  'Serious',
  'Solemn',
  'Heavy',
  'Weighty',
  'Profound',
  'Deep',
  'Thought-provoking',
  'Intellectual',
  'Cerebral',
  'Innocent & Pure',
  'Childlike',
  'Innocent',
  'Pure',
  'Simple',
  'Naive',
  'Guileless',
  'Trusting',
  'Open',
  'Honest',
  'Sincere',
  'Direct',
  'Uncomplicated',
  'Clear',
  'Lucid',
  'Refreshing',
  'Revitalizing',
  'Invigorating',
  'Stimulating',
  'Exciting',
  'Thrilling',
  'Exhilarating',
  'Electrifying',
  'Animated',
  'Sprightly',
  'Peppy',
  'Bouncy',
  'Hypnotic',
  'Trance-inducing',
  'Ambient',
  'Atmospheric',
  'Evocative',
  'Suggestive',
  'Imaginative',
  'Cathartic',
  'Therapeutic',
  'Healing',
  'Comforting',
  'Nurturing',
  'Gentle',
  'Soft',
  'Tender',
  'Yearning',
  'Longing',
  'Retrospective',
  'Forward-looking',
  'Humble',
  'Modest',
  'Unassuming',
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
          <span className="truncate"> 
            {selected.length > 0 ? selected.join(', ') : 'Select...'}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <div className="p-2"> 
          <input
            className="w-full p-1 border rounded" 
            placeholder="Search items..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <ScrollArea className="h-[200px] rounded-md border p-2">
          <ul>
            {filteredItems.length > 0 ? (
               filteredItems.map((item) => (
                <li
                  key={item}
                  className="p-1 hover:bg-accent cursor-pointer flex items-center"
                  onClick={() => {
                    handleSelect(item);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', selected.includes(item) ? 'opacity-100' : 'opacity-0')} />
                  {item}
                </li>
               ))
             ) : (
               <li className="p-1 text-sm text-muted-foreground text-center">No items found.</li>
             )}
          </ul>
        </ScrollArea>
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
  const [isCopied, setIsCopied] = useState(false); // State for copy feedback

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

      const finalResponse = `Mode: ${mode}
` +
        `Genre: ${genres.join(', ')}
` +
        `Mood: ${moods.join(', ')}
` +
        `Theme: ${theme}
` +
        `LYRICS:
${formattedLyrics}`;

      setResponse(finalResponse);

    } catch (error: any) {
      console.error('Error generating lyrics:', error);
      setResponse(`Error: ${error.message || 'Failed to generate response.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatLyrics = (lyrics: string) => {
    // Guard against null or undefined lyrics
    if (!lyrics) return ''; 
    
    const sections = lyrics.split(/\[(.*?)\]/g);
    let formattedLyrics = '';

    // Start loop from 1 if the first part is empty or not a section header
    // Handle cases where split might result in an empty first element
    let startIndex = 0;
    if (sections.length > 1 && sections[0].trim() === '') {
        startIndex = 1;
    }

    for (let i = startIndex; i < sections.length; i += 2) {
      const sectionType = sections[i];
      // Ensure there is content following the section type
      const sectionContent = sections[i + 1] ? sections[i + 1].trim() : ''; 
      // Only add section if type is not empty and content exists
      if (sectionType && sectionType.trim() !== '') { 
         formattedLyrics += `[${sectionType}]
${sectionContent}

`;
      }
    }

    return formattedLyrics.trim();
  };

  // Handler for the copy button
  const handleCopy = () => {
    navigator.clipboard.writeText(response).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }, (err) => {
      console.error('Failed to copy text: ', err);
      // Optionally show an error toast or message here
    });
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-8 bg-background">
      <h1 className="text-2xl font-bold mb-4">Gemini Prompter</h1>
      <Card className="w-full max-w-md bg-card shadow-md rounded-lg overflow-hidden">
        <CardHeader className="py-3 px-4 bg-secondary">
          <CardTitle>Gemini Prompter</CardTitle>
          <CardDescription>Enter your song specifications below</CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4"> 
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
          <div className="space-y-1"> 
            <label className="text-sm font-medium">Genres</label> 
            <List items={genresList} selected={genres} setSelected={setGenres} />
          </div>
          <div className="space-y-1"> 
            <label className="text-sm font-medium">Moods</label> 
            <List items={moodsList} selected={moods} setSelected={setMoods} />
          </div>
          <div className="flex flex-col space-y-2">
             <label className="text-sm font-medium">Theme (Optional)</label> 
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={isLoading}
              onClick={handleThemeGenerate}
            >
              {isLoading ? 'Generating Theme...' : 'Generate Theme Suggestion'} 
            </Button>
            <Textarea
              placeholder="Optionally generate a theme based on genres/moods, or write your own."
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-2">
             <label className="text-sm font-medium">Additional Specifications (Optional)</label> 
            <Textarea
              placeholder="Enter additional song specifications (e.g., instruments, tempo, lyrical ideas)..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading} // Corrected: Only disable when loading
              onClick={handleSubmit}
            >
              {isLoading ? 'Generating...' : 'Generate Song Output'} 
            </Button>
          </div>
        </CardContent>
      </Card>

      {response && (
        <Card className="w-full max-w-md mt-4 bg-card shadow-md rounded-lg overflow-hidden">
          <CardHeader className="py-3 px-4 bg-secondary flex flex-row items-center justify-between"> 
            <CardTitle>AI Response</CardTitle>
            <Button
               variant="ghost" 
               size="icon" 
               onClick={handleCopy}
               aria-label="Copy response"
               disabled={!response} // Keep this disabled condition for the copy button
            >
              {isCopied ? (
                 <CheckCheck className="h-4 w-4 text-green-500" /> 
               ) : (
                 <ClipboardCopy className="h-4 w-4" /> 
               )}
            </Button>
          </CardHeader>
          <CardContent className="p-4">
            <ScrollArea className="h-[300px] rounded-md border p-2"> 
              <pre className="whitespace-pre-wrap text-sm">{response}</pre> 
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
