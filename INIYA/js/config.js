// ============================================================
// config.js — ALL editable content lives here.
// Edit this file to change text, photos, captions, the
// password, the song, and everything Mochi says.
// ============================================================

const CONFIG = {

  // ── Identity ──────────────────────────────────────────────
  NAME:     "Iniya",
  NICKNAME: "Cuite Pie",
  FROM:     "Rokith",

  // ── Lock Screen ───────────────────────────────────────────
  PASSCODE:      "5129",
  PASSCODE_HINT: "think of something special between us 💗",

  // ── Candles ───────────────────────────────────────────────
  CANDLE_COUNT: 5,

  // ── Music ─────────────────────────────────────────────────
  SONG: {
    src:    "assets/audio/song.mp3",
    title:  "Our Little Song",
    artist: "For Iniya 💗"
  },

  // ── Tab 1: Birthday Note ──────────────────────────────────
  birthdayNote: "Hey, Cuite Pie! 💗 Today isn't just another day. It's the day someone incredibly special came into this world. And I'm lucky enough to have you as a part of mine.",

  // ── Tab 2: Photo Book ─────────────────────────────────────
  photos: [
    { src: "assets/photos/photo1.jpg", caption: "a memory worth keeping." },
    { src: "assets/photos/photo2.jpg", caption: "one of my favourite people." },
    { src: "assets/photos/photo3.jpg", caption: "the little moments mean the most." },
    { src: "assets/photos/photo4.jpg", caption: "my favourite cuite pie." },
    { src: "assets/photos/photo5.jpg", caption: "you, being you ♡" },
    { src: "assets/photos/photo6.jpg", caption: "this smile? yes, this one." },
    { src: "assets/photos/photo7.jpg", caption: "no reason, just us." },
    { src: "assets/photos/photo8.jpg", caption: "still choosing our memories." }
  ],

  // ── Tab 3: Memories ───────────────────────────────────────
  memories: [
    {
      title:   "Class 6 – Where it all started",
      text:    "Two classmates, sharing the same school journey, without knowing what the future had planned.",
      style:   "wine-card",
      sticker: "camera"
    },
    {
      title:   "Class 10 – The farewell trip",
      text:    "A close-friends trip became an important chapter in our story. Somewhere along the way, things started becoming different.",
      style:   "notebook",
      sticker: "bow"
    },
    {
      title:   "The unexpected confession",
      text:    "You confessed through text. I already liked you, but I wasn't expecting those words from you.",
      style:   "chat-bubble",
      sticker: "envelope"
    },
    {
      title:   "May 5, 2025 – Our beginning",
      text:    "You confessed, and I replied immediately. That day became the beginning of us.",
      style:   "calendar",
      sticker: "heart",
      date:    "5"
    },
    {
      title:   "Today – Still choosing our memories",
      text:    "From our first conversations to all the little memories we've created, I'm glad our paths crossed.",
      style:   "envelope-card",
      sticker: "star"
    }
  ],

  qualities: [
    "your beautiful Bharatanatyam passion",
    "your talkative personality",
    "your friendly nature",
    "your way of making ordinary moments memorable",
    "and, of course, my Cuite Pie"
  ],

  closingNote: [
    "out of all the people I've met, I'm really glad I got to know you.",
    "05.05.2025 — a date I'll always keep special."
  ],

  // ── Tab 4: Letter ─────────────────────────────────────────
  LETTER: `My Dearest Iniya,

Who would've thought that two classmates from Class 6 would eventually become something so special? 🌷

From our Class 10 farewell trip to that unexpected text on May 5, 2025, our story has given me memories I'll always cherish.

I still remember how unexpectedly everything happened. You confessed first, and I didn't even need time to think about my answer. 💌

You will always be my first Cuite Pie, no matter how many new nicknames we come up with.

I hope this birthday brings you happiness, exciting opportunities, beautiful memories and everything your heart wishes for. 🎀

Keep dancing, keep talking, keep being your wonderful self.

Happy Birthday, Iniya! ❤️

Forever your biggest supporter,
Rokith

P.S. Mochi says you're the best human ever. 🐶 (He's right.)`,

  // ── Tab 5: Arcade Gifts ───────────────────────────────────
  GIFTS: [
    {
      icon:  "💌",
      name:  "A Forever Hug Coupon",
      note:  "redeemable anytime."
    },
    {
      icon:  "⭐",
      name:  "Cuite Pie Sticker Badge",
      note:  "you're officially my favourite."
    },
    {
      icon:  "🍫",
      name:  "One Treat of Your Choice",
      note:  "Rokith is buying."
    }
  ],

  GRAND_GIFT: {
    icon: "🎀",
    name: "Grand Birthday Gift",
    note: "out of all the people I've met, I'm really glad I got to know you. Happy Birthday, Cuite Pie! ❤️ 05.05.2025 — a date I'll always keep special."
  },

  BONUS_STICKERS: [
    "🌸 extra love sticker",
    "✨ sparkle badge",
    "💝 special heart sticker",
    "🎀 ribbon of joy"
  ],

  // ── Mochi Dialogue Lines ──────────────────────────────────
  puppyLines: {
    lock: [
      "woof! i have the key, but you have the code! 🗝️",
      "psst… enter the secret code and let's go! 🐾",
      "tail is wagging with excitement! hurry up! 🐶"
    ],
    wrongCode: [
      "hmm… try again, cutie pie! 🐾",
      "oops! that's not it! you can do it! 💗",
      "woof woof… close but not quite! 🤍"
    ],
    wish: [
      "make a wish and blow those candles! 🕯️",
      "i believe your wish will come true! ✨",
      "close your eyes and wish for something wonderful! 💫"
    ],
    blown: [
      "yay!! your wish is on its way! 🎉",
      "woohoo!! i felt that all the way over here! ✨",
      "did you make a good wish? i hope so! 🌟"
    ],
    photos: [
      "look at all these memories! 📸",
      "oh oh oh! i love this one! 🐾",
      "so many precious moments! let's look at them all! 💗"
    ],
    memories: [
      "aww, remember this one? 🥺",
      "that's the day! that's the one! 💗",
      "this is my favourite chapter of your story! 📖"
    ],
    letter: [
      "open it! open it! i'm so excited! 🐾",
      "it's a letter, written just for you! 💌",
      "tap the envelope! go on! ✨"
    ],
    arcade: [
      "let's play! i'm your biggest cheerleader! 🎮",
      "ready to win some gifts? let's go! 🎁",
      "i'll cheer for you no matter what! 🐾"
    ],
    gameStart: [
      "here we go! you've got this! 💪",
      "let's do this! woof woof! 🐶",
      "i believe in you! go go go! ✨"
    ],
    gameEnd: [
      "you did amazing!! gift time!! 🎁",
      "yayyy!! i knew you could do it! 🎉",
      "woohoo!! time to open your gift! 🎀"
    ],
    idle: [
      "psst… tap me if you want a tip! 🐾",
      "don't forget to explore all the tabs! ✨",
      "i'm always here if you need me! 💗"
    ]
  },

  tips: [
    "tap a polaroid to see it up close! 📸",
    "try blowing into your mic to blow the candles! 🕯️",
    "flip the stickers in memories to read sweet notes! 💌",
    "open the envelope in the letter tab! 💌",
    "play all 3 games to unlock the grand gift! 🎁",
    "tap me anytime for a little surprise! 🐶",
    "the music player is in the top right corner! 🎵"
  ]

}; // end CONFIG
