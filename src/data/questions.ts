export type QuestionType = 'text' | 'choice';

export interface Question {
  id: number;
  category: number; // 1 to 5
  categoryName: string;
  type: QuestionType;
  question: string;
  options?: string[];
}

export const questionsData: Question[] = [
  // Category 1: Meeting May 11 & Expectations
  { id: 1, category: 1, categoryName: 'Meeting May 11 & Expectations', type: 'text', question: 'How do you imagine the very first moment we meet face-to-face in Meknes?' },
  { id: 2, category: 1, categoryName: 'Meeting May 11 & Expectations', type: 'choice', question: 'Do you prefer our first meeting to be in...?', options: ['A public and crowded place so you feel comfortable', 'A quiet place that allows for deep conversation', 'A long walking tour through the streets of Meknes', 'All of the above'] },
  { id: 3, category: 1, categoryName: 'Meeting May 11 & Expectations', type: 'text', question: 'If you feel nervous or shy when we meet, what is something I can do to make you feel instantly at ease?' },
  { id: 4, category: 1, categoryName: 'Meeting May 11 & Expectations', type: 'choice', question: 'If you suddenly feel awkward while we are sitting together, what would you prefer I do?', options: ['Change the subject to something funny', 'Give you some comfortable silence', 'Ask you directly if you are okay', 'All of the above'] },
  { id: 5, category: 1, categoryName: 'Meeting May 11 & Expectations', type: 'text', question: 'Are there any time constraints (like when you need to be home) that I should plan around?' },
  { id: 6, category: 1, categoryName: 'Meeting May 11 & Expectations', type: 'choice', question: 'At the end of our first day together, what feeling do you hope to go home with?', options: ['Excitement and longing for our second meeting', 'A deep sense of peace that you made the right choice', 'Huge relief that the nervousness is finally gone', 'All of the above'] },
  { id: 7, category: 1, categoryName: 'Meeting May 11 & Expectations', type: 'text', question: 'What is the worst-case scenario you fear might happen on May 11, and how can we prevent it?' },
  { id: 8, category: 1, categoryName: 'Meeting May 11 & Expectations', type: 'choice', question: 'How do you prefer we end our first meeting?', options: ['A quick, smiling goodbye', 'A warm hug', 'Sitting for a moment just looking at each other before leaving', 'All of the above'] },
  { id: 9, category: 1, categoryName: 'Meeting May 11 & Expectations', type: 'text', question: 'Would silence between us during our meeting bother you, or do you consider it comfortable?' },
  { id: 10, category: 1, categoryName: 'Meeting May 11 & Expectations', type: 'text', question: 'What is something I could wear or do that day that would make you smile on the inside?' },

  // Category 2: How You See Me
  { id: 11, category: 2, categoryName: 'How You See Me', type: 'text', question: 'What was your very first impression of me, and has it changed now?' },
  { id: 12, category: 2, categoryName: 'How You See Me', type: 'choice', question: 'If you had to describe my personality based on our interactions, what would you choose?', options: ['Affectionate, supportive, and a good listener', 'Ambitious, practical, and focused on his future', 'Fun, spontaneous, and loves life', 'Calm, slightly mysterious, and deep', 'All of the above'] },
  { id: 13, category: 2, categoryName: 'How You See Me', type: 'text', question: 'When I talk passionately about coding or music, how do you perceive this passion in my personality?' },
  { id: 14, category: 2, categoryName: 'How You See Me', type: 'choice', question: 'What trait of mine makes you feel most comfortable with me?', options: ['How you listen and accept my thoughts', 'Your calm tone of voice', 'Your ability to make me laugh', 'Your honesty and absolute clarity', 'All of the above'] },
  { id: 15, category: 2, categoryName: 'How You See Me', type: 'text', question: 'What is a flaw or habit you have noticed in me that you think will require some understanding between us?' },
  { id: 16, category: 2, categoryName: 'How You See Me', type: 'choice', question: 'How do you imagine my role in your life?', options: ['The friend I share all my secrets with', 'My safe haven during crises', 'My romantic partner', 'All of the above'] },
  { id: 17, category: 2, categoryName: 'How You See Me', type: 'text', question: 'What is something I said or did that left a deep, unforgettable positive impact on your heart?' },
  { id: 18, category: 2, categoryName: 'How You See Me', type: 'choice', question: 'If you wished I expressed something more in our relationship, what would it be?', options: ['Expressing your feelings more clearly', 'Sharing more details of your day with me', 'Taking the initiative to check on me more often', 'Showing the fun and crazy side of your personality', 'All of the above'] },
  { id: 19, category: 2, categoryName: 'How You See Me', type: 'choice', question: 'How do you view my way of handling stress and problems?', options: ['You handle them calmly and rationally', 'You get a bit tense but always find solutions', 'You isolate yourself and need space', 'All of the above'] },
  { id: 20, category: 2, categoryName: 'How You See Me', type: 'text', question: 'Based on everything you know, what is the biggest thing that makes me different from anyone else you have known?' },

  // Category 3: Boundaries & Physical Space
  { id: 21, category: 3, categoryName: 'Boundaries & Physical Space', type: 'choice', question: 'In all honesty, what are your boundaries regarding physical closeness on our first meeting?', options: ['A handshake only, I need time to feel completely comfortable', 'Holding hands and a welcoming hug are beautiful', 'I prefer absolutely no physical contact at first', 'All of the above'] },
  { id: 22, category: 3, categoryName: 'Boundaries & Physical Space', type: 'text', question: 'How do you view showing affection (like holding hands) in public? Is it normal or does it cause you embarrassment?' },
  { id: 23, category: 3, categoryName: 'Boundaries & Physical Space', type: 'choice', question: 'If I make a spontaneous physical gesture and you feel uncomfortable, how will you react?', options: ['I will tell you gently and directly', 'I will step back slightly so you get the hint', 'I will stay quiet to avoid awkwardness', 'All of the above'] },
  { id: 24, category: 3, categoryName: 'Boundaries & Physical Space', type: 'text', question: 'What is the red line that, if crossed, would make you lose trust and pull away instantly?' },
  { id: 25, category: 3, categoryName: 'Boundaries & Physical Space', type: 'choice', question: 'Do you consider the idea of a "first kiss" early in the relationship to be...?', options: ['Way too early and unacceptable right now', 'Depends entirely on the moment and comfort level', 'A necessary romantic step to build chemistry', 'All of the above'] },
  { id: 26, category: 3, categoryName: 'Boundaries & Physical Space', type: 'text', question: 'What action do you consider an invasion of your personal space that you absolutely cannot accept?' },
  { id: 27, category: 3, categoryName: 'Boundaries & Physical Space', type: 'choice', question: 'If you are upset with me, how do you prefer I calm you down?', options: ['With a gentle touch like holding my hand', 'With logical words and practical solutions', 'By stepping away and giving me space to calm down', 'All of the above'] },
  { id: 28, category: 3, categoryName: 'Boundaries & Physical Space', type: 'text', question: 'With full transparency, what is a topic or hint you wish I would never bring up at this stage of our relationship?' },
  { id: 29, category: 3, categoryName: 'Boundaries & Physical Space', type: 'choice', question: 'Are you comfortable if I express admiration for your physical details and appearance right now?', options: ['Yes, that makes me very happy', 'I accept it if it is classy and respectful', 'No, I prefer focusing on my mind and personality for now', 'All of the above'] },
  { id: 30, category: 3, categoryName: 'Boundaries & Physical Space', type: 'text', question: 'How can I ensure you feel completely safe, respected, and heard in every moment we spend together?' },

  // Category 4: Emotional Needs & Conflict Resolution
  { id: 31, category: 4, categoryName: 'Emotional Needs & Conflict', type: 'choice', question: 'What is your usual way of expressing anger or upset?', options: ['Exploding and arguing to release energy', 'Complete silence and ignoring the other person', 'Discussing it calmly after some time has passed', 'All of the above'] },
  { id: 32, category: 4, categoryName: 'Emotional Needs & Conflict', type: 'text', question: 'How would I know you are upset with me without you explicitly saying it?' },
  { id: 33, category: 4, categoryName: 'Emotional Needs & Conflict', type: 'choice', question: 'If we disagree on an important topic, how do you prefer we handle the discussion?', options: ['Start by validating my opinion before sharing yours', 'Discussing it logically without emotion', 'Taking a timeout to calm down first', 'All of the above'] },
  { id: 34, category: 4, categoryName: 'Emotional Needs & Conflict', type: 'text', question: 'What is the one mistake you could never forgive a partner for, regardless of their excuses?' },
  { id: 35, category: 4, categoryName: 'Emotional Needs & Conflict', type: 'choice', question: 'What is the most important "Love Language" for you to feel cared for?', options: ['Hearing words of love and appreciation', 'Receiving thoughtful gifts', 'Quality time together', 'Acts of service and practical support', 'All of the above'] },
  { id: 36, category: 4, categoryName: 'Emotional Needs & Conflict', type: 'text', question: 'If I wanted to be honest about a behavior of yours that bothers me, how should I bring it up without hurting your pride?' },
  { id: 37, category: 4, categoryName: 'Emotional Needs & Conflict', type: 'choice', question: 'When are you in your most vulnerable psychological state?', options: ['When daily pressures and tasks pile up', 'When feeling disappointed by someone close to me', 'When I lack a sense of security and stability', 'All of the above'] },
  { id: 38, category: 4, categoryName: 'Emotional Needs & Conflict', type: 'text', question: 'Are you the type to forgive quickly and forget, or do mistakes build up inside you?' },
  { id: 39, category: 4, categoryName: 'Emotional Needs & Conflict', type: 'choice', question: 'If the attention between us started to fade or become routine, what would you do?', options: ['I would be direct and ask for attention', 'I would reduce my attention as a reaction', 'I would take the initiative to break the routine myself', 'All of the above'] },
  { id: 40, category: 4, categoryName: 'Emotional Needs & Conflict', type: 'text', question: 'What makes you truly trust a man\'s promises and know he isn\'t playing games?' },

  // Category 5: Compatibility & Future
  { id: 41, category: 5, categoryName: 'Compatibility & Future', type: 'text', question: 'We all have flaws. What is a difficult trait in your personality that you want me to understand and be patient with?' },
  { id: 42, category: 5, categoryName: 'Compatibility & Future', type: 'choice', question: 'How do you view privacy between us (like phones and messages)?', options: ['Absolute transparency, no secrets', 'Everyone has their privacy that must be respected', 'We share what we want, but without snooping or suspicion', 'All of the above'] },
  { id: 43, category: 5, categoryName: 'Compatibility & Future', type: 'text', question: 'How do you see our ability to maintain the warmth of our relationship despite the distance between Marrakesh and Meknes?' },
  { id: 44, category: 5, categoryName: 'Compatibility & Future', type: 'choice', question: 'What is the acceptable limit of jealousy for you?', options: ['I love obvious jealousy, it makes me feel valued', 'I accept rational jealousy that doesn\'t restrict my freedom', 'I hate jealousy and consider it a lack of trust', 'All of the above'] },
  { id: 45, category: 5, categoryName: 'Compatibility & Future', type: 'text', question: 'When I need some isolation to focus on my coding or work, how will you handle my need for space without feeling ignored?' },
  { id: 46, category: 5, categoryName: 'Compatibility & Future', type: 'choice', question: 'What is your expectation or goal for this relationship right now?', options: ['Building a strong foundation for a serious future/marriage', 'Getting to know each other calmly and exploring our compatibility first', 'Enjoying the present moment without pressure', 'All of the above'] },
  { id: 47, category: 5, categoryName: 'Compatibility & Future', type: 'text', question: 'What financial or practical decision could a partner make that you would consider a disaster or a reason to end things?' },
  { id: 48, category: 5, categoryName: 'Compatibility & Future', type: 'choice', question: 'If we had to decide where to settle down in the future, what matters most to you?', options: ['Being close to my family and city', 'Career opportunities and quality of life', 'Living in a calm and peaceful city', 'All of the above'] },
  { id: 49, category: 5, categoryName: 'Compatibility & Future', type: 'text', question: 'What is your biggest fear about the idea of formal commitment and building a shared life?' },
  { id: 50, category: 5, categoryName: 'Compatibility & Future', type: 'text', question: 'Finally, what is the one question you wished I had asked you in this game? (The floor is yours).' }
];
