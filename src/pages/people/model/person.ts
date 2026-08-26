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
  photo: '/uploads/william.jpeg',
  topics: [],
};

const STAFF: readonly Person[] = [
  {
    name: 'Jun Hong',
    role: 'Principal AI Engineer',
    photo: '/uploads/jun hong.png',
    topics: ['Embedded software', 'Edge AI'],
  },
  {
    name: 'Krishna',
    role: 'Asst. Principal AI Engineer',
    photo: '/uploads/krishna.png',
    topics: [
      'Multimodal perception',
      'Manipulation',
      'RL-based locomotion',
      'Whole-body control',
    ],
  },
  {
    name: 'Dibyendu Roy',
    role: 'Principal AI Engineer',
    photo: '/uploads/roy.png',
    topics: ['Multi-robot drone swarms'],
  },
  {
    name: 'Jiaying',
    role: 'Principal AI Engineer',
    photo: '/uploads/jiaying.jpeg',
    topics: ['Multimodal perception', 'Navigation & locomotion'],
  },
  {
    name: 'Kenneth',
    role: 'Senior AI Engineer',
    photo: '/uploads/kenneth.jpeg',
    topics: ['World models', 'Sim2real & digital twins'],
  },
  {
    name: 'Jeremy',
    role: 'AI Engineer',
    photo: '/uploads/Jeremy.png',
    topics: ['Software integration', 'Multi-robot drone swarms'],
  },
  {
    name: 'Sean Fong',
    role: 'Lab Manager, Principal AI Engineer',
    photo: '/uploads/Sean Fong.png',
    topics: ['Drone flight ops'],
  },
  {
    name: 'Shawn Soh',
    role: 'Principal AI Engineer',
    photo: '/uploads/shawn.jpeg',
    topics: ['Drone perception, navigation & planning'],
  },
];

const CURRENT_INTERNS: readonly Person[] = [
  {
    name: 'Nerissa Kho',
    role: 'Intern · SUTD',
    photo: '/uploads/nerissa.png',
    topics: ['Drone formation', 'Sim2real & digital twins'],
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
