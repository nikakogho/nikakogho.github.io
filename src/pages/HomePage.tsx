import { CSSProperties, PointerEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBookOpen, FiCompass, FiCpu, FiFeather, FiZap } from 'react-icons/fi';
import AmbienceToggle from '../components/AmbienceToggle';
import '../styles/landing.css';

type LandingVariant = 'keep' | 'atelier' | 'citadel';

interface LandingVariantDetails {
  id: LandingVariant;
  tab: string;
  name: string;
  icon: typeof FiFeather;
  image: string;
  audio: string;
  audioLabel: string;
  startRealm: string;
  eyebrow: string;
  title: string;
  description: string;
  invitation: string;
}

const LANDING_VARIANT_KEY = 'nika-landing-variant-v2';

const landingVariants: LandingVariantDetails[] = [
  {
    id: 'keep',
    tab: 'I',
    name: 'Moonlit Keep',
    icon: FiFeather,
    image: '/backgrounds/lifelog-castle-courtyard.webp',
    audio: '/audio/light_rain.wav',
    audioLabel: 'rain beyond the keep',
    startRealm: 'neurotech',
    eyebrow: 'The playground of tomorrow',
    title: 'A keep for impossible futures.',
    description: 'I’m Nika—an engineer exploring minds, machines, living systems, space, and matter at its smallest scales.',
    invitation: 'Cross the courtyard. The realm gates are awake.',
  },
  {
    id: 'atelier',
    tab: 'II',
    name: 'Arcane Atelier',
    icon: FiCpu,
    image: '/backgrounds/lifelog-cyber-lab.webp',
    audio: '/audio/cyber-lab-hum.wav',
    audioLabel: 'the midnight laboratory',
    startRealm: 'ai',
    eyebrow: 'Field notes from the near future',
    title: 'The lab window is still glowing.',
    description: 'Experiments in intelligence, embodiment, biology, brains, off-world infrastructure, and nanoscale machines.',
    invitation: 'Step through the glass and choose a world to inhabit.',
  },
  {
    id: 'citadel',
    tab: 'III',
    name: 'Ember Citadel',
    icon: FiZap,
    image: '/backgrounds/lifelog-lava-pit.webp',
    audio: '/audio/lava-rumble.wav',
    audioLabel: 'the furnace beneath the citadel',
    startRealm: 'robotics',
    eyebrow: 'A foundry for unfinished ideas',
    title: 'Every impossible thing begins as a spark.',
    description: 'This is where speculative technologies become notes, games, prototypes, research, and occasionally small mechanical creatures.',
    invitation: 'Take the ember path into the six realms.',
  },
];

const futureDomains = ['AI', 'Robotics', 'Biotech', 'Neurotech', 'Space', 'Nanotech'];

function getInitialVariant(): LandingVariant {
  if (typeof window === 'undefined') return 'keep';
  try {
    const saved = window.localStorage.getItem(LANDING_VARIANT_KEY);
    if (saved === 'keep' || saved === 'atelier' || saved === 'citadel') return saved;
  } catch {
    // The selector remains functional when storage is unavailable.
  }
  return 'keep';
}

const HomePage = () => {
  const [variant, setVariant] = useState<LandingVariant>(getInitialVariant);
  const [loadedScene, setLoadedScene] = useState<string | null>(null);
  const active = landingVariants.find((option) => option.id === variant) ?? landingVariants[0];

  useEffect(() => {
    try {
      window.localStorage.setItem(LANDING_VARIANT_KEY, variant);
    } catch {
      // Persistence is a convenience, not a requirement.
    }
  }, [variant]);

  const moveScene = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    event.currentTarget.style.setProperty('--scene-x', `${(x * -9).toFixed(2)}px`);
    event.currentTarget.style.setProperty('--scene-y', `${(y * -6).toFixed(2)}px`);
    event.currentTarget.style.setProperty('--light-x', `${((x + 1) * 50).toFixed(2)}%`);
    event.currentTarget.style.setProperty('--light-y', `${((y + 1) * 50).toFixed(2)}%`);
  };

  const resetScene = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--scene-x', '0px');
    event.currentTarget.style.setProperty('--scene-y', '0px');
  };

  return (
    <section
      className="landing-shell"
      data-landing={variant}
      data-testid="landing-shell"
      data-scene-ready={loadedScene === active.image}
      onPointerMove={moveScene}
      onPointerLeave={resetScene}
      aria-labelledby="landing-title"
    >
      <a className="landing-skip" href="#landing-story">Skip to introduction</a>

      <img
        className="landing-scene"
        src={active.image}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        onLoad={() => setLoadedScene(active.image)}
      />
      <div className="landing-vignette" aria-hidden="true" />
      <div className="landing-light" aria-hidden="true" />
      <div className="landing-weather" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index} style={{ '--particle-index': index } as CSSProperties} />
        ))}
      </div>

      <nav className="landing-nav" aria-label="Primary navigation">
        <Link className="landing-mark" to="/" aria-label="Nika Kogho home">
          <span>NK</span>
          <strong>Nika Kogho</strong>
        </Link>
        <div className="landing-nav__links">
          <Link to="/nexus">Nexus</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/research">Research</Link>
        </div>
      </nav>

      <article id="landing-story" className="landing-story" aria-live="polite">
        <p className="landing-story__eyebrow">{active.eyebrow}</p>
        <h1 id="landing-title">{active.title}</h1>
        <p className="landing-story__description">{active.description}</p>
        <p className="landing-story__invitation">{active.invitation}</p>
        <div className="landing-story__actions">
          <Link className="landing-action landing-action--primary" to={`/world?realm=${active.startRealm}`}>
            Enter my world <FiCompass aria-hidden="true" />
          </Link>
          <Link className="landing-action landing-action--quiet" to="/nexus">
            Open the Nexus <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </article>

      <div className="landing-domain-orbit" aria-label="Worlds inside the exploration experience">
        <span className="landing-domain-orbit__core"><FiBookOpen aria-hidden="true" /></span>
        {futureDomains.map((domain, index) => (
          <span
            key={domain}
            className="landing-domain-orbit__domain"
            style={{ '--domain-index': index } as CSSProperties}
          >
            {domain}
          </span>
        ))}
      </div>

      <div className="landing-thresholds" role="group" aria-label="Choose a landing page concept">
        <span className="landing-thresholds__label">Choose a threshold</span>
        <div>
          {landingVariants.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                type="button"
                className={option.id === variant ? 'is-active' : ''}
                aria-pressed={option.id === variant}
                aria-label={`Use ${option.name} landing page`}
                data-landing-option={option.id}
                onClick={() => setVariant(option.id)}
              >
                <span>{option.tab}</span>
                <Icon aria-hidden="true" />
                <strong>{option.name}</strong>
              </button>
            );
          })}
        </div>
      </div>

      <AmbienceToggle
        key={active.id}
        src={active.audio}
        label={active.audioLabel}
        className="landing-ambience"
      />
    </section>
  );
};

export default HomePage;
