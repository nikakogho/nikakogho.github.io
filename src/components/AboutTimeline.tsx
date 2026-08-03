import { CSSProperties, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import { aboutTimeline } from '../data/aboutTimeline';

const mapPoints = [
  { x: 72, y: 390 },
  { x: 170, y: 330 },
  { x: 245, y: 365 },
  { x: 350, y: 245 },
  { x: 448, y: 280 },
  { x: 535, y: 125 },
];

const AboutTimeline = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const activeMilestone = aboutTimeline[activeIndex];
  const progress = aboutTimeline.length > 1 ? activeIndex / (aboutTimeline.length - 1) : 1;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => (
            Math.abs(first.boundingClientRect.top - window.innerHeight * 0.5)
            - Math.abs(second.boundingClientRect.top - window.innerHeight * 0.5)
          ))[0];

        if (!visibleEntry) return;
        const nextIndex = Number((visibleEntry.target as HTMLElement).dataset.timelineIndex);
        if (Number.isFinite(nextIndex)) setActiveIndex(nextIndex);
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: 0 },
    );

    stepRefs.current.forEach((step) => {
      if (step) observer.observe(step);
    });

    return () => observer.disconnect();
  }, []);

  const visualStyle = {
    '--timeline-accent': activeMilestone.accent,
    '--timeline-progress': progress,
  } as CSSProperties;

  return (
    <div className="about-timeline" style={visualStyle}>
      <aside className="about-timeline__visual" aria-live="polite" aria-atomic="true">
        <div className="about-timeline__grid" aria-hidden="true" />
        <div className="about-timeline__visual-header">
          <span>Path so far</span>
          <strong>{String(activeIndex + 1).padStart(2, '0')} / {String(aboutTimeline.length).padStart(2, '0')}</strong>
        </div>

        <svg className="about-timeline__map" viewBox="0 0 600 470" role="img" aria-label={`Timeline at ${activeMilestone.period}`}>
          <path
            className="about-timeline__path about-timeline__path--base"
            d="M72 390 C110 350 135 330 170 330 C205 330 215 365 245 365 C285 365 315 275 350 245 C382 217 415 280 448 280 C485 280 507 170 535 125"
            pathLength="1"
          />
          <path
            className="about-timeline__path about-timeline__path--progress"
            d="M72 390 C110 350 135 330 170 330 C205 330 215 365 245 365 C285 365 315 275 350 245 C382 217 415 280 448 280 C485 280 507 170 535 125"
            pathLength="1"
            style={{ strokeDasharray: `${progress} 1` }}
          />
          {mapPoints.map((point, index) => (
            <g
              key={aboutTimeline[index].id}
              className={`about-timeline__map-point${index <= activeIndex ? ' is-reached' : ''}${index === activeIndex ? ' is-current' : ''}`}
              transform={`translate(${point.x} ${point.y})`}
            >
              <circle className="about-timeline__map-pulse" r="22" />
              <circle className="about-timeline__map-node" r={index === activeIndex ? 8 : 5} />
              <text x="0" y="-18" textAnchor="middle">{String(index + 1).padStart(2, '0')}</text>
            </g>
          ))}
        </svg>

        <div className="about-timeline__signal" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => <span key={index} />)}
        </div>

        <div className="about-timeline__visual-copy">
          <p>{activeMilestone.period}</p>
          <h3>{activeMilestone.title}</h3>
          <span>{activeMilestone.kind}</span>
        </div>
      </aside>

      <div className="about-timeline__steps">
        {aboutTimeline.map((milestone, index) => (
          <article
            key={milestone.id}
            ref={(element) => { stepRefs.current[index] = element; }}
            className={`about-timeline__step${index === activeIndex ? ' is-active' : ''}`}
            data-timeline-index={index}
            aria-current={index === activeIndex ? 'step' : undefined}
          >
            <div className="about-timeline__step-meta">
              <span>{milestone.period}</span>
              <span>{milestone.kind}</span>
            </div>
            <h3>{milestone.title}</h3>
            <p>{milestone.summary}</p>
            {milestone.link && (
              <Link to={milestone.link.to}>
                {milestone.link.label} <FiArrowUpRight aria-hidden="true" />
              </Link>
            )}
          </article>
        ))}
      </div>
    </div>
  );
};

export default AboutTimeline;
