export interface CoupleGoal {
  id: number;
  text: string;
  category: 'romance' | 'adventure' | 'intimate' | 'dreams';
  emoji: string;
}

export const COUPLE_GOALS: CoupleGoal[] = [
  // Romance (10)
  { id: 1,  category: 'romance',   emoji: '💌', text: `Write each other handwritten letters and actually mail them across the distance` },
  { id: 2,  category: 'romance',   emoji: '📅', text: `Create a shared countdown for the day we finally close the distance` },
  { id: 3,  category: 'romance',   emoji: '🎬', text: `Watch the same movie at the exact same time from different countries` },
  { id: 4,  category: 'romance',   emoji: '📦', text: `Surprise each other with a package that arrives out of nowhere` },
  { id: 5,  category: 'romance',   emoji: '🌙', text: `Record a voice message at 3am when the love feels overwhelming and just send it` },
  { id: 6,  category: 'romance',   emoji: '🎵', text: `Build a playlist that grows every month we're apart — our soundtrack across the miles` },
  { id: 7,  category: 'romance',   emoji: '📷', text: `Take a photo every day for a week and share it — just your world, for me` },
  { id: 8,  category: 'romance',   emoji: '🕯️', text: `Have a virtual dinner date with candles lit on both sides at the same time` },
  { id: 9,  category: 'romance',   emoji: '😴', text: `Fall asleep together on a call — phones on pillows, just breathing in the same silence` },
  { id: 10, category: 'romance',   emoji: '✨', text: `Send a voice message telling them exactly why you chose them today` },
  // Adventure (10)
  { id: 11, category: 'adventure', emoji: '✈️', text: `Meet in a city neither of us has ever been — somewhere halfway between us` },
  { id: 12, category: 'adventure', emoji: '🚗', text: `Plan our first road trip together for the moment we're finally in the same place` },
  { id: 13, category: 'adventure', emoji: '😱', text: `Watch a horror movie together on call and react live the whole way through` },
  { id: 14, category: 'adventure', emoji: '🗺️', text: `Take each other on a virtual walk through our city — show every hidden corner` },
  { id: 15, category: 'adventure', emoji: '🍜', text: `Cook the same recipe at the same time from our different kitchens and eat together on call` },
  { id: 16, category: 'adventure', emoji: '🗣️', text: `Learn something in each other's language — a sentence that actually matters` },
  { id: 17, category: 'adventure', emoji: '🌅', text: `Watch a sunrise or sunset at the same moment from opposite sides of the world` },
  { id: 18, category: 'adventure', emoji: '🎟️', text: `Plan a surprise visit — show up without warning and just appear at their door` },
  { id: 19, category: 'adventure', emoji: '🎶', text: `Attend a virtual concert or stream something live and react to it together in real time` },
  { id: 20, category: 'adventure', emoji: '🖼️', text: `Take photos of everything that reminded you of them today and send it all at once` },
  // Intimate (10)
  { id: 21, category: 'intimate',  emoji: '📞', text: `Stay on a call for 6+ hours without hanging up — just existing together` },
  { id: 22, category: 'intimate',  emoji: '🎤', text: `Send each other the most vulnerable voice message you've ever recorded` },
  { id: 23, category: 'intimate',  emoji: '😴', text: `Fall asleep on a video call together — cameras on, watching each other's face` },
  { id: 24, category: 'intimate',  emoji: '🌙', text: `Have a call where you both only whisper — like you're in the same room in the dark` },
  { id: 25, category: 'intimate',  emoji: '📖', text: `Read to each other over the phone until one of you falls asleep mid-sentence` },
  { id: 26, category: 'intimate',  emoji: '📷', text: `Turn cameras on and just exist together for an hour — no agenda, just presence` },
  { id: 27, category: 'intimate',  emoji: '🎁', text: `Send a gift that arrives as a complete surprise with a handwritten note inside` },
  { id: 28, category: 'intimate',  emoji: '🎥', text: `Video yourself reading 10 things you love about them — unedited, raw, real` },
  { id: 29, category: 'intimate',  emoji: '💬', text: `Have your deepest conversation entirely over text — no voice, just words` },
  { id: 30, category: 'intimate',  emoji: '🌙', text: `Stay up all night talking just because neither of you wants to say goodbye` },
  // Dreams (10)
  { id: 31, category: 'dreams',    emoji: '🌍', text: `Pick the city where we'll close the distance and finally start our shared life` },
  { id: 32, category: 'dreams',    emoji: '🏡', text: `Describe our dream apartment in detail — every room, every corner, every morning light` },
  { id: 33, category: 'dreams',    emoji: '☀️', text: `Talk about what our first ordinary morning together will look like — the one we've been waiting for` },
  { id: 34, category: 'dreams',    emoji: '👶', text: `Name our future kids — even if it's just for fun, even if it changes` },
  { id: 35, category: 'dreams',    emoji: '✈️', text: `Plan the first trip we'll take together once we're finally living in the same city` },
  { id: 36, category: 'dreams',    emoji: '📅', text: `Design our perfect first week together when the distance finally ends` },
  { id: 37, category: 'dreams',    emoji: '📝', text: `Write a letter to our future selves — the ones who wake up in the same bed` },
  { id: 38, category: 'dreams',    emoji: '🎊', text: `Choose a tradition we'll keep every year from our first year in the same place` },
  { id: 39, category: 'dreams',    emoji: '🌿', text: `Decide: which city do we land in? Talk about where we both want to build our life` },
  { id: 40, category: 'dreams',    emoji: '💫', text: `Say out loud: what does our life together look like in 5 years — same city, same bed, same life?` },
];
