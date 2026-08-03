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
}

export const aboutTimeline: AboutMilestone[] = [
  {
    id: 'playable-worlds',
    period: '2016–2020',
    kind: 'The first branch',
    track: 'Origin',
    title: 'It started with game development.',
    summary:
      'Self-employed Unity development gave me a place to turn strange ideas—including battle simulations and a 4D game—into systems I could build, play with, and test.',
    accent: '#8bc7ff',
  },
  {
    id: 'liberty-bank',
    period: '2020–2022',
    kind: 'Production software',
    track: 'Career',
    title: 'The path moved into .NET at Liberty Bank.',
    summary:
      'Freelance algorithms and simulations led into .NET and Angular work at Liberty Bank, where I co-architected a new banking module and helped modernize legacy systems.',
    accent: '#74d9bc',
  },
  {
    id: 'university',
    period: '2021–present',
    kind: 'Running in parallel',
    track: 'Education',
    title: 'University began alongside the work—not after it.',
    summary:
      'I started a computer science bachelor’s degree at Kutaisi International University while continuing to work, creating a second track of formal study that is still moving forward.',
    accent: '#b9a2ff',
  },
  {
    id: 'reflection',
    period: 'Late 2022',
    kind: 'A decision point',
    track: 'Decision',
    title: 'I questioned what I wanted from my life.',
    summary:
      'Near the end of my time at Liberty, reflection pulled me toward biotechnology. I decided to split my time: keep building software-engineering experience while learning the biotech foundations that interested me.',
    accent: '#f4d06f',
  },
  {
    id: 'larger-systems',
    period: '2023–2024',
    kind: 'Software track',
    track: 'Career',
    title: 'I kept building software experience at larger scales.',
    summary:
      'One branch continued through microservices and AWS at BP, then Azure serverless systems and Bing Sports at Microsoft—deeper experience building software used inside large organizations.',
    accent: '#ffad70',
  },
  {
    id: 'biotech',
    period: '2023',
    kind: 'Interest track',
    track: 'Interests',
    title: 'The other branch began with biotechnology.',
    summary:
      'In parallel with professional software work, I began learning how biology could become an engineering medium, from genetic systems and bioinformatics to tissue engineering.',
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
    title: 'That curiosity expanded into aerospace.',
    summary:
      'I followed the same future-facing curiosity into launch vehicles, spacecraft, orbital systems, life support, and the practical work of building a ground station.',
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
    title: 'Aerospace gave way to neurotechnology.',
    summary:
      'The path moved from machines around us to interfaces with the nervous system: neural recording, stimulation, brain–computer interfaces, neurofeedback, and computational neuroscience.',
    accent: '#e778bd',
    link: {
      label: 'Explore my neurotech notes',
      to: '/nexus/notes/horizon/neurotech/neurotech',
    },
  },
  {
    id: 'robotics',
    period: '2025',
    kind: 'Interest track',
    track: 'Interests',
    title: 'Then intelligence became embodied.',
    summary:
      'Robotics connected sensing, control, and behavior. I explored those ideas through biomimetic machines and the Braitenberg Vehicles simulations I published in public.',
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
    title: 'Robotics led into artificial intelligence.',
    summary:
      'I moved deeper into models, agents, interpretability, and experiments with frontier systems—including a Turing-test game in which language models judged one another.',
    accent: '#7581ff',
    link: {
      label: 'Explore my AI notes',
      to: '/nexus/notes/horizon/ai/ai',
    },
  },
  {
    id: 'alignment',
    period: 'December 2025–June 2026',
    kind: 'The central question',
    track: 'Interests',
    title: 'AI became AI alignment.',
    summary:
      'I published steering-vector work on paltering in Gemma-2-2B-IT, explored belief-state geometry with Simplex, and made helping advanced AI go well the central direction.',
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
    title: 'The career and interest tracks meet at LASR Labs.',
    summary:
      'Since July 2026, the software-engineering experience and the long trail toward AI alignment have come together in the work I am now doing at LASR Labs.',
    accent: '#ffb86b',
    link: {
      label: 'See my alignment research',
      to: '/research',
    },
  },
];
