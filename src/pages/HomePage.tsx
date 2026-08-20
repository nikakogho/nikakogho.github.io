import { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowDown, FiArrowUpRight, FiFileText, FiMail } from 'react-icons/fi';
import AboutTimeline from '../components/AboutTimeline';
import { cvUrl, profileLinks } from '../data/profileLinks';
import '../styles/landing.css';

const siteDestinations = [
  {
    number: '01',
    title: 'Nexus',
    description: 'The connected notebook — science, engineering, people, and possible futures.',
    to: '/nexus',
  },
  {
    number: '02',
    title: 'Research',
    description: 'Technical investigations, experiments, and results.',
    to: '/research',
  },
  {
    number: '03',
    title: 'Blog',
    description: 'Projects, build logs, essays, and ideas in progress.',
    to: '/blog',
  },
];

const HomePage = () => {
  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    section?.focus({ preventScroll: true });
  };

  return (
    <div className="landing-page landing-page--editorial">
      <a
        className="landing-skip"
        href="#landing-content"
        onClick={(event) => scrollToSection(event, 'landing-content')}
      >
        Skip to introduction
      </a>

      <header className="editorial-header">
        <Link className="editorial-wordmark" to="/" aria-label="Nika Koghuashvili home">
          NK<span>/</span>26
        </Link>
        <nav aria-label="Primary navigation">
          <a href="#about" onClick={(event) => scrollToSection(event, 'about')}>About</a>
          <Link to="/nexus">Nexus</Link>
          <Link to="/research">Research</Link>
          <Link to="/blog">Blog</Link>
        </nav>
        <a className="editorial-contact" href="mailto:nikakoghuashvili@gmail.com">
          Email <FiArrowUpRight aria-hidden="true" />
        </a>
      </header>

      <main id="landing-content" className="editorial-hero" tabIndex={-1}>
        <section className="editorial-intro" aria-labelledby="landing-title">
          <div className="editorial-kicker">
            <span>Personal site</span>
            <span>London · 2026</span>
          </div>
          <h1 id="landing-title">
            <span>Nika</span>
            <span>Koghuashvili</span>
          </h1>
          <div className="editorial-statement">
            <span aria-hidden="true" />
            <div>
              <p>Curious about our future.</p>
              <p>Currently trying to make AGI go well.</p>
            </div>
          </div>
        </section>

        <aside className="editorial-index" aria-labelledby="editorial-index-title">
          <div className="editorial-index__heading">
            <p id="editorial-index-title">Index</p>
            <span>Selected paths through this site</span>
          </div>
          <ol>
            {siteDestinations.map((destination) => (
              <li key={destination.title}>
                <Link to={destination.to}>
                  <span>{destination.number}</span>
                  <strong>{destination.title}</strong>
                  <p>{destination.description}</p>
                  <FiArrowUpRight aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        </aside>
      </main>

      <div className="editorial-rail">
        <nav aria-label="Profiles and contact links">
          {profileLinks.map((profile) => (
            <a
              key={profile.id}
              href={profile.href}
              target={profile.external ? '_blank' : undefined}
              rel={profile.external ? 'me noopener noreferrer' : undefined}
              aria-label={profile.ariaLabel}
            >
              {profile.label}<FiArrowUpRight aria-hidden="true" />
            </a>
          ))}
          <a href={cvUrl} target="_blank" rel="noopener noreferrer">
            CV<FiArrowUpRight aria-hidden="true" />
          </a>
        </nav>
        <a className="editorial-scroll" href="#about" onClick={(event) => scrollToSection(event, 'about')}>
          Life & work <FiArrowDown aria-hidden="true" />
        </a>
      </div>

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
            <FiFileText aria-hidden="true" /> Read my CV <FiArrowUpRight aria-hidden="true" />
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
