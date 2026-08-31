/**
 * The lab roster. Page-local on purpose: nothing outside the people page
 * reads it, so extracting a `person` entity would be speculative.
 */
export interface Person {
  readonly name: string;
  readonly role: string;
  /** Path under `public/`, or undefined while a portrait is outstanding. */
  readonly photo?: string;
  readonly topics: readonly string[];
  readonly links?: PersonLinks;
}

export interface PersonLinks {
  readonly website?: string;
  readonly scholar?: string;
  readonly linkedin?: string;
  readonly github?: string;
}

export interface PersonGroup {
  readonly title: string;
  readonly people: readonly Person[];
}

export const LAB_LEAD: Person = {
  name: 'William Teo',
  role: 'Head, NEAR Lab',
  photo: '/uploads/people/william.jpeg',
  topics: [],
  links: { linkedin: 'https://www.linkedin.com/in/willteo/' },
};

const STAFF: readonly Person[] = [
  {
    name: 'Jun Hong',
    role: 'Principal AI Engineer',
    photo: '/uploads/people/jun-hong.png',
    topics: ['Embedded software', 'Edge AI'],
    links: { linkedin: 'https://www.linkedin.com/in/leejunhong74/' },
  },
  {
    name: 'Krishna',
    role: 'Asst. Principal AI Engineer',
    photo: '/uploads/people/krishna.jpg',
    topics: [
      'Multimodal perception',
      'Manipulation',
      'RL-based locomotion',
      'Whole-body control',
    ],
    links: {
      website: 'https://krishna22112023.github.io/',
      scholar: 'https://scholar.google.com/citations?user=gHmg-iwAAAAJ&hl=en',
      linkedin: 'https://www.linkedin.com/in/srikrishna-iyer-449a27143/',
      github: 'https://github.com/krishna22112023',
    },
  },
  {
    name: 'Dibyendu Roy',
    role: 'Principal AI Engineer',
    photo: '/uploads/people/roy.png',
    topics: ['Multi-robot drone swarms'],
    links: {
      scholar: 'https://scholar.google.com/citations?user=7wXXB3AAAAAJ&hl=en',
      linkedin: 'https://sg.linkedin.com/in/dibyendu-roy-phd-11bb6569',
    },
  },
  {
    name: 'Jiaying',
    role: 'Principal AI Engineer',
    photo: '/uploads/people/jiaying.jpeg',
    topics: ['Multimodal perception', 'Navigation & locomotion'],
    links: {
      linkedin: 'https://sg.linkedin.com/in/jiaying-chen-33bb6510b',
    },
  },
  {
    name: 'Kenneth',
    role: 'Senior AI Engineer',
    photo: '/uploads/people/kenneth.jpeg',
    topics: ['World models', 'Sim2real & digital twins'],
    links: {
      scholar: 'https://scholar.google.com/citations?user=pp9IhSQAAAAJ&hl=en',
      linkedin: 'https://www.linkedin.com/in/kenneth-ongjk/',
    },
  },
  {
    name: 'Jeremy',
    role: 'AI Engineer',
    photo: '/uploads/people/jeremy.png',
    topics: ['Software integration', 'Multi-robot drone swarms'],
    links: {
      linkedin: 'https://www.linkedin.com/in/jeremychh/',
      github: 'https://github.com/JChiaHH',
    },
  },
  {
    name: 'Sean Fong',
    role: 'Lab Manager, Principal AI Engineer',
    photo: '/uploads/people/sean-fong.png',
    topics: ['Drone flight ops'],
    links: {
      linkedin: 'https://www.linkedin.com/in/sean-fong-b8269543/',
    },
  },
];

const CURRENT_INTERNS: readonly Person[] = [
  {
    name: 'Nerissa Kho',
    role: 'Intern · SUTD',
    photo: '/uploads/people/nerissa.png',
    topics: ['Drone formation', 'Sim2real & digital twins'],
    links: {
      website: 'https://sites.google.com/view/nerissa-kho/home',
      linkedin: 'https://sg.linkedin.com/in/nerissa-kho-7ba5b4224',
    },
  },
];

export const PEOPLE_GROUPS: readonly PersonGroup[] = [
  { title: 'Staff', people: STAFF },
  { title: 'Current interns', people: CURRENT_INTERNS },
];

export interface Alumnus {
  readonly name: string;
  readonly role: string;
  readonly href: string;
}

export const ALUMNI: readonly Alumnus[] = [
  { name: 'Vetrivel Karthikeyan', role: 'Intern · NUS, 2026', href: '#' },
  { name: 'Kaung Myat Min', role: 'Intern · Republic Polytechnic, 2026', href: '#' },
  { name: 'Aqeel', role: 'Intern · Republic Polytechnic, 2026', href: '#' },
  { name: 'Wing Ho', role: 'Intern · NUS, 2026', href: '#' },
];
