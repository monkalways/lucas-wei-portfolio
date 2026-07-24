/**
 * =============================================================================
 *  EDIT ME  —  All of Lucas's site copy lives here.
 * =============================================================================
 *  This is the ONLY file you need to touch to change the words on the site.
 *  Everything below is placeholder text written from Lucas's bio. Replace the
 *  strings with your real content whenever you're ready — the 3D scene and
 *  layout will update automatically.
 * =============================================================================
 */

export const hero = {
  name: 'LUCAS WEI',
  tagline: 'Student • Debater • Entrepreneur',
}

export const about = {
  title: 'About Me',
  // A short intro paragraph. Keep it a sentence or three.
  body: `I'm a Grade 8 student from Canada who's happiest in motion — on a court, in a debate round, or tracking down the next piece for my closet. I built Centre Court to keep tabs on what I'm working on, show a little personality, and chase a dream I'm working toward: one day getting into NYU Stern.`,
  // Small supporting lines shown beneath the paragraph.
  facts: [
    'Grade 8 at Grandview Heights Junior High.',
    'Always moving — tennis, golf, badminton, and pickleball.',
    'Debater and speaker, with a not-so-small fashion habit.',
    'Chasing the dream of one day making it to NYU Stern.',
  ],
}

export const hobbies = {
  title: 'Hobbies',
  // Each card links to /hobbies/<slug> — an in-depth page with photos.
  // To add photos: drop images in public/hobbies/ and list their paths in
  // `detail.images` (e.g. '/hobbies/tennis-1.jpg').
  items: [
    {
      slug: 'tennis',
      name: 'Tennis',
      blurb:
        'My first love on the court and the sport that got me hooked on competing — long baseline rallies, chasing down drop shots, and the mental chess of a tight tiebreak.',
      detail: {
        tagline: 'Baseline rallies, big serves, and the mental game.',
        paragraphs: [
          `Tennis is where I feel most at home. I started playing because I loved the competition, and I stuck with it for the rallies that feel like a conversation — every shot setting up the next.`,
          `Whether it's grinding out a long baseline point or going for a big first serve, the parts I love most are the mental ones: staying calm at four-all, reading my opponent, and finding a way to win the tight games.`,
        ],
        images: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
      },
    },
    {
      slug: 'golf',
      name: 'Golf',
      blurb:
        'The game I turn to when I want to slow down and focus — every round a fresh shot at a cleaner swing, a better read, and that one pure strike that keeps me coming back.',
      detail: {
        tagline: 'Quiet focus, one swing at a time.',
        paragraphs: [
          `Golf is my reset button. It's the sport I reach for when I want to slow everything down, focus on one swing at a time, and get out of my own head.`,
          `I'm always chasing a cleaner, more repeatable swing and smarter course management. There's nothing like the feeling of one pure strike — it's the shot that keeps pulling me back out for another round.`,
        ],
        images: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
      },
    },
    {
      slug: 'fashion',
      name: 'Fashion',
      blurb:
        'A not-so-small habit and a real passion — I care about fit, detail, and putting together something that feels like me (even if my wallet disagrees).',
      detail: {
        tagline: 'Fit, detail, and a wallet that never wins.',
        paragraphs: [
          `Fashion is how I express myself when I'm not on the court. I love the hunt — finding pieces with the right fit and details, and putting together outfits that actually feel like me.`,
          `I'll admit it's a bit of a spending problem. But building a wardrobe with real taste on a student budget is its own kind of challenge, and I'm always refining what my style says about me.`,
        ],
        images: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
      },
    },
    {
      slug: 'socializing',
      name: 'Socializing',
      blurb:
        'I run on people and momentum. I would take a busy room, a good conversation, or a packed schedule over sitting still and alone any day.',
      detail: {
        tagline: 'People, momentum, and never sitting still.',
        paragraphs: [
          `I get my energy from the people around me. Whether it's a group of friends, a debate club, or just a busy day with a full schedule, I'm at my best when there's momentum and conversation.`,
          `Sitting still and being isolated for too long isn't for me. I'd rather be organizing the next hangout, meeting new people, or throwing myself into something that keeps me moving.`,
        ],
        images: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
      },
    },
  ],
}

export const traveling = {
  title: 'Traveling',
  intro: 'Places that have left a mark on me so far.',
  destinations: [
    { place: 'Tokyo, Japan', note: 'Neon energy, incredible food, and a city that never stops moving — my kind of place.' },
    { place: 'Shanghai, China', note: 'Skyline for days and a buzz on every street corner.' },
    { place: 'Connecticut, USA', note: 'A quieter East-Coast change of pace — and a little closer to the NYU dream.' },
    { place: 'Cancún, Mexico', note: 'Beaches, sun, and a proper reset.' },
  ],
}

export const projects = {
  title: 'Projects',
  // icon must be one of the keys in `projectIcons` (see components/centre-court/sections.tsx):
  // brand | debate | leadership | next
  items: [
    {
      icon: 'brand',
      name: 'Wayup',
      blurb: 'My clothing brand — designing pieces I actually want to wear and learning how to build something real from the ground up.',
    },
    {
      icon: 'debate',
      name: 'Debate',
      blurb: 'Years of competitive debate — case-building, thinking fast on my feet, and getting sharper every round.',
    },
    {
      icon: 'leadership',
      name: 'Leadership',
      blurb: 'Stepping into student leadership as I head into high school — the clubs, teams, and initiatives I want to help run.',
    },
    {
      icon: 'next',
      name: 'What’s Next',
      blurb: 'Something new in the works — watch this space.', // TODO: swap in your next project when it takes shape
    },
  ],
}

export const skills = {
  title: 'Skills',
  // Each skill becomes an orbiting tennis ball. Keep it to ~6 for a clean orbit.
  items: [
    'Public Speaking',
    'Debate',
    'Marketing',
    'Networking',
    'Styling',
    'Sales',
  ],
}

export const contact = {
  title: 'Contact',
  subtitle: 'The lights are on. Game, set, message.',
  email: 'lucaswei2020@gmail.com',
  socials: [
    { label: 'Email', href: 'mailto:lucaswei2020@gmail.com' },
    { label: 'Instagram', href: 'https://instagram.com/lucaswei12' },
    // Add more when you're ready, e.g. Wayup's IG or a LinkedIn once you have one.
  ],
}

/**
 * The scoreboard labels + tennis scores shown in the HUD.
 * Scores advance as you scroll (0 → 15 → 30 → 40).
 */
export const scoreboard = [
  { label: 'ABOUT' },
  { label: 'PROJECTS' },
  { label: 'CONTACT' },
]

/**
 * Section order used by the scroll experience. Changing this array reorders
 * the whole site. Keep the ids in sync with the section components.
 */
export const sectionOrder = [
  'hero',
  'about',
  'hobbies',
  'traveling',
  'projects',
  'skills',
  'contact',
] as const

export type SectionId = (typeof sectionOrder)[number]
