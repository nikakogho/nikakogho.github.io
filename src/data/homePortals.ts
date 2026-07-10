export type HomePortalId = 'ai' | 'robotics' | 'biotech' | 'neurotech' | 'space' | 'nanotech';

export type PortalLinkKind = 'Research' | 'Blog' | 'Nexus' | 'Video' | 'Project';

export interface PortalLink {
  title: string;
  description: string;
  href: string;
  kind: PortalLinkKind;
  external?: boolean;
}

export interface HomePortal {
  id: HomePortalId;
  title: string;
  realm: string;
  rune: string;
  summary: string;
  accent: string;
  softAccent: string;
  orbit: { x: number; y: number };
  links: PortalLink[];
}

export const homePortals: HomePortal[] = [
  {
    id: 'ai',
    title: 'Artificial Intelligence',
    realm: 'The Thinking Flame',
    rune: 'Ψ',
    summary: 'Alignment, interpretability, agents, and experiments with minds made from mathematics.',
    accent: '#9f7aea',
    softAccent: 'rgba(159, 122, 234, 0.2)',
    orbit: { x: 50, y: 8 },
    links: [
      {
        title: 'Context Fidelity via Linear Steering',
        description: 'My steering-vector research on asymmetric interventions in Gemma-2-2B-IT.',
        href: '/research/an-asymmetry-in-linear-steering---negative-interventions-increase-context-fidelity-in-gemma-2-2b-it',
        kind: 'Research',
      },
      {
        title: 'Turing Test Game Between LLMs',
        description: 'Two frontier models alternate between detective and convincing human impostor.',
        href: '/blog/turing-test-game-between-llms',
        kind: 'Blog',
      },
      {
        title: 'The AI Nexus',
        description: 'My evolving map of models, alignment, learning, agents, and AI organizations.',
        href: '/nexus/notes/horizon/ai/ai',
        kind: 'Nexus',
      },
    ],
  },
  {
    id: 'robotics',
    title: 'Robotics',
    realm: 'The Clockwork Familiar',
    rune: '⚙',
    summary: 'Embodied intelligence, emergent behavior, biomimetic machines, and playful simulations.',
    accent: '#f6ad55',
    softAccent: 'rgba(246, 173, 85, 0.2)',
    orbit: { x: 80, y: 27 },
    links: [
      {
        title: 'Braitenberg Vehicles Playground',
        description: 'Five tiny sensor-to-motor brains that appear afraid, aggressive, loving, or curious.',
        href: '/blog/braitenbergs-vehicles--the-illusion-of-aliveness-part-2---from-light-seeker-to-explorer',
        kind: 'Blog',
      },
      {
        title: 'Watch the Vehicles Awaken',
        description: 'A short visual tour through the Unity playground and its emergent behaviors.',
        href: 'https://www.youtube.com/watch?v=1cJKEKF63jg',
        kind: 'Video',
        external: true,
      },
      {
        title: 'The Robotics Nexus',
        description: 'Robots, locomotion, sensing, control, biomimetics, and the people building them.',
        href: '/nexus/notes/horizon/robots/robotics',
        kind: 'Nexus',
      },
    ],
  },
  {
    id: 'biotech',
    title: 'Biotechnology',
    realm: 'The Living Forge',
    rune: 'ϟ',
    summary: 'Biology as an engineering medium: genomes, tissues, living systems, and long-read analysis.',
    accent: '#48bb78',
    softAccent: 'rgba(72, 187, 120, 0.2)',
    orbit: { x: 80, y: 70 },
    links: [
      {
        title: 'LAAVA',
        description: 'A long-read Adeno-Associated Virus analysis project and its bioinformatics trail.',
        href: '/nexus/notes/horizon/bioengineering/bioinformatics/projects/laava/laava',
        kind: 'Project',
      },
      {
        title: 'LAAVA Source',
        description: 'The open-source implementation for long-read AAV analysis.',
        href: 'https://github.com/formbio/laava',
        kind: 'Project',
        external: true,
      },
      {
        title: 'The Bioengineering Nexus',
        description: 'Genetic engineering, synthetic biology, tissue engineering, and systems biology.',
        href: '/nexus/notes/horizon/bioengineering/bioengineering',
        kind: 'Nexus',
      },
    ],
  },
  {
    id: 'neurotech',
    title: 'Neurotechnology',
    realm: 'The Dreaming Grove',
    rune: '⌁',
    summary: 'Tools that listen to, model, and collaborate with the nervous system.',
    accent: '#ed64a6',
    softAccent: 'rgba(237, 100, 166, 0.2)',
    orbit: { x: 50, y: 88 },
    links: [
      {
        title: 'Dreamscape Grove',
        description: 'A neurofeedback game where sustained focus grows a low-poly forest.',
        href: '/blog/dreamscape-grove---grow-a-forest-with-focus',
        kind: 'Blog',
      },
      {
        title: 'Watch the Grove Grow',
        description: 'The development diary, neurofeedback loop, and a playable walkthrough.',
        href: 'https://youtu.be/EU_obsIUCwc',
        kind: 'Video',
        external: true,
      },
      {
        title: 'The Neurotech Nexus',
        description: 'BCIs, neural recording, stimulation, neurofeedback, and digital brain models.',
        href: '/nexus/notes/horizon/neurotech/neurotech',
        kind: 'Nexus',
      },
    ],
  },
  {
    id: 'space',
    title: 'Space Technology',
    realm: 'The Far Observatory',
    rune: '✦',
    summary: 'Spacecraft, ground systems, human survival, and the infrastructure beyond Earth.',
    accent: '#4299e1',
    softAccent: 'rgba(66, 153, 225, 0.2)',
    orbit: { x: 20, y: 70 },
    links: [
      {
        title: 'QartvelNest Ground Station',
        description: 'My plan for a SatNOGS-based Georgian ground station serving QartvelSat-1.',
        href: '/nexus/notes/horizon/space-tech/ground-station/making-a-ground-station',
        kind: 'Project',
      },
      {
        title: 'QartvelNest Source',
        description: 'The hardware and software home for the ground-station build.',
        href: 'https://github.com/nikakogho/QartvelNest',
        kind: 'Project',
        external: true,
      },
      {
        title: 'The Space Tech Nexus',
        description: 'Launch vehicles, spacecraft, orbits, life support, and Earth observation.',
        href: '/nexus/notes/horizon/space-tech/space-tech',
        kind: 'Nexus',
      },
    ],
  },
  {
    id: 'nanotech',
    title: 'Nanotechnology',
    realm: 'The Invisible Atelier',
    rune: '◈',
    summary: 'Fabrication and machines at scales where matter starts behaving like spellcraft.',
    accent: '#38b2ac',
    softAccent: 'rgba(56, 178, 172, 0.2)',
    orbit: { x: 20, y: 27 },
    links: [
      {
        title: 'Nanotechnology',
        description: 'A map of nanoscale materials, processes, tools, and emerging applications.',
        href: '/nexus/notes/horizon/nanotech/nanotechnology',
        kind: 'Nexus',
      },
      {
        title: 'Photolithography',
        description: 'Patterning matter with light—the foundational ritual of modern fabrication.',
        href: '/nexus/notes/horizon/nanotech/photolithography',
        kind: 'Nexus',
      },
      {
        title: 'Nanofabrication Tools',
        description: 'The instruments used to see, shape, deposit, etch, and measure the very small.',
        href: '/nexus/notes/horizon/nanotech/nanofabrication-tools',
        kind: 'Nexus',
      },
    ],
  },
];
