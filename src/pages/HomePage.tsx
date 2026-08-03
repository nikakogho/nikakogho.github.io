import { CSSProperties, MouseEvent, PointerEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconType } from 'react-icons';
import { FaGithub, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import {
  FiArrowDown,
  FiArrowRight,
  FiCompass,
  FiExternalLink,
  FiFileText,
  FiMail,
} from 'react-icons/fi';
import AmbienceToggle from '../components/AmbienceToggle';
import AboutTimeline from '../components/AboutTimeline';
import { ProfileLinkId, cvUrl, profileLinks } from '../data/profileLinks';
import '../styles/landing.css';

type LandingVariant = 'keep' | 'atelier' | 'citadel';

interface LandingVariantDetails {
  id: LandingVariant;
  label: string;
  image: string;
  audio: string;
  audioLabel: string;
}

const LANDING_VARIANT_KEY = 'nika-landing-variant-v2';

const landingVariants: LandingVariantDetails[] = [
  {
    id: 'keep',
    label: 'Keep',
    image: '/backgrounds/lifelog-castle-courtyard.webp',
    audio: '/audio/light_rain.wav',
    audioLabel: 'rain beyond the keep',
  },
  {
    id: 'atelier',
    label: 'Lab',
    image: '/backgrounds/lifelog-cyber-lab.webp',
    audio: '/audio/cyber-lab-hum.wav',
    audioLabel: 'the midnight laboratory',
  },
  {
    id: 'citadel',
    label: 'Foundry',
    image: '/backgrounds/lifelog-lava-pit.webp',
    audio: '/audio/lava-rumble.wav',
    audioLabel: 'the furnace beneath the citadel',
  },
];

const profileIcons: Record<ProfileLinkId, IconType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  email: FiMail,
  youtube: FaYoutube,
  x: FaXTwitter,
};

const siteDestinations = [
  {
    title: 'Nexus',
    eyebrow: 'Knowledge base',
    description: 'A connected map of notes across science, engineering, people, and possible futures.',
    to: '/nexus',
  },
  {
    title: 'Research',
    eyebrow: 'Original work',
    description: 'Technical investigations, experiments, and results presented with their evidence.',
    to: '/research',
  },
  {
    title: 'Blog',
    eyebrow: 'Projects & ideas',
    description: 'Build logs, essays, demonstrations, and ideas that are still taking shape.',
    to: '/blog',
  },
];

function getInitialVariant(): LandingVariant {
  if (typeof window === 'undefined') return 'keep';
  try {
    const saved = window.localStorage.getItem(LANDING_VARIANT_KEY);
    if (saved === 'keep' || saved === 'atelier' || saved === 'citadel') return saved;
  } catch {
    // The backdrop selector remains functional when storage is unavailable.
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
    event.currentTarget.style.setProperty('--scene-x', `${(x * -7).toFixed(2)}px`);
    event.currentTarget.style.setProperty('--scene-y', `${(y * -5).toFixed(2)}px`);
  };

  const resetScene = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--scene-x', '0px');
    event.currentTarget.style.setProperty('--scene-y', '0px');
  };

  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    section?.focus({ preventScroll: true });
  };

  return (
    <div className="landing-page" data-landing={variant}>
      <section
        className="landing-hero"
        data-testid="landing-shell"
        data-scene-ready={loadedScene === active.image}
        onPointerMove={moveScene}
        onPointerLeave={resetScene}
        aria-labelledby="landing-title"
      >
        <a
          className="landing-skip"
          href="#landing-content"
          onClick={(event) => scrollToSection(event, 'landing-content')}
        >
          Skip to introduction
        </a>

        <img
          className="landing-scene"
          src={active.image}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          onLoad={() => setLoadedScene(active.image)}
        />
        <div className="landing-overlay" aria-hidden="true" />
        <div className="landing-weather" aria-hidden="true">
          {Array.from({ length: 14 }, (_, index) => (
            <span key={index} style={{ '--particle-index': index } as CSSProperties} />
          ))}
        </div>

        <nav className="landing-nav" aria-label="Primary navigation">
          <Link className="landing-mark" to="/" aria-label="Nika Koghuashvili home">
            <span aria-hidden="true">NK</span>
            <strong>Nika Koghuashvili</strong>
          </Link>
          <div className="landing-nav__links">
            <a href="#about" onClick={(event) => scrollToSection(event, 'about')}>About</a>
            <Link to="/nexus">Nexus</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/research">Research</Link>
          </div>
          <a className="landing-nav__contact" href="mailto:nikakoghuashvili@gmail.com">
            <FiMail aria-hidden="true" /> Contact
          </a>
        </nav>

        <div id="landing-content" className="landing-hero__layout" tabIndex={-1}>
          <article className="landing-intro">
            <p className="landing-eyebrow">Software engineer · Curious generalist</p>
            <h1 id="landing-title">Nika<br />Koghuashvili</h1>
            <p className="landing-intro__lede">
              Curious about our future.
            </p>
            <p className="landing-intro__support">
              Currently trying to make AGI go well.
            </p>

            <div className="landing-intro__actions">
              <Link className="landing-button landing-button--primary" to="/nexus">
                Explore the Nexus <FiArrowRight aria-hidden="true" />
              </Link>
              <a
                className="landing-button landing-button--secondary"
                href="#about"
                onClick={(event) => scrollToSection(event, 'about')}
              >
                About me <FiArrowDown aria-hidden="true" />
              </a>
            </div>

            <nav className="landing-profile-links" aria-label="Profiles and contact links">
              {profileLinks.map((profile) => {
                const Icon = profileIcons[profile.id];
                return (
                  <a
                    key={profile.id}
                    href={profile.href}
                    target={profile.external ? '_blank' : undefined}
                    rel={profile.external ? 'me noopener noreferrer' : undefined}
                    aria-label={profile.ariaLabel}
                  >
                    <Icon aria-hidden="true" />
                    <span>{profile.label}</span>
                  </a>
                );
              })}
            </nav>
          </article>

          <aside className="landing-directory" aria-labelledby="landing-directory-title">
            <header>
              <p>Start here</p>
              <h2 id="landing-directory-title">Explore my work</h2>
            </header>
            <div className="landing-directory__links">
              {siteDestinations.map((destination) => (
                <Link key={destination.title} to={destination.to}>
                  <span>{destination.eyebrow}</span>
                  <strong>{destination.title}</strong>
                  <p>{destination.description}</p>
                  <FiArrowRight aria-hidden="true" />
                </Link>
              ))}
            </div>
            <Link className="landing-world-link" to="/world?realm=ai">
              <FiCompass aria-hidden="true" />
              <span><small>Experimental side quest</small> Enter the interactive world</span>
              <FiArrowRight aria-hidden="true" />
            </Link>
          </aside>
        </div>

        <div className="landing-utilities">
          <div className="landing-backdrops" role="group" aria-label="Choose a background scene">
            <span>Backdrop</span>
            {landingVariants.map((option) => (
              <button
                key={option.id}
                type="button"
                className={option.id === variant ? 'is-active' : ''}
                aria-pressed={option.id === variant}
                data-landing-option={option.id}
                onClick={() => setVariant(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <AmbienceToggle
            key={active.id}
            src={active.audio}
            label={active.audioLabel}
            className="landing-ambience"
          />
        </div>
      </section>

      <section id="about" className="landing-about" tabIndex={-1} aria-labelledby="about-title">
        <div className="landing-about__intro">
          <div className="landing-about__heading">
            <p className="landing-section-label">About me</p>
            <h2 id="about-title">A path through the things I’ve built and learned.</h2>
          </div>
          <div className="landing-about__copy">
            <p>
              I started with games, entered production software, and kept university moving in
              parallel while my interests widened from biotech toward AI alignment.
            </p>
            <p>Scroll to follow the branches, splits, and convergence.</p>
          </div>
        </div>

        <AboutTimeline />

        <div className="landing-about__actions landing-about__actions--footer">
          <a href={cvUrl} target="_blank" rel="noopener noreferrer">
            <FiFileText aria-hidden="true" /> Read my CV <FiExternalLink aria-hidden="true" />
          </a>
          <a href="mailto:nikakoghuashvili@gmail.com">
            <FiMail aria-hidden="true" /> Email me
          </a>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} Nika Koghuashvili</p>
        <nav aria-label="Footer navigation">
          <Link to="/nexus">Nexus</Link>
          <Link to="/research">Research</Link>
          <Link to="/blog">Blog</Link>
          <a href={cvUrl} target="_blank" rel="noopener noreferrer">CV</a>
        </nav>
      </footer>
    </div>
  );
};

export default HomePage;
