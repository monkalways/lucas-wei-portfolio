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
  body: `I'm a student developer learning by building — web apps, small tools, and experiments that push me a little past what I already know. Welcome to Centre Court, a portfolio you walk through rather than scroll past.`,
  // Small supporting lines shown beneath the paragraph.
  facts: [
    'Studying computer science and teaching myself the rest.', // TODO: your school / program
    'Currently exploring 3D on the web, React, and interaction design.',
    'Looking for internships and first-role opportunities.',
  ],
}

export const hobbies = {
  title: 'Hobbies',
  items: [
    {
      name: 'Tennis',
      blurb: 'Weekend baseline rallies and the occasional questionable line call.',
    },
    {
      name: 'Photography',
      blurb: 'Chasing golden hour and the perfect candid frame.',
    },
    {
      name: 'Reading',
      blurb: 'Essays, sci-fi, and anything that reframes how I think.',
    },
    {
      name: 'Coffee',
      blurb: 'Pour-over rituals and a slightly excessive gear collection.',
    },
  ],
}

export const traveling = {
  title: 'Traveling',
  intro: 'Places that left a mark — and a few still on the list.',
  destinations: [
    { place: 'Tokyo, Japan', note: 'Neon nights and the quietest mornings.' },
    { place: 'Lisbon, Portugal', note: 'Tiled streets and endless viewpoints.' },
    { place: 'Banff, Canada', note: 'Impossible lakes and thin mountain air.' },
    { place: 'Seoul, South Korea', note: 'Food, design, and 2am street energy.' },
  ],
}

export const projects = {
  title: 'Projects',
  // icon must be one of the keys in `projectIcons` (see components/centre-court/sections.tsx):
  // debate | startup | code | leadership
  items: [
    {
      icon: 'debate',
      name: 'Competitive Debate',
      blurb: 'Tournaments, case-building, and thinking fast on my feet.', // TODO: name a top result or circuit
    },
    {
      icon: 'startup',
      name: 'Ventures',
      blurb: 'Turning ideas into something real — building products from zero.', // TODO: name your venture + what it does
    },
    {
      icon: 'code',
      name: 'Building',
      blurb: 'Web apps and small tools, mostly TypeScript and React.', // TODO: link a standout project
    },
    {
      icon: 'leadership',
      name: 'Leadership',
      blurb: 'Clubs, teams, and initiatives I’ve helped start and run.', // TODO: name a club/role
    },
  ],
}

export const skills = {
  title: 'Skills',
  // Each skill becomes an orbiting tennis ball. Keep it to ~6 for a clean orbit.
  items: ['HTML', 'CSS', 'TypeScript', 'React', 'Next.js', 'Git'],
}

export const contact = {
  title: 'Contact',
  subtitle: 'The lights are on. Game, set, message.',
  email: 'lucaswei2020@gmail.com',
  socials: [
    { label: 'Email', href: 'mailto:lucaswei2020@gmail.com' },
    // TODO: replace the # links below with your real profiles.
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'LinkedIn', href: 'https://linkedin.com/' },
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
