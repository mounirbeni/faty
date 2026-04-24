export interface RapidFirePair {
  id: number;
  a: string;
  b: string;
  iconA: string;
  iconB: string;
}

export const rapidFirePairs: RapidFirePair[] = [
  {
    id: 1,
    iconA: 'eye',
    a: 'Long eye contact',
    iconB: 'smile',
    b: 'Whispering in the ear',
  },
  {
    id: 2,
    iconA: 'waves',
    a: 'Beach at sunset',
    iconB: 'mountain',
    b: 'Mountains in the fog',
  },
  {
    id: 3,
    iconA: 'message-square',
    a: 'Deep conversation',
    iconB: 'laugh',
    b: 'Laughing until you cry',
  },
  {
    id: 4,
    iconA: 'moon',
    a: 'Night owl',
    iconB: 'sun',
    b: 'Early riser',
  },
  {
    id: 5,
    iconA: 'sparkles',
    a: 'Small gestures daily',
    iconB: 'gift',
    b: 'Big romantic surprises',
  },
  {
    id: 6,
    iconA: 'home',
    a: 'Cozy stay-in date',
    iconB: 'building',
    b: 'Explore the city date',
  },
];
