export type QuestionType = 'text' | 'choice';

export interface Question {
  id: number;
  category: number; // 1 to 7
  categoryName: string;
  type: QuestionType;
  question: string;
  options?: string[];
}

export const questionsData: Question[] = [
  // Category 1: How We First Met
  { id: 1, category: 1, categoryName: 'How We First Met', type: 'text', question: 'How did the very first moment you saw me in person compare to what you had imagined?' },
  { id: 2, category: 1, categoryName: 'How We First Met', type: 'choice', question: 'When I first walked in to meet you, what was your immediate reaction?', options: ['My heart was racing and I could barely breathe', 'I felt calm and strangely at ease', 'I was surprised — you were even better than I imagined', 'I was overwhelmed and a little emotional'] },
  { id: 3, category: 1, categoryName: 'How We First Met', type: 'text', question: 'In the first moments, were you more nervous or more excited — and which one took over?' },
  { id: 4, category: 1, categoryName: 'How We First Met', type: 'choice', question: 'Was there a moment during our first meeting when you truly relaxed and felt at ease?', options: ['Yes, almost immediately when you smiled', 'After a few minutes of talking', 'When we started laughing together', 'I was nervous almost the whole time but in a good way'] },
  { id: 5, category: 1, categoryName: 'How We First Met', type: 'text', question: 'What did you think about where we met and the time we had together? Would you change anything?' },
  { id: 6, category: 1, categoryName: 'How We First Met', type: 'choice', question: 'As you went home that evening, what feeling stayed with you the longest?', options: ['Excitement and longing to see you again', 'A deep sense of peace that I made the right choice', 'Huge relief that the nervousness was finally gone', 'All of the above'] },
  { id: 7, category: 1, categoryName: 'How We First Met', type: 'text', question: 'What went better than you expected that day? Was there anything that surprised you in a really good way?' },
  { id: 8, category: 1, categoryName: 'How We First Met', type: 'choice', question: 'How did we say goodbye that day, and how did that moment feel?', options: ['It felt too soon — I was not ready to leave', 'It was bittersweet but warm', 'It felt natural and comfortable', 'It made me emotional in a way I did not expect'] },
  { id: 9, category: 1, categoryName: 'How We First Met', type: 'text', question: 'Were there comfortable silences between us? How did those feel — awkward or natural?' },
  { id: 10, category: 1, categoryName: 'How We First Met', type: 'text', question: 'Looking back now, what is the one detail from that day that you keep coming back to in your mind?' },

  // Category 2: How You See Me
  { id: 11, category: 2, categoryName: 'How You See Me', type: 'text', question: 'What was your very first impression of me, and has it changed now?' },
  { id: 12, category: 2, categoryName: 'How You See Me', type: 'choice', question: 'If you had to describe my personality based on our interactions, what would you choose?', options: ['Affectionate, supportive, and a good listener', 'Ambitious, practical, and focused on my future', 'Fun, spontaneous, and loves life', 'Calm, slightly mysterious, and deep', 'All of the above'] },
  { id: 13, category: 2, categoryName: 'How You See Me', type: 'text', question: 'When I talk passionately about coding or music, how do you perceive this passion in my personality?' },
  { id: 14, category: 2, categoryName: 'How You See Me', type: 'choice', question: 'What trait of mine makes you feel most comfortable with me?', options: ['How you listen and accept my thoughts', 'Your calm tone of voice', 'Your ability to make me laugh', 'Your honesty and absolute clarity', 'All of the above'] },
  { id: 15, category: 2, categoryName: 'How You See Me', type: 'text', question: 'What is a flaw or habit you have noticed in me that you think will require some understanding between us?' },
  { id: 16, category: 2, categoryName: 'How You See Me', type: 'choice', question: 'How do you imagine my role in your life?', options: ['The friend I share all my secrets with', 'My safe haven during crises', 'My romantic partner', 'All of the above'] },
  { id: 17, category: 2, categoryName: 'How You See Me', type: 'text', question: 'What is something I said or did that left a deep, unforgettable positive impact on your heart?' },
  { id: 18, category: 2, categoryName: 'How You See Me', type: 'choice', question: 'If you wished I expressed something more in our relationship, what would it be?', options: ['Expressing your feelings more clearly', 'Sharing more details of your day with me', 'Taking the initiative to check on me more often', 'Showing the fun and crazy side of your personality', 'All of the above'] },
  { id: 19, category: 2, categoryName: 'How You See Me', type: 'choice', question: 'How do you view my way of handling stress and problems?', options: ['You handle them calmly and rationally', 'You get a bit tense but always find solutions', 'You isolate yourself and need space', 'All of the above'] },
  { id: 20, category: 2, categoryName: 'How You See Me', type: 'text', question: 'Based on everything you know, what is the biggest thing that makes me different from anyone else you have known?' },

  // Category 3: Boundaries & Physical Space
  { id: 21, category: 3, categoryName: 'Boundaries & Physical Space', type: 'choice', question: 'In all honesty, how do you feel about physical closeness between us as we continue to grow together?', options: ['I want to take it slowly and let it feel natural', 'Holding hands and warm hugs feel right to me', 'I am comfortable showing affection when we are together', 'All of the above'] },
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
  { id: 43, category: 5, categoryName: 'Compatibility & Future', type: 'text', question: 'How do you see our ability to keep the warmth between us strong even across the distance we still have?' },
  { id: 44, category: 5, categoryName: 'Compatibility & Future', type: 'choice', question: 'What is the acceptable limit of jealousy for you?', options: ['I love obvious jealousy, it makes me feel valued', 'I accept rational jealousy that doesn\'t restrict my freedom', 'I hate jealousy and consider it a lack of trust', 'All of the above'] },
  { id: 45, category: 5, categoryName: 'Compatibility & Future', type: 'text', question: 'When I need some isolation to focus on my coding or work, how will you handle my need for space without feeling ignored?' },
  { id: 46, category: 5, categoryName: 'Compatibility & Future', type: 'choice', question: 'What is your expectation or goal for this relationship right now?', options: ['Building a strong foundation for a serious future/marriage', 'Getting to know each other calmly and exploring our compatibility first', 'Enjoying the present moment without pressure', 'All of the above'] },
  { id: 47, category: 5, categoryName: 'Compatibility & Future', type: 'text', question: 'What financial or practical decision could a partner make that you would consider a disaster or a reason to end things?' },
  { id: 48, category: 5, categoryName: 'Compatibility & Future', type: 'choice', question: 'If we had to decide where to settle down in the future, what matters most to you?', options: ['Being close to my family and city', 'Career opportunities and quality of life', 'Living in a calm and peaceful city', 'All of the above'] },
  { id: 49, category: 5, categoryName: 'Compatibility & Future', type: 'text', question: 'What is your biggest fear about the idea of formal commitment and building a shared life?' },
  { id: 50, category: 5, categoryName: 'Compatibility & Future', type: 'text', question: 'Finally, what is the one question you wished I had asked you in this game? (The floor is yours).' },

  // Category 6: The Fun & Silly Side
  { id: 51, category: 6, categoryName: 'The Fun & Silly Side', type: 'text', question: 'If we were stuck in an elevator for 5 hours, what is the first crazy thing you would do?' },
  { id: 52, category: 6, categoryName: 'The Fun & Silly Side', type: 'choice', question: 'Which of these silly couple habits sounds the most like something we would end up doing?', options: ['Giving each other weird nicknames', 'Having fake dramatic arguments over what to eat for dinner', 'Having a staring contest until someone bursts into laughter', 'All of the above'] },
  { id: 53, category: 6, categoryName: 'The Fun & Silly Side', type: 'text', question: 'If you had to choose a ridiculous theme song that plays every time I walk into the room, what would it be?' },
  { id: 54, category: 6, categoryName: 'The Fun & Silly Side', type: 'choice', question: 'If I tried to cook for you and completely burned the food, what would you do?', options: ['Eat it anyway with a forced smile', 'Laugh uncontrollably and order pizza', 'Tease me about it for the rest of my life', 'All of the above'] },
  { id: 55, category: 6, categoryName: 'The Fun & Silly Side', type: 'text', question: 'What is the most embarrassing, funniest moment you have ever had that still makes you laugh today?' },
  { id: 56, category: 6, categoryName: 'The Fun & Silly Side', type: 'choice', question: 'What kind of game would you definitely beat me at?', options: ['A staring contest', 'A dancing competition', 'Mario Kart or a video game', 'Who can eat the most pizza', 'All of the above'] },
  { id: 57, category: 6, categoryName: 'The Fun & Silly Side', type: 'text', question: 'If I woke you up at 3 AM with a terrible dad joke, would you laugh or be angry?' },
  { id: 58, category: 6, categoryName: 'The Fun & Silly Side', type: 'choice', question: 'What is your guilty pleasure when nobody is watching?', options: ['Singing loudly in the shower', 'Eating a whole tub of ice cream', 'Watching cheesy romantic comedies', 'Talking to your reflection in the mirror', 'All of the above'] },
  { id: 59, category: 6, categoryName: 'The Fun & Silly Side', type: 'text', question: 'If we suddenly switched bodies for one day, what is the first thing you would do in my body?' },
  { id: 60, category: 6, categoryName: 'The Fun & Silly Side', type: 'text', question: 'If we had to wear matching outfits for a day in public, what silly or cute theme would you choose?' },

  // Category 7: After Meeting
  { id: 61, category: 7, categoryName: 'After Meeting', type: 'text', question: 'How did you feel in the first moments after we said goodbye and went our separate ways?' },
  { id: 62, category: 7, categoryName: 'After Meeting', type: 'choice', question: 'When I first walked in to meet you, what was your immediate reaction?', options: ['My heart was racing and I could barely breathe', 'I felt calm and strangely at ease', 'I was surprised — you were even better than I imagined', 'I was overwhelmed and a little emotional', 'All of the above'] },
  { id: 63, category: 7, categoryName: 'After Meeting', type: 'text', question: 'Did the real me match the image you had built in your mind? What was different, and what was exactly right?' },
  { id: 64, category: 7, categoryName: 'After Meeting', type: 'text', question: 'What is the one moment from our day together that you keep replaying in your head?' },
  { id: 65, category: 7, categoryName: 'After Meeting', type: 'choice', question: 'After spending the day together, how do you feel about us now compared to before we met?', options: ['Even more certain and hopeful than before', 'Exactly as I expected — this feels right', 'I need a little time to process my feelings', 'My feelings grew stronger than I thought possible', 'All of the above'] },
  { id: 66, category: 7, categoryName: 'After Meeting', type: 'text', question: 'Was there something you wanted to say or do during our meeting but held back? What was it?' },
  { id: 67, category: 7, categoryName: 'After Meeting', type: 'text', question: 'What is one thing about me that surprised you the most after seeing me in person?' },
  { id: 68, category: 7, categoryName: 'After Meeting', type: 'choice', question: 'Is there anything about the day you wish had gone differently?', options: ['I wish we had more time together', 'I wish I had been less nervous at the start', 'I wish I had said something I kept to myself', 'Everything was perfect the way it was', 'All of the above'] },
  { id: 69, category: 7, categoryName: 'After Meeting', type: 'text', question: 'Knowing what you know now after meeting me, what does your heart tell you about where this is going?' },
  { id: 70, category: 7, categoryName: 'After Meeting', type: 'text', question: 'What do you want our next meeting to look like, and when do you want it to happen?' },
];
