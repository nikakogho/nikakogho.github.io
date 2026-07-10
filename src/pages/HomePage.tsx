import { PointerEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaGithub, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';
import { FiArrowRight, FiBookOpen, FiCompass, FiExternalLink, FiStar } from 'react-icons/fi';
import HomeRealmExperience, { HomeConcept } from '../components/home/HomeRealmExperience';
import { HomePortalId } from '../data/homePortals';
import '../styles/home.css';

const HOME_CONCEPT_KEY = 'nika-home-concept-v1';

const conceptOptions: Array<{ id: HomeConcept; label: string; eyebrow: string; description: string }> = [
  {
    id: 'orrery',
    label: 'Aster Gate Orrery',
    eyebrow: 'Arcane instrument',
    description: 'Six future-realms orbit a central portal like a scholar’s impossible astrolabe.',
  },
  {
    id: 'grimoire',
    label: 'Grimoire of Futures',
    eyebrow: 'Living field notes',
    description: 'An enchanted research journal whose rune-tabs open a different technological chapter.',
  },
  {
    id: 'grove',
    label: 'Dreamgate Grove',
    eyebrow: 'Bioluminescent paths',
    description: 'A moonlit grove of gates, roots, and luminous trails into possible worlds.',
  },
];

const artifacts = [
  {
    title: 'Multi-Dimensional Worlds',
    description: 'Experiments with worlds whose rules and dimensions refuse to stay ordinary.',
    href: 'https://github.com/nikakogho/MultiDimensionalWorlds',
  },
  {
    title: 'Epic Battle Simulator',
    description: 'A playground for emergent conflict, agents, and large-scale simulation.',
    href: 'https://github.com/nikakogho/EpicBattleSimulator',
  },
  {
    title: 'Dreamscape Grove Source',
    description: 'The neurofeedback forest game, bridge, and Unity implementation.',
    href: 'https://github.com/nikakogho/DreamscapeGrove',
  },
];

function getInitialConcept(): HomeConcept {
  try {
    const saved = window.localStorage.getItem(HOME_CONCEPT_KEY);
    if (saved === 'orrery' || saved === 'grimoire' || saved === 'grove') return saved;
  } catch {
    // Storage can be unavailable in hardened browsing contexts; the default remains usable.
  }
  return 'orrery';
}

const HomePage = () => {
  const [concept, setConcept] = useState<HomeConcept>(getInitialConcept);
  const [selectedPortal, setSelectedPortal] = useState<HomePortalId>('ai');
  const activeConcept = conceptOptions.find((option) => option.id === concept) ?? conceptOptions[0];

  useEffect(() => {
    try {
      window.localStorage.setItem(HOME_CONCEPT_KEY, concept);
    } catch {
      // Persistence is a convenience; the selector still works without storage.
    }
  }, [concept]);

  const updatePointerDepth = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    event.currentTarget.style.setProperty('--pointer-x', `${(x * 10).toFixed(2)}px`);
    event.currentTarget.style.setProperty('--pointer-y', `${(y * 10).toFixed(2)}px`);
  };

  const resetPointerDepth = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--pointer-x', '0px');
    event.currentTarget.style.setProperty('--pointer-y', '0px');
  };

  const revealRealms = () => {
    document.getElementById('future-realms')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="future-home"
      data-concept={concept}
      onPointerMove={updatePointerDepth}
      onPointerLeave={resetPointerDepth}
    >
      <div className="future-atmosphere" aria-hidden="true">
        <span className="future-atmosphere__star future-atmosphere__star--one" />
        <span className="future-atmosphere__star future-atmosphere__star--two" />
        <span className="future-atmosphere__star future-atmosphere__star--three" />
        <span className="future-atmosphere__mist" />
      </div>

      <section className="future-hero" aria-labelledby="future-home-title">
        <div className="future-hero__copy">
          <p className="future-eyebrow"><FiStar aria-hidden="true" /> Playground of tomorrow</p>
          <h1 id="future-home-title">Building small doorways into very large futures.</h1>
          <p className="future-hero__lede">
            I’m Nika—an engineer exploring how intelligence, machines, biology, brains, space,
            and matter itself might be shaped into a better century.
          </p>
          <div className="future-hero__actions">
            <button type="button" className="future-button future-button--primary" onClick={revealRealms}>
              Enter the gates <FiCompass aria-hidden="true" />
            </button>
            <Link to="/nexus" className="future-button future-button--quiet">
              Wander the Nexus <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="future-hero__reliquary" aria-label="Six fields, one shared future">
          <div className="reliquary-ring reliquary-ring--outer" aria-hidden="true" />
          <div className="reliquary-ring reliquary-ring--inner" aria-hidden="true" />
          <div className="reliquary-core">
            <span>6</span>
            <strong>realms</strong>
            <small>one horizon</small>
          </div>
          <span className="reliquary-rune reliquary-rune--one" aria-hidden="true">Ψ</span>
          <span className="reliquary-rune reliquary-rune--two" aria-hidden="true">⚙</span>
          <span className="reliquary-rune reliquary-rune--three" aria-hidden="true">✦</span>
          <span className="reliquary-rune reliquary-rune--four" aria-hidden="true">◈</span>
        </div>
      </section>

      <section id="future-realms" className="future-realms" aria-labelledby="future-realms-title">
        <header className="future-realms__header">
          <div>
            <p className="future-eyebrow"><FiBookOpen aria-hidden="true" /> Choose the spellbook</p>
            <h2 id="future-realms-title">Three ways to cross the same horizon</h2>
          </div>
          <p>Switch freely. Your preferred version is remembered for the next visit.</p>
        </header>

        <div className="concept-switcher" role="group" aria-label="Landing page visual concept">
          {conceptOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={option.id === concept ? 'is-active' : ''}
              aria-pressed={option.id === concept}
              onClick={() => setConcept(option.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setConcept(option.id);
                }
              }}
            >
              <span>{option.eyebrow}</span>
              <strong>{option.label}</strong>
            </button>
          ))}
        </div>

        <p className="concept-description" aria-live="polite">{activeConcept.description}</p>

        <HomeRealmExperience
          concept={concept}
          selectedId={selectedPortal}
          onSelect={setSelectedPortal}
        />
      </section>

      <section className="future-artifacts" aria-labelledby="future-artifacts-title">
        <div className="future-artifacts__intro">
          <p className="future-eyebrow"><FiStar aria-hidden="true" /> Side quests & signals</p>
          <h2 id="future-artifacts-title">Other artifacts from the workshop</h2>
          <p>
            Games, simulations, experiments, and public notes—the odd little objects that accumulate
            when curiosity is allowed to roam.
          </p>
          <a
            className="future-cv-link"
            href="https://drive.google.com/file/d/1SREtPTHUsvXUba58omBguLjQwEwq-m41/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read my CV <FiExternalLink aria-hidden="true" />
          </a>
        </div>

        <div className="artifact-grid">
          {artifacts.map((artifact, index) => (
            <a key={artifact.title} href={artifact.href} target="_blank" rel="noopener noreferrer">
              <span>Artifact {String(index + 1).padStart(2, '0')}</span>
              <strong>{artifact.title}</strong>
              <p>{artifact.description}</p>
              <FiArrowRight aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      <footer className="future-footer">
        <div>
          <span className="future-footer__mark" aria-hidden="true">NK</span>
          <p>Made in Tbilisi, pointed at tomorrow.</p>
        </div>
        <nav className="future-socials" aria-label="Social links">
          <a href="https://www.linkedin.com/in/nika-koghuashvili-4889991b4/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
          <a href="https://github.com/nikakogho/" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
          <a href="https://www.youtube.com/@Playground_Of_Tomorrow/" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
          <a href="https://x.com/nikakogho" target="_blank" rel="noopener noreferrer" aria-label="X"><FaTwitter /></a>
          <a href="https://www.facebook.com/nikakogho/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
        </nav>
      </footer>
    </div>
  );
};

export default HomePage;
