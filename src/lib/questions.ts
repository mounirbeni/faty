export type QuestionType = "text" | "multiple-choice";

export interface BaseQuestion {
  id: number;
  level: number; // 1 to 5
  question: string;
  type: QuestionType;
}

export interface TextQuestion extends BaseQuestion {
  type: "text";
  placeholder: string;
}

export interface MultipleChoiceOption {
  id: string;
  label: string;
  icon: string; // Lucide icon name
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice";
  options: MultipleChoiceOption[];
}

export type Question = TextQuestion | MultipleChoiceQuestion;

export interface Answer {
  questionId: number;
  value: string;
  reversed: boolean; // if true, the user played a "Reverse Card" and skipped it
}

// ─── Level metadata ──────────────────────────────────────────────────

export interface LevelMeta {
  level: number;
  title: string;
  icon: string;
  description: string;
  colorFrom: string;
  colorTo: string;
  accentHex: string;
}

export const levels: LevelMeta[] = [
  {
    level: 1,
    title: "اللقاء الأول والتوقعات",
    icon: "sparkles",
    description: "دعنا نكسر الجليد…",
    colorFrom: "from-sky-400",
    colorTo: "to-indigo-400",
    accentHex: "#38bdf8",
  },
  {
    level: 2,
    title: "كيف تراني",
    icon: "eye",
    description: "من خلال عينيك…",
    colorFrom: "from-violet-400",
    colorTo: "to-fuchsia-400",
    accentHex: "#c084fc",
  },
  {
    level: 3,
    title: "العمق العاطفي",
    icon: "waves",
    description: "نتعمق أكثر…",
    colorFrom: "from-fuchsia-400",
    colorTo: "to-rose-400",
    accentHex: "#e879f9",
  },
  {
    level: 4,
    title: "مرح وخيال",
    icon: "dice",
    description: "لنتخيل معاً…",
    colorFrom: "from-rose-400",
    colorTo: "to-orange-400",
    accentHex: "#fb7185",
  },
  {
    level: 5,
    title: "رومانسية وأسرار",
    icon: "flame",
    description: "بيننا فقط…",
    colorFrom: "from-red-500",
    colorTo: "to-rose-600",
    accentHex: "#ef4444",
  },
];

// ─── Romantic love notes shown between questions ─────────────────────

export const loveNotes: string[] = [
  "كل إجابة تجعلني أقع في حبك أكثر…",
  "يمكنني قراءة كلماتك للأبد.",
  "لا تعرفين كم يعني هذا بالنسبة لي.",
  "أنا أبتسم بشدة الآن.",
  "لا أطيق الانتظار لسماع هذه الأشياء منك شخصياً.",
  "قلبي تخطى نبضة وأنا أقرأ هذا.",
  "أنتِ أجمل شيء حدث في حياتي.",
  "أتمنى أن تعرفي كم أنتِ مميزة.",
  "شهر واحد. شهر واحد فقط.",
  "استمري… الأمر يزداد جمالاً.",
  "أعرف بالفعل أنني المحظوظ هنا.",
  "صدقك هو كل شيء بالنسبة لي.",
  "أتمنى لو أستطيع معانقتك عبر هذه الشاشة.",
  "هذا بالضبط سبب عدم قدرتي على التوقف عن التفكير فيكِ.",
  "أنتِ تجعلين المسافة تبدو وكأنها لا شيء.",
];

// ─── Level intro messages ────────────────────────────────────────────

export const levelIntros: Record<number, { title: string; subtitle: string; message: string }> = {
  1: {
    title: "الفصل الأول",
    subtitle: "اللقاء الأول والتوقعات",
    message: "قبل أن نلتقي، أريد أن أعرف ما يدور في هذا العقل الجميل. لنبدأ بشيء بسيط…",
  },
  2: {
    title: "الفصل الثاني",
    subtitle: "كيف تراني",
    message: "الآن أريد أن أرى نفسي من خلال عينيك. كوني صادقة — أحب الحقيقة.",
  },
  3: {
    title: "الفصل الثالث",
    subtitle: "العمق العاطفي",
    message: "نتعمق أكثر الآن. هذه الأسئلة تعني لي الكثير. خذي وقتك مع كل واحدة منها.",
  },
  4: {
    title: "الفصل الرابع",
    subtitle: "مرح وخيال",
    message: "حان الوقت لنمرح معاً. دعي خيالك ينطلق — أريد أن أحلم معكِ.",
  },
  5: {
    title: "الفصل الخامس",
    subtitle: "رومانسية وأسرار",
    message: "هذا الجزء لنا نحن فقط. بدون جدران أو قيود. هذه الإجابات ستبقى مقفلة حتى نلتقي.",
  },
};

// ─── THE 50 QUESTIONS ────────────────────────────────────────────────

export const questions: Question[] = [
  // --- LEVEL 1 (1-10) ---
  {
    id: 1,
    level: 1,
    type: "multiple-choice",
    question: "كيف تتخيلين شعورك في أول 5 ثوانٍ عندما نلتقي؟",
    options: [
      { id: "nervous", label: "سأكون متوترة جداً!", icon: "zap" },
      { id: "excited", label: "متحمسة وأريد القفز!", icon: "star" },
      { id: "speechless", label: "سأفقد النطق تماماً", icon: "message-square-dashed" },
      { id: "hug", label: "سأعانقك فوراً بدون تفكير", icon: "heart" },
    ],
  },
  {
    id: 2,
    level: 1,
    type: "text",
    question: "ما هو أكثر شيء تتطلعين للقيام به معاً في لقائنا الأول؟",
    placeholder: "مشي، قهوة، أو ربما مجرد الجلوس معاً...",
  },
  {
    id: 3,
    level: 1,
    type: "multiple-choice",
    question: "ما هو الشيء الذي تخشين أن تفعليه بسبب التوتر في لقائنا الأول؟",
    options: [
      { id: "stumble", label: "التعثر أو السقوط", icon: "footprints" },
      { id: "talk_fast", label: "التحدث بسرعة كبيرة", icon: "wind" },
      { id: "quiet", label: "السكوت وعدم معرفة ما أقول", icon: "moon" },
      { id: "blush", label: "الاحمرار خجلاً طوال الوقت", icon: "smile" },
    ],
  },
  {
    id: 4,
    level: 1,
    type: "text",
    question: "إذا كان لقاؤنا الأول له 'موسيقى تصويرية'، فأي أغنية ستكون؟",
    placeholder: "اكتبي اسم الأغنية...",
  },
  {
    id: 5,
    level: 1,
    type: "multiple-choice",
    question: "كيف تفضلين أن أقوم بتحيتك؟",
    options: [
      { id: "formal", label: "مصافحة رسمية ومضحكة", icon: "handshake" },
      { id: "long_hug", label: "عناق طويل", icon: "heart-handshake" },
      { id: "smile", label: "ابتسامة دافئة وكلمات رقيقة", icon: "sun" },
      { id: "surprise", label: "فاجئني بشيء لم أتوقعه", icon: "gift" },
    ],
  },
  {
    id: 6,
    level: 1,
    type: "text",
    question: "ما هو الزي الذي تتخيلين أنني سأرتديه، أو تتمنين أن أرتديه؟",
    placeholder: "أوصفيه لي...",
  },
  {
    id: 7,
    level: 1,
    type: "multiple-choice",
    question: "أين تفضلين أن نذهب في موعدنا الأول؟",
    options: [
      { id: "cafe", label: "مقهى هادئ", icon: "coffee" },
      { id: "walk", label: "مشي على الشاطئ", icon: "waves" },
      { id: "dinner", label: "عشاء رومانسي", icon: "utensils" },
      { id: "activity", label: "نشاط ممتع كالملاهي", icon: "ferris-wheel" },
    ],
  },
  {
    id: 8,
    level: 1,
    type: "text",
    question: "ما هو الانطباع الأول الذي أخذته عني عندما تحدثنا لأول مرة؟",
    placeholder: "هل كنت مزعجاً، مضحكاً، أم لطيفاً؟",
  },
  {
    id: 9,
    level: 1,
    type: "multiple-choice",
    question: "هل تعتقدين أننا سنبقى مستيقظين لوقت متأخر نتحدث؟",
    options: [
      { id: "yes", label: "بالتأكيد، لن نشعر بالوقت", icon: "clock" },
      { id: "no", label: "لا، سنكون متعبين", icon: "bed" },
      { id: "maybe", label: "ربما إذا كان الحديث مشوقاً", icon: "help-circle" },
    ],
  },
  {
    id: 10,
    level: 1,
    type: "text",
    question: "كلمة واحدة تصف شعورك الحالي بخصوص لقائنا المرتقب.",
    placeholder: "اكتبي الكلمة هنا...",
  },

  // --- LEVEL 2 (11-20) ---
  {
    id: 11,
    level: 2,
    type: "multiple-choice",
    question: "ما هي الصفة التي جذبتك إليّ في البداية؟",
    options: [
      { id: "humor", label: "حسك الفكاهي", icon: "laugh" },
      { id: "intellect", label: "طريقة تفكيرك", icon: "brain" },
      { id: "kindness", label: "لطفك واهتمامك", icon: "heart" },
      { id: "mystery", label: "غموضك", icon: "moon" },
    ],
  },
  {
    id: 12,
    level: 2,
    type: "text",
    question: "ما هي العادة الغريبة التي لاحظتيها فيّ وتحبينها؟",
    placeholder: "ربما طريقة كلامي، أو شيء أكرره دائماً...",
  },
  {
    id: 13,
    level: 2,
    type: "multiple-choice",
    question: "إذا كان بإمكاني أن أكون شخصية خيالية، فمن سأكون في نظرك؟",
    options: [
      { id: "hero", label: "البطل الشجاع", icon: "shield" },
      { id: "joker", label: "الشخصية المضحكة", icon: "smile" },
      { id: "thinker", label: "الحكيم الهادئ", icon: "book" },
      { id: "rebel", label: "المتمرد الرومانسي", icon: "flame" },
    ],
  },
  {
    id: 14,
    level: 2,
    type: "text",
    question: "ما هو أكثر شيء قلته وجعلك تضحكين من قلبك؟",
    placeholder: "تذكري موقفاً مضحكاً...",
  },
  {
    id: 15,
    level: 2,
    type: "multiple-choice",
    question: "كيف تعرفين أنني مهتم بك حقاً؟",
    options: [
      { id: "time", label: "من الوقت الذي نقضيه معاً", icon: "clock" },
      { id: "words", label: "من الكلمات التي أقولها", icon: "message-circle" },
      { id: "actions", label: "من الأفعال والاهتمام بالتفاصيل", icon: "check-circle" },
      { id: "intuition", label: "مجرد إحساس داخلي", icon: "sparkles" },
    ],
  },
  {
    id: 16,
    level: 2,
    type: "text",
    question: "متى كانت أول مرة أدركتِ فيها أننا قد نكون أكثر من مجرد أصدقاء؟",
    placeholder: "صفي لي تلك اللحظة...",
  },
  {
    id: 17,
    level: 2,
    type: "multiple-choice",
    question: "ما هو الشيء الذي تظنين أنني لا أعرفه عنك حتى الآن؟",
    options: [
      { id: "habit", label: "عادة سرية غريبة", icon: "ghost" },
      { id: "dream", label: "حلم طفولة لم أحققه", icon: "star" },
      { id: "fear", label: "خوف سخيف", icon: "alert-triangle" },
      { id: "talent", label: "موهبة مخفية", icon: "award" },
    ],
  },
  {
    id: 18,
    level: 2,
    type: "text",
    question: "ما هي التفصيلة الصغيرة في شخصيتي التي تظنين أن لا أحد غيرك يلاحظها؟",
    placeholder: "شيء مميز لاحظتيه أنت فقط...",
  },
  {
    id: 19,
    level: 2,
    type: "multiple-choice",
    question: "إذا كنت سأهديك شيئاً الآن، ماذا سيكون؟",
    options: [
      { id: "flowers", label: "باقة ورد", icon: "flower" },
      { id: "book", label: "كتاب مفضل", icon: "book-open" },
      { id: "food", label: "أكلتك المفضلة", icon: "pizza" },
      { id: "jewel", label: "قطعة مجوهرات ناعمة", icon: "gem" },
    ],
  },
  {
    id: 20,
    level: 2,
    type: "text",
    question: "إذا كان عليك وصفي لصديقتك المفضلة في جملة واحدة، ماذا ستقولين؟",
    placeholder: "هو شخص...",
  },

  // --- LEVEL 3 (21-30) ---
  {
    id: 21,
    level: 3,
    type: "multiple-choice",
    question: "متى تشعرين بالأمان الأكبر معي عبر الهاتف؟",
    options: [
      { id: "night", label: "في محادثات وقت النوم المفتوحة", icon: "moon" },
      { id: "sad", label: "عندما أكون حزينة وتستمع لي", icon: "ear" },
      { id: "silent", label: "عندما نصمت معاً ولا نشعر بالإحراج", icon: "mic-off" },
      { id: "laugh", label: "عندما نضحك على أشياء تافهة", icon: "smile" },
    ],
  },
  {
    id: 22,
    level: 3,
    type: "text",
    question: "ما هو الشيء الذي كنتي تخشين إخباري به في البداية ولكنك سعيدة أنك فعلتِ؟",
    placeholder: "كوني صريحة...",
  },
  {
    id: 23,
    level: 3,
    type: "multiple-choice",
    question: "كيف تفضلين أن أواسيكِ عندما تكونين حزينة؟",
    options: [
      { id: "listen", label: "مجرد الاستماع لي بإنصات", icon: "headphones" },
      { id: "advice", label: "إعطائي نصائح وحلول", icon: "lightbulb" },
      { id: "distract", label: "إضحاكي وتغيير الموضوع", icon: "party-popper" },
      { id: "presence", label: "البقاء معي بصمت", icon: "user-check" },
    ],
  },
  {
    id: 24,
    level: 3,
    type: "text",
    question: "ما هو أكبر عائق تعتقدين أننا تغلبنا عليه في مسافتنا هذه؟",
    placeholder: "المسافة، الشك، قلة التواصل...",
  },
  {
    id: 25,
    level: 3,
    type: "multiple-choice",
    question: "ما هو أكثر شيء تفتقدينه عندما نكون مشغولين ولا نستطيع التحدث؟",
    options: [
      { id: "voice", label: "سماع صوتك", icon: "volume-2" },
      { id: "texts", label: "رسائلك العشوائية المفاجئة", icon: "message-square" },
      { id: "laugh", label: "ضحكنا المشترك", icon: "smile-plus" },
      { id: "support", label: "شعوري بدعمك لي", icon: "shield-check" },
    ],
  },
  {
    id: 26,
    level: 3,
    type: "text",
    question: "متى شعرتِ لأول مرة أنني أصبحت جزءاً أساسياً من يومك؟",
    placeholder: "متى أدركتِ ذلك...",
  },
  {
    id: 27,
    level: 3,
    type: "multiple-choice",
    question: "كيف تعبرين عادة عن غضبك أو انزعاجك مني؟",
    options: [
      { id: "silent", label: "بالصمت وتجاهل رسائلك", icon: "mic-off" },
      { id: "direct", label: "أخبرك مباشرة وبوضوح", icon: "message-circle-warning" },
      { id: "hints", label: "أعطيك تلميحات لكي تفهم وحدك", icon: "eye" },
      { id: "sarcasm", label: "بالسخرية والردود الباردة", icon: "snowflake" },
    ],
  },
  {
    id: 28,
    level: 3,
    type: "text",
    question: "ما هي الذكرى المشتركة (حتى لو كانت مجرد مكالمة) التي تعودين إليها دائماً عندما تشتاقين لي؟",
    placeholder: "اكتبي لي عن تلك الذكرى...",
  },
  {
    id: 29,
    level: 3,
    type: "multiple-choice",
    question: "هل تعتقدين أن المسافة جعلتنا أقوى أم أضعف؟",
    options: [
      { id: "stronger", label: "أقوى، لأننا تعلمنا التواصل العميق", icon: "anchor" },
      { id: "weaker", label: "أحياناً أضعف بسبب قلة اللقاء", icon: "wind" },
      { id: "both", label: "مزيج من الاثنين معاً", icon: "scale" },
    ],
  },
  {
    id: 30,
    level: 3,
    type: "text",
    question: "إذا كان بإمكانك قراءة أفكاري لمدة دقيقة واحدة، في أي وقت كنتِ ستختارين فعل ذلك؟",
    placeholder: "متى تمنيتِ معرفة ما أفكر فيه...",
  },

  // --- LEVEL 4 (31-40) ---
  {
    id: 31,
    level: 4,
    type: "multiple-choice",
    question: "لو كنا في فيلم، أي نوع من الأفلام سيكون؟",
    options: [
      { id: "romcom", label: "كوميديا رومانسية مضحكة", icon: "clapperboard" },
      { id: "drama", label: "دراما عاطفية عميقة", icon: "tear" },
      { id: "adventure", label: "مغامرة مجنونة", icon: "compass" },
      { id: "mystery", label: "لغز غامض", icon: "search" },
    ],
  },
  {
    id: 32,
    level: 4,
    type: "text",
    question: "إذا هربنا معاً إلى أي مكان في العالم غداً، أين سنذهب؟",
    placeholder: "جزيرة منعزلة، مدينة مزدحمة، جبال الثلج...",
  },
  {
    id: 33,
    level: 4,
    type: "multiple-choice",
    question: "من سيكون الأسوأ في تجميع أثاث إيكيا معاً؟",
    options: [
      { id: "me", label: "أنا بالتأكيد، سأفقد صبري", icon: "frown" },
      { id: "you", label: "أنت، ستدعي أنك تعرف وتخربه", icon: "hammer" },
      { id: "team", label: "سنكون فريقاً ممتازاً!", icon: "star" },
      { id: "fight", label: "سنتشاجر ونتركه كما هو", icon: "swords" },
    ],
  },
  {
    id: 34,
    level: 4,
    type: "text",
    question: "ما هي الجريمة التافهة التي قد نرتكبها معاً؟",
    placeholder: "سرقة طعام بعضنا، تهريب حلويات للسينما...",
  },
  {
    id: 35,
    level: 4,
    type: "multiple-choice",
    question: "إذا كان علينا تناول طعام واحد فقط معاً لبقية حياتنا، فماذا تختارين؟",
    options: [
      { id: "pizza", label: "بيتزا بكل أنواعها", icon: "pizza" },
      { id: "sushi", label: "سوشي", icon: "fish" },
      { id: "burger", label: "برجر وبطاطس", icon: "utensils-crossed" },
      { id: "sweets", label: "حلويات وشوكولاتة فقط", icon: "cake" },
    ],
  },
  {
    id: 36,
    level: 4,
    type: "text",
    question: "إذا أصبحتُ أنا حيواناً أليفاً، أي حيوان سأكون ولماذا؟",
    placeholder: "قطة كسولة، كلب مخلص، عصفور مزعج...",
  },
  {
    id: 37,
    level: 4,
    type: "multiple-choice",
    question: "في رحلة برية طويلة، من الذي يتحكم في الراديو؟",
    options: [
      { id: "me", label: "أنا، ذوقي أفضل", icon: "music" },
      { id: "you", label: "أنت، لكي لا تتذمر", icon: "radio" },
      { id: "turns", label: "نتبادل الأدوار", icon: "refresh-cw" },
      { id: "silence", label: "نغلق الراديو ونتحدث", icon: "mic-off" },
    ],
  },
  {
    id: 38,
    level: 4,
    type: "text",
    question: "ما هو اللقب الغريب الذي تودين مناداتي به، لكنك تخجلين؟",
    placeholder: "كوني مبدعة...",
  },
  {
    id: 39,
    level: 4,
    type: "multiple-choice",
    question: "إذا استيقظنا ووجدنا أنفسنا قد تبادلنا الأجساد ليوم واحد، ما أول شيء ستفعلينه بجسدي؟",
    options: [
      { id: "hair", label: "أجرب تسريحات شعرك الغبية", icon: "scissors" },
      { id: "voice", label: "أتحدث بصوتك العميق لأخيف الناس", icon: "mic" },
      { id: "strength", label: "أرى كم أنا قوي", icon: "dumbbell" },
      { id: "sleep", label: "أنام فقط، لأنك تنام بعمق", icon: "bed" },
    ],
  },
  {
    id: 40,
    level: 4,
    type: "text",
    question: "إذا كنتِ ستكتبين كتاباً عنا، ما هو عنوان الكتاب؟",
    placeholder: "عنوان يعبر عن قصتنا...",
  },

  // --- LEVEL 5 (41-50) TIME CAPSULE ---
  {
    id: 41,
    level: 5,
    type: "multiple-choice",
    question: "ما هو أكثر شيء تتطلعين لاكتشافه في شخصيتي عند اللقاء؟",
    options: [
      { id: "touch", label: "لغة جسدك الحقيقية", icon: "hand" },
      { id: "scent", label: "رائحة عطرك", icon: "wind" },
      { id: "eyes", label: "طريقة نظرك إليّ مباشرة", icon: "eye" },
      { id: "voice", label: "صوتك بدون مرشحات الهاتف", icon: "volume-2" },
    ],
  },
  {
    id: 42,
    level: 5,
    type: "text",
    question: "ما هو السؤال الذي لطالما أردتِ طرحه عليّ، لكنك كنتِ مترددة؟",
    placeholder: "هذا هو الوقت المناسب...",
  },
  {
    id: 43,
    level: 5,
    type: "multiple-choice",
    question: "أين ترين علاقتنا بعد اللقاء الأول؟",
    options: [
      { id: "closer", label: "أقرب من أي وقت مضى", icon: "heart" },
      { id: "planning", label: "نخطط للقائنا الثاني فوراً", icon: "calendar" },
      { id: "comfortable", label: "مرتاحين تماماً وبدون توتر", icon: "smile" },
      { id: "dreaming", label: "نبدأ بالتفكير في مستقبلنا", icon: "star" },
    ],
  },
  {
    id: 44,
    level: 5,
    type: "text",
    question: "ما هو الشعور الذي تمنحك إياه فكرة 'نحن'؟",
    placeholder: "أمان، مغامرة، حب عميق...",
  },
  {
    id: 45,
    level: 5,
    type: "multiple-choice",
    question: "كيف تتخيلين صمتنا عندما نكون معاً في نفس الغرفة؟",
    options: [
      { id: "comfortable", label: "صمت مريح ومليء بالسلام", icon: "cloud" },
      { id: "tension", label: "صمت مليء بالتوتر الإيجابي والتأمل", icon: "zap" },
      { id: "rare", label: "لن يكون هناك صمت، سنتحدث كثيراً", icon: "message-square" },
      { id: "romantic", label: "صمت رومانسي بنظرات عميقة", icon: "heart" },
    ],
  },
  {
    id: 46,
    level: 5,
    type: "text",
    question: "ما هي الجملة التي قلتها لك ولا تزال عالقة في ذهنك؟",
    placeholder: "اكتبيها هنا...",
  },
  {
    id: 47,
    level: 5,
    type: "multiple-choice",
    question: "ما هو أكثر ما يخيفك بشأن التقدم في هذه العلاقة؟",
    options: [
      { id: "distance", label: "المسافة الجغرافية المستمرة", icon: "map" },
      { id: "changes", label: "تغير المشاعر أو الظروف", icon: "wind" },
      { id: "loss", label: "فقدان هذا التواصل العميق", icon: "link-2-off" },
      { id: "nothing", label: "لا شيء، أنا واثقة بنا", icon: "shield-check" },
    ],
  },
  {
    id: 48,
    level: 5,
    type: "text",
    question: "اكتبي رسالة قصيرة سأقرأها وأنا جالس بجانبك لأول مرة.",
    placeholder: "شيء تريدين أن أعرفه في تلك اللحظة بالضبط...",
  },
  {
    id: 49,
    level: 5,
    type: "multiple-choice",
    question: "إذا كان حبنا يمتلك لوناً، فماذا سيكون؟",
    options: [
      { id: "red", label: "أحمر عميق وعاطفي", icon: "flame" },
      { id: "blue", label: "أزرق هادئ ومريح", icon: "waves" },
      { id: "yellow", label: "أصفر مشرق ومليء بالبهجة", icon: "sun" },
      { id: "gold", label: "ذهبي دافئ وقيم", icon: "star" },
    ],
  },
  {
    id: 50,
    level: 5,
    type: "text",
    question: "أخيراً، هل أنتِ مستعدة لهذا الفصل الجديد معنا؟",
    placeholder: "كلمة أخيرة قبل أن نلتقي...",
  },
];
