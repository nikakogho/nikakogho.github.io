export type AboutTrack = 'Origin' | 'Career' | 'Education' | 'Decision' | 'Interests' | 'Convergence';

export interface AboutMilestone {
  id: string;
  period: string;
  kind: string;
  track: AboutTrack;
  title: string;
  summary: string;
  accent: string;
  link?: {
    label: string;
    to: string;
  };
  videos?: Array<{
    label: string;
    href: string;
  }>;
}

export const aboutTimeline: AboutMilestone[] = [
  {
    id: 'playable-worlds',
    period: '2016–2020',
    kind: 'The first branch',
    track: 'Origin',
    title: 'Game development',
    summary:
      'I worked independently in Unity, building games, battle simulations, and a 4D game.',
    accent: '#8bc7ff',
  },
  {
    id: 'liberty-bank',
    period: '2020–2022',
    kind: 'Production software',
    track: 'Career',
    title: 'Liberty Bank',
    summary:
      'I worked with .NET and Angular, co-architected a banking module, and helped modernize legacy systems.',
    accent: '#74d9bc',
  },
  {
    id: 'university',
    period: '2021–present',
    kind: 'Running in parallel',
    track: 'Education',
    title: 'Kutaisi International University',
    summary:
      'I started a bachelor’s degree in computer science while continuing to work. My studies are ongoing.',
    accent: '#b9a2ff',
  },
  {
    id: 'reflection',
    period: 'Late 2022',
    kind: 'A decision point',
    track: 'Decision',
    title: 'Rethinking what I wanted to do',
    summary:
      'Near the end of my time at Liberty, I became interested in biotechnology. I decided to keep working in software while studying biology and engineering on my own.',
    accent: '#f4d06f',
  },
  {
    id: 'larger-systems',
    period: '2023–2024',
    kind: 'Software track',
    track: 'Career',
    title: 'BP & Microsoft',
    summary:
      'At BP, I worked on microservices and AWS. At Microsoft, I worked on Azure serverless systems and Bing Sports.',
    accent: '#ffad70',
  },
  {
    id: 'biotech',
    period: '2023',
    kind: 'Interest track',
    track: 'Interests',
    title: 'Biotechnology',
    summary:
      'Alongside my software work, I studied genetic systems, bioinformatics, and tissue engineering. I collected what I learned in Nexus.',
    accent: '#65d790',
    link: {
      label: 'Explore my biotech notes',
      to: '/nexus/notes/horizon/bioengineering/bioengineering',
    },
  },
  {
    id: 'aerospace',
    period: '2023–2024',
    kind: 'Interest track',
    track: 'Interests',
    title: 'Aerospace',
    summary:
      'I began studying launch vehicles, spacecraft, orbital systems, and life support, and worked on building a ground station.',
    accent: '#63b8ff',
    link: {
      label: 'Explore my aerospace notes',
      to: '/nexus/notes/horizon/space-tech/space-tech',
    },
  },
  {
    id: 'neurotech',
    period: '2024–2025',
    kind: 'Interest track',
    track: 'Interests',
    title: 'Neurotechnology',
    summary:
      'I studied neural recording and stimulation, brain–computer interfaces, neurofeedback, and computational neuroscience.',
    accent: '#e778bd',
    link: {
      label: 'Explore my neurotech notes',
      to: '/nexus/notes/horizon/neurotech/neurotech',
    },
    videos: [
      {
        label: 'Watch Dreamscape Grove',
        href: 'https://www.youtube.com/watch?v=EU_obsIUCwc',
      },
    ],
  },
  {
    id: 'robotics',
    period: '2025',
    kind: 'Interest track',
    track: 'Interests',
    title: 'Robotics',
    summary:
      'I explored sensing and control through biomimetic machines and built Braitenberg Vehicles simulations.',
    accent: '#f49a3f',
    link: {
      label: 'Explore my robotics notes',
      to: '/nexus/notes/horizon/robots/robotics',
    },
  },
  {
    id: 'ai',
    period: '2025',
    kind: 'Interest track',
    track: 'Interests',
    title: 'Artificial intelligence',
    summary:
      'I started experimenting with models, agents, and interpretability. One project was a Turing-test game in which language models judged one another.',
    accent: '#7581ff',
    link: {
      label: 'Explore my AI notes',
      to: '/nexus/notes/horizon/ai/ai',
    },
    videos: [
      {
        label: 'Watch the Reverse Turing Roundtable',
        href: 'https://www.youtube.com/watch?v=wJSxviBw5n4',
      },
      {
        label: 'Watch Braitenberg Playground',
        href: 'https://www.youtube.com/watch?v=1cJKEKF63jg',
      },
    ],
  },
  {
    id: 'alignment',
    period: 'December 2025–June 2026',
    kind: 'The central question',
    track: 'Interests',
    title: 'AI alignment',
    summary:
      'I published work on steering paltering in Gemma-2-2B-IT and explored belief-state geometry with Simplex. AI alignment became my main focus.',
    accent: '#ff7f73',
    link: {
      label: 'Explore my alignment notes',
      to: '/nexus/notes/horizon/ai/ai-alignment/ai-alignment',
    },
  },
  {
    id: 'lasr-labs',
    period: 'July 2026–now',
    kind: 'The tracks converge',
    track: 'Convergence',
    title: 'LASR Labs',
    summary:
      'I joined LASR Labs in July 2026. I’m now working on AI alignment, bringing my software-engineering experience into my research.',
    accent: '#ffb86b',
    link: {
      label: 'See my alignment research',
      to: '/research',
    },
  },
];
