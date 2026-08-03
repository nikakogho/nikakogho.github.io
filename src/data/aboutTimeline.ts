export interface AboutMilestone {
  id: string;
  period: string;
  kind: string;
  title: string;
  summary: string;
  accent: string;
  link?: {
    label: string;
    to: string;
  };
}

export const aboutTimeline: AboutMilestone[] = [
  {
    id: 'playable-worlds',
    period: '2016–2020',
    kind: 'First experiments',
    title: 'Started by building playable worlds.',
    summary:
      'Self-employed Unity development gave me a place to turn strange ideas—including battle simulations and a 4D game—into things I could test.',
    accent: '#8bc7ff',
  },
  {
    id: 'production-software',
    period: '2020–2022',
    kind: 'Professional software',
    title: 'Moved from prototypes into production.',
    summary:
      'Freelance algorithms and simulations led into .NET and Angular work at Liberty Bank, where I co-architected a new banking module and modernized legacy systems.',
    accent: '#74d9bc',
  },
  {
    id: 'computer-science',
    period: '2021–present',
    kind: 'Formal study',
    title: 'Started a computer science degree.',
    summary:
      'Alongside work, I began a bachelor’s degree at Kutaisi International University and kept learning across software, neuroscience, and emerging technology.',
    accent: '#b9a2ff',
  },
  {
    id: 'larger-systems',
    period: '2023–2024',
    kind: 'Larger systems',
    title: 'Started building at a different scale.',
    summary:
      'My work expanded to microservices and AWS at BP, then Azure serverless systems and Bing Sports at Microsoft.',
    accent: '#ffad70',
  },
  {
    id: 'public-experiments',
    period: 'May–June 2025',
    kind: 'Published in public',
    title: 'Turned experiments into things people could explore.',
    summary:
      'I published the Braitenberg Vehicles simulations, ran a Turing-test game between frontier models, and released Dreamscape Grove, a forest grown through neurofeedback.',
    accent: '#ef8df5',
    link: {
      label: 'Explore the projects',
      to: '/blog',
    },
  },
  {
    id: 'alignment',
    period: 'December 2025–now',
    kind: 'Changed direction',
    title: 'Made AI alignment the central question.',
    summary:
      'I published steering-vector work on paltering in Gemma-2-2B-IT, explored belief-state geometry with Simplex, and now focus on helping AGI go well.',
    accent: '#ff7f73',
    link: {
      label: 'Read the alignment research',
      to: '/research',
    },
  },
];
