export interface CoupleGoal {
  id: number;
  text: string;
  category: 'romance' | 'adventure' | 'intimate' | 'dreams';
  emoji: string;
}

export const COUPLE_GOALS: CoupleGoal[] = [
  // Romance (10)
  { id: 1,  category: 'romance',   emoji: '🌅', text: `Watch the sunrise together wrapped in a blanket` },
  { id: 2,  category: 'romance',   emoji: '💌', text: `Write each other love letters and exchange them` },
  { id: 3,  category: 'romance',   emoji: '🌙', text: `Dance together in the kitchen at midnight` },
  { id: 4,  category: 'romance',   emoji: '📷', text: `Take a photo every month for a year` },
  { id: 5,  category: 'romance',   emoji: '⭐', text: `Have a picnic under the stars` },
  { id: 6,  category: 'romance',   emoji: '🍽️', text: `Cook a fancy dinner together from scratch` },
  { id: 7,  category: 'romance',   emoji: '🎵', text: `Create a playlist that's just "us" songs` },
  { id: 8,  category: 'romance',   emoji: '🎬', text: `Watch each other's all-time favorite movie` },
  { id: 9,  category: 'romance',   emoji: '💆', text: `Get a couple's massage together` },
  { id: 10, category: 'romance',   emoji: '🛌', text: `Spend a whole Sunday in bed with zero plans` },
  // Adventure (10)
  { id: 11, category: 'adventure', emoji: '🚗', text: `Road trip with no destination, just vibes` },
  { id: 12, category: 'adventure', emoji: '✈️', text: `Go to a city neither of us has ever been` },
  { id: 13, category: 'adventure', emoji: '🪂', text: `Try something terrifying together (skydiving, cliff jump, etc.)` },
  { id: 14, category: 'adventure', emoji: '⛺', text: `Spend a night camping under real stars` },
  { id: 15, category: 'adventure', emoji: '🗺️', text: `Get spontaneously lost in a new city` },
  { id: 16, category: 'adventure', emoji: '🍜', text: `Try a food neither of us has ever eaten` },
  { id: 17, category: 'adventure', emoji: '🚂', text: `Take a night train somewhere` },
  { id: 18, category: 'adventure', emoji: '💃', text: `Learn something new together (dance, language, cooking class)` },
  { id: 19, category: 'adventure', emoji: '🎶', text: `Go to a concert of a band we both love` },
  { id: 20, category: 'adventure', emoji: '🌊', text: `Swim in the ocean at night` },
  // Intimate (10)
  { id: 21, category: 'intimate',  emoji: '🤍', text: `Spend a full day doing nothing but touching and talking` },
  { id: 22, category: 'intimate',  emoji: '🕯️', text: `Give each other a real massage with no rush` },
  { id: 23, category: 'intimate',  emoji: '📵', text: `Have a night where phones are completely off for 12 hours` },
  { id: 24, category: 'intimate',  emoji: '🛁', text: `Bath together with candles and music` },
  { id: 25, category: 'intimate',  emoji: '📖', text: `Read to each other in bed` },
  { id: 26, category: 'intimate',  emoji: '🌃', text: `Fall asleep on the phone together when we're apart` },
  { id: 27, category: 'intimate',  emoji: '☀️', text: `Have breakfast in bed and stay there until noon` },
  { id: 28, category: 'intimate',  emoji: '💬', text: `Write down 10 things we love about each other and read them aloud` },
  { id: 29, category: 'intimate',  emoji: '📸', text: `Take slow photos of each other — really look` },
  { id: 30, category: 'intimate',  emoji: '💞', text: `Have the most honest conversation we've ever had` },
  // Dreams (10)
  { id: 31, category: 'dreams',    emoji: '🌍', text: `Pick a country we'll visit together someday` },
  { id: 32, category: 'dreams',    emoji: '🏡', text: `Describe our dream home in detail` },
  { id: 33, category: 'dreams',    emoji: '☕', text: `Talk about what we want our mornings to look like in 5 years` },
  { id: 34, category: 'dreams',    emoji: '👶', text: `Name our future kids (even if it's just for fun)` },
  { id: 35, category: 'dreams',    emoji: '🗓️', text: `Plan a trip we'll take on our first anniversary` },
  { id: 36, category: 'dreams',    emoji: '🌟', text: `Design our perfect day from morning to night` },
  { id: 37, category: 'dreams',    emoji: '📝', text: `Write a letter to our future selves as a couple` },
  { id: 38, category: 'dreams',    emoji: '🎊', text: `Choose a tradition we want to keep every year` },
  { id: 39, category: 'dreams',    emoji: '👨‍👩‍👦', text: `Talk about what kind of parents we'd be` },
  { id: 40, category: 'dreams',    emoji: '💫', text: `Say out loud: what do I want this relationship to look like in 10 years?` },
];
