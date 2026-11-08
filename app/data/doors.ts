export interface Door {
  c: string
  pl: string
  t: string
  s: string
  l: string[]
}

export const doorsData: Door[] = [
  {
    c: '#2b4a8b',
    pl: 'WEB<br>DEVELOPER',
    t: 'Web Development',
    s: 'End to end, from sketch to live site',
    l: [
      'Discovery & planning',
      'UX & visual design',
      'Front-end & back-end development',
      'Technical SEO & performance',
      'Analytics, launch & ongoing support',
    ],
  },
  {
    c: '#5b4d72',
    pl: 'APP<br>DEVELOPER',
    t: 'App Development',
    s: 'From idea to the app store',
    l: [
      'Product planning & scoping',
      'Mobile UI design',
      'Cross-platform builds',
      'Testing & store release',
      'Updates & maintenance',
    ],
  },
  {
    c: '#8bb08c',
    pl: 'UI/UX<br>DESIGNER',
    t: 'UI/UX Design',
    s: 'Research first, pixels second',
    l: [
      'Brand & business needs analysis',
      'User & competitor research',
      'Information architecture & flows',
      'Wireframes & high-fidelity UI',
      'Interactive prototyping & testing',
    ],
  },
  {
    c: '#c4572e',
    pl: 'GRAPHIC<br>DESIGNER',
    t: 'Graphic Design',
    s: 'Identity, social and print',
    l: [
      'Logo & brand identity',
      'Social media creatives',
      'Posters & print layouts',
      'Pitch decks & presentations',
      'Illustrations & packaging',
    ],
  },
]