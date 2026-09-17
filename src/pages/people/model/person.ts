/**
 * The lab roster. Page-local on purpose: nothing outside the people page
 * reads it, so extracting a `person` entity would be speculative.
 */
export interface Person {
  readonly name: string;
  readonly role: string;
  /** Path under `public/`, or undefined while a portrait is outstanding. */
  readonly photo?: string;
  /** A short first-person or third-person bio, rendered under the role.
   *  Omitted where none has been written yet — the card stays compact. */
  readonly bio?: string;
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
  bio: 'Studies how teams of robots learn to coordinate — the strategies they form, the skills individual robots acquire, and the conditions under which that coordination holds or breaks — with a broader interest in world-action models and how learned policies stay robust inside a team. PhD researcher at the MARMoT Lab (NUS) supervised by Guillaume Sartoretti; before robotics, a chartered accountant and MIT supply-chain graduate.',
  topics: [],
  links: {
    website: 'https://www.william-teo.com',
    scholar: 'https://scholar.google.com/citations?user=kgn0kGkAAAAJ&hl=en',
    linkedin: 'https://www.linkedin.com/in/willteo/',
  },
};

const STAFF: readonly Person[] = [
  {
    name: 'Jun Hong',
    role: 'Principal AI Engineer',
    photo: '/uploads/people/jun-hong.webp',
    topics: ['Embedded software', 'Edge AI'],
    links: { linkedin: 'https://www.linkedin.com/in/leejunhong74/' },
  },
  {
    name: 'Krishna',
    role: 'Asst. Principal AI Engineer',
    photo: '/uploads/people/krishna.webp',
    bio: 'Research translation and proof-of-concept development, bridging academic research from institutes of higher learning to real-world applications. His work spans embodied AI for manipulation and loco-manipulation — perception and long-horizon planning, safe and generalisable embodied learning, and human–multi-agent collaboration. Holds a B.Eng. in electronics and communication engineering (VIT Vellore) and an M.Eng. in control and automation (NTU).',
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
    bio: 'Specialises in distributed AI-driven control architectures for cooperative heterogeneous robotic systems. Ph.D. in electrical engineering (Jadavpur University) on decentralised formation control and adaptive navigation of swarm robots; formerly a scientist at A*STAR leading research in intelligent navigation and multi-robot collaboration. His work bridges AI, control systems and robotics, and he holds patents across the US, Europe, Australia, India and Japan.',
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
    bio: 'Holds a Ph.D. in autonomous robotics and intelligent systems (NTU). Works at the convergence of swarm autonomy, drone systems, SLAM, and learning-based locomotion and whole-body control, building resilient, field-ready robotic systems that bridge simulation, experimentation and deployment at scale.',
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
    photo: '/uploads/people/jeremy.webp',
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
