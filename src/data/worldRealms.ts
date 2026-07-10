import { HomePortalId, PortalLink, homePortals } from './homePortals';

export type VehicleKind = 'wisp' | 'strider' | 'sporewing' | 'moth' | 'skiff' | 'beetle';
export type TerrainKind = 'circuit' | 'foundry' | 'verdant' | 'dream' | 'astral' | 'lattice';

export interface WorldPoint {
  x: number;
  y: number;
}

export interface RealmLandmark extends PortalLink, WorldPoint {
  id: string;
  monument: string;
}

export interface WorldRealm {
  id: HomePortalId;
  title: string;
  realmName: string;
  shortName: string;
  sigil: string;
  invitation: string;
  lore: string;
  terrain: TerrainKind;
  vehicle: {
    kind: VehicleKind;
    name: string;
    description: string;
    speed: number;
    handling: number;
  };
  palette: {
    sky: string;
    ground: string;
    groundLight: string;
    accent: string;
    accentHot: string;
    mist: string;
  };
  ambience: {
    src: string;
    label: string;
  };
  entry: WorldPoint;
  landmarks: RealmLandmark[];
}

const landmarkPositions: WorldPoint[] = [
  { x: 420, y: 820 },
  { x: 1_380, y: 390 },
  { x: 1_080, y: 930 },
];

const monumentNames: Record<HomePortalId, string[]> = {
  ai: ['The Steering Observatory', 'The Masquerade Theatre', 'The Infinite Index'],
  robotics: ['The Vehicle Garden', 'The Awakening Screen', 'The Clockwork Archive'],
  biotech: ['The Long-Read Conservatory', 'The Open Genome Forge', 'The Living Library'],
  neurotech: ['The Focus Grove', 'The Memory Pool', 'The Neural Bestiary'],
  space: ['The Listening Tower', 'The Ground-Station Workshop', 'The Far Observatory'],
  nanotech: ['The Invisible Atlas', 'The Light Foundry', 'The Instrument Vault'],
};

const realmDetails: Record<HomePortalId, Omit<WorldRealm, 'title' | 'landmarks'>> = {
  ai: {
    id: 'ai',
    realmName: 'Nocturne Circuit',
    shortName: 'AI',
    sigil: 'Ψ',
    invitation: 'Follow the thinking flame.',
    lore: 'A rain-dark plane where ideas travel as luminous signals and unfinished minds gather around observatories of glass.',
    terrain: 'circuit',
    vehicle: {
      kind: 'wisp',
      name: 'Logic Wisp',
      description: 'A thought made buoyant—fast, frictionless, and happiest while changing direction.',
      speed: 410,
      handling: 8.2,
    },
    palette: {
      sky: '#05071d',
      ground: '#11143a',
      groundLight: '#23276d',
      accent: '#7b8cff',
      accentHot: '#e98cff',
      mist: 'rgba(84, 70, 214, 0.24)',
    },
    ambience: { src: '/audio/cyber-lab-hum.wav', label: 'distant processors and rain' },
    entry: { x: 900, y: 690 },
  },
  robotics: {
    id: 'robotics',
    realmName: 'Brasswild Foundry',
    shortName: 'Robotics',
    sigil: '⚙',
    invitation: 'Wake the clockwork familiar.',
    lore: 'An overgrown machine-city of brass paths and patient automata, each mechanism waiting to discover an unexpected behavior.',
    terrain: 'foundry',
    vehicle: {
      kind: 'strider',
      name: 'Clockwork Strider',
      description: 'A four-legged familiar with weight, momentum, and a fondness for sparks.',
      speed: 320,
      handling: 5.4,
    },
    palette: {
      sky: '#100a18',
      ground: '#241a2b',
      groundLight: '#4b3440',
      accent: '#ffad58',
      accentHot: '#ffe071',
      mist: 'rgba(174, 67, 35, 0.2)',
    },
    ambience: { src: '/audio/lava-rumble.wav', label: 'gears, furnaces, and subterranean thunder' },
    entry: { x: 900, y: 690 },
  },
  biotech: {
    id: 'biotech',
    realmName: 'Viridian Menagerie',
    shortName: 'Biotech',
    sigil: 'ϟ',
    invitation: 'Ride the living wind.',
    lore: 'A wet, breathing forest whose roots form pathways, whose ponds resemble cells, and whose gardens treat biology as a creative medium.',
    terrain: 'verdant',
    vehicle: {
      kind: 'sporewing',
      name: 'Sporewing',
      description: 'A grown—not built—dragonfly skiff that banks softly through living terrain.',
      speed: 350,
      handling: 6.7,
    },
    palette: {
      sky: '#041713',
      ground: '#0c2b23',
      groundLight: '#22513b',
      accent: '#54e39a',
      accentHot: '#d2ff79',
      mist: 'rgba(41, 178, 119, 0.2)',
    },
    ambience: { src: '/audio/light_rain.wav', label: 'rain on leaves and distant glass' },
    entry: { x: 900, y: 690 },
  },
  neurotech: {
    id: 'neurotech',
    realmName: 'Somnolent Canopy',
    shortName: 'Neurotech',
    sigil: '⌁',
    invitation: 'Cross the dreaming grove.',
    lore: 'A forest suspended between wakefulness and dream, where synapses bloom as lanterns and attention changes the weather.',
    terrain: 'dream',
    vehicle: {
      kind: 'moth',
      name: 'Axon Moth',
      description: 'A quiet neural familiar that turns sharply and leaves a fading memory-trail.',
      speed: 365,
      handling: 7.6,
    },
    palette: {
      sky: '#100720',
      ground: '#26123c',
      groundLight: '#4b2566',
      accent: '#f06fcb',
      accentHot: '#a9f4ff',
      mist: 'rgba(198, 82, 209, 0.22)',
    },
    ambience: { src: '/audio/light_rain.wav', label: 'soft rain and electrical leaves' },
    entry: { x: 900, y: 690 },
  },
  space: {
    id: 'space',
    realmName: 'Astral Archipelago',
    shortName: 'Space',
    sigil: '✦',
    invitation: 'Sail beyond the atmosphere.',
    lore: 'Moonstone islands drift above a star-filled gulf, joined by orbital paths, observatories, and signals travelling home.',
    terrain: 'astral',
    vehicle: {
      kind: 'skiff',
      name: 'Comet Skiff',
      description: 'A small sailcraft that trades traction for graceful orbital drift.',
      speed: 430,
      handling: 4.7,
    },
    palette: {
      sky: '#020713',
      ground: '#111d35',
      groundLight: '#273c68',
      accent: '#54b8ff',
      accentHot: '#fff3a6',
      mist: 'rgba(53, 111, 211, 0.19)',
    },
    ambience: { src: '/audio/cyber-lab-hum.wav', label: 'quiet instruments and a far transmitter' },
    entry: { x: 900, y: 690 },
  },
  nanotech: {
    id: 'nanotech',
    realmName: 'Crystal Lattice',
    shortName: 'Nanotech',
    sigil: '◈',
    invitation: 'Descend between atoms.',
    lore: 'A jewel-scale wilderness where crystal bonds become bridges and light is used as both compass and chisel.',
    terrain: 'lattice',
    vehicle: {
      kind: 'beetle',
      name: 'Photon Beetle',
      description: 'A nanoscale crawler that grips the lattice and flashes when it changes course.',
      speed: 300,
      handling: 9.1,
    },
    palette: {
      sky: '#04141a',
      ground: '#0d2830',
      groundLight: '#1f5158',
      accent: '#56e5dc',
      accentHot: '#f4ff9a',
      mist: 'rgba(40, 191, 190, 0.18)',
    },
    ambience: { src: '/audio/cyber-lab-hum.wav', label: 'atomic resonance and fabrication light' },
    entry: { x: 900, y: 690 },
  },
};

export const worldRealms: WorldRealm[] = homePortals.map((portal) => ({
  ...realmDetails[portal.id],
  title: portal.title,
  landmarks: portal.links.map((link, index) => ({
    ...link,
    ...landmarkPositions[index],
    id: `${portal.id}-${index + 1}`,
    monument: monumentNames[portal.id][index],
  })),
}));

export const worldRealmById = Object.fromEntries(
  worldRealms.map((realm) => [realm.id, realm]),
) as Record<HomePortalId, WorldRealm>;

export const WORLD_BOUNDS = { width: 1_800, height: 1_200 } as const;
