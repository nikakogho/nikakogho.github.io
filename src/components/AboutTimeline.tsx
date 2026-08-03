import { CSSProperties, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import { aboutTimeline } from '../data/aboutTimeline';

interface TimelineMapNode {
  id: string;
  label: string;
  x: number;
  y: number;
  milestoneIndex: number;
  note?: boolean;
  labelPosition?: 'above' | 'below';
}

interface TimelineMapSegment {
  id: string;
  from: [number, number];
  to: [number, number];
  unlockAt: number;
  color: string;
  note?: boolean;
}

const mapNodes: TimelineMapNode[] = [
  { id: 'playable-worlds', label: 'Games', x: 52, y: 225, milestoneIndex: 0 },
  { id: 'liberty-bank', label: 'Liberty', x: 132, y: 225, milestoneIndex: 1 },
  { id: 'university', label: 'University', x: 174, y: 416, milestoneIndex: 2 },
  { id: 'reflection', label: 'Reflection', x: 218, y: 225, milestoneIndex: 3 },
  { id: 'bp', label: 'BP', x: 300, y: 118, milestoneIndex: 4 },
  { id: 'microsoft', label: 'Microsoft', x: 392, y: 118, milestoneIndex: 4 },
  { id: 'biotech', label: 'Bio', x: 286, y: 292, milestoneIndex: 5 },
  { id: 'aerospace', label: 'Space', x: 352, y: 292, milestoneIndex: 6 },
  { id: 'neurotech', label: 'Neuro', x: 418, y: 292, milestoneIndex: 7 },
  { id: 'robotics', label: 'Robots', x: 480, y: 292, milestoneIndex: 8 },
  { id: 'ai', label: 'AI', x: 530, y: 292, milestoneIndex: 9 },
  { id: 'alignment', label: 'Align', x: 578, y: 292, milestoneIndex: 10 },
  { id: 'lasr-labs', label: 'LASR', x: 632, y: 215, milestoneIndex: 11 },
  { id: 'biotech-notes', label: '', x: 286, y: 354, milestoneIndex: 5, note: true },
  { id: 'aerospace-notes', label: '', x: 352, y: 354, milestoneIndex: 6, note: true },
  { id: 'neurotech-notes', label: '', x: 418, y: 354, milestoneIndex: 7, note: true },
  { id: 'robotics-notes', label: '', x: 480, y: 354, milestoneIndex: 8, note: true },
  { id: 'ai-notes', label: '', x: 530, y: 354, milestoneIndex: 9, note: true },
  { id: 'alignment-notes', label: '', x: 578, y: 354, milestoneIndex: 10, note: true },
];

const mapSegments: TimelineMapSegment[] = [
  { id: 'games-liberty', from: [52, 225], to: [132, 225], unlockAt: 1, color: '#8bc7ff' },
  { id: 'liberty-reflection', from: [132, 225], to: [218, 225], unlockAt: 3, color: '#74d9bc' },
  { id: 'liberty-university', from: [132, 225], to: [174, 416], unlockAt: 2, color: '#b9a2ff' },
  { id: 'reflection-bp', from: [218, 225], to: [300, 118], unlockAt: 4, color: '#ffad70' },
  { id: 'bp-microsoft', from: [300, 118], to: [392, 118], unlockAt: 4, color: '#ffad70' },
  { id: 'reflection-biotech', from: [218, 225], to: [286, 292], unlockAt: 5, color: '#65d790' },
  { id: 'biotech-aerospace', from: [286, 292], to: [352, 292], unlockAt: 6, color: '#e778bd' },
  { id: 'aerospace-neurotech', from: [352, 292], to: [418, 292], unlockAt: 7, color: '#e778bd' },
  { id: 'neurotech-robotics', from: [418, 292], to: [480, 292], unlockAt: 8, color: '#e778bd' },
  { id: 'robotics-ai', from: [480, 292], to: [530, 292], unlockAt: 9, color: '#e778bd' },
  { id: 'ai-alignment', from: [530, 292], to: [578, 292], unlockAt: 10, color: '#e778bd' },
  { id: 'microsoft-lasr', from: [392, 118], to: [632, 215], unlockAt: 11, color: '#ffb86b' },
  { id: 'alignment-lasr', from: [578, 292], to: [632, 215], unlockAt: 11, color: '#ffb86b' },
  { id: 'biotech-notes', from: [286, 292], to: [286, 354], unlockAt: 5, color: '#65d790', note: true },
  { id: 'aerospace-notes', from: [352, 292], to: [352, 354], unlockAt: 6, color: '#63b8ff', note: true },
  { id: 'neurotech-notes', from: [418, 292], to: [418, 354], unlockAt: 7, color: '#e778bd', note: true },
  { id: 'robotics-notes', from: [480, 292], to: [480, 354], unlockAt: 8, color: '#f49a3f', note: true },
  { id: 'ai-notes', from: [530, 292], to: [530, 354], unlockAt: 9, color: '#7581ff', note: true },
  { id: 'alignment-notes', from: [578, 292], to: [578, 354], unlockAt: 10, color: '#ff7f73', note: true },
];

const AboutTimeline = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const activeMilestone = aboutTimeline[activeIndex];
  const progress = aboutTimeline.length > 1 ? activeIndex / (aboutTimeline.length - 1) : 1;
  const universityProgress = Math.max(0, (activeIndex - 2) / (aboutTimeline.length - 3));

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
          <span>Parallel paths</span>
          <strong>{String(activeIndex + 1).padStart(2, '0')} / {String(aboutTimeline.length).padStart(2, '0')}</strong>
        </div>

        <svg
          className="about-timeline__map"
          viewBox="0 0 680 470"
          role="img"
          aria-label={`Career, education, and interest timeline at ${activeMilestone.period}`}
        >
          <text className="about-timeline__track-label" x="285" y="82">Career</text>
          <text className="about-timeline__track-label" x="272" y="250">Interests</text>
          <text className="about-timeline__track-label" x="270" y="385">Nexus notes</text>
          <text className="about-timeline__track-label" x="192" y="448">University · ongoing</text>

          {mapSegments.map((segment) => (
            <g key={segment.id}>
              <line
                className={`about-timeline__segment about-timeline__segment--base${segment.note ? ' is-note-branch' : ''}`}
                x1={segment.from[0]}
                y1={segment.from[1]}
                x2={segment.to[0]}
                y2={segment.to[1]}
              />
              <line
                className={`about-timeline__segment about-timeline__segment--progress${activeIndex >= segment.unlockAt ? ' is-reached' : ''}${segment.note ? ' is-note-branch' : ''}`}
                x1={segment.from[0]}
                y1={segment.from[1]}
                x2={segment.to[0]}
                y2={segment.to[1]}
                style={{ '--segment-color': segment.color } as CSSProperties}
              />
            </g>
          ))}

          <line className="about-timeline__education-path about-timeline__education-path--base" x1="174" y1="416" x2="646" y2="416" />
          <line
            className="about-timeline__education-path about-timeline__education-path--progress"
            x1="174"
            y1="416"
            x2={174 + universityProgress * 472}
            y2="416"
          />
          <path className="about-timeline__education-arrow" d="M646 410 L658 416 L646 422 Z" />

          {mapNodes.map((point) => {
            const milestone = aboutTimeline[point.milestoneIndex];
            const isReached = point.milestoneIndex <= activeIndex;
            const isCurrent = point.milestoneIndex === activeIndex && !point.note;
            return (
              <g
                key={point.id}
                className={`about-timeline__map-point${isReached ? ' is-reached' : ''}${isCurrent ? ' is-current' : ''}${point.note ? ' is-note' : ''}`}
                transform={`translate(${point.x} ${point.y})`}
                style={{ '--node-color': milestone.accent } as CSSProperties}
                data-map-node={point.id}
              >
                <title>{point.note ? `${milestone.title} — linked notes` : milestone.title}</title>
                {!point.note && <circle className="about-timeline__map-pulse" r="17" />}
                <circle className="about-timeline__map-node" r={isCurrent ? 7 : point.note ? 3.5 : 5} />
                {point.label && (
                  <text x="0" y={point.labelPosition === 'below' ? 23 : -16} textAnchor="middle">
                    {point.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div className="about-timeline__visual-copy">
          <p>{activeMilestone.period}</p>
          <h3>{activeMilestone.title}</h3>
          <span>{activeMilestone.track} · {activeMilestone.kind}</span>
        </div>
      </aside>

      <div className="about-timeline__steps">
        {aboutTimeline.map((milestone, index) => (
          <article
            key={milestone.id}
            ref={(element) => { stepRefs.current[index] = element; }}
            className={`about-timeline__step${index === activeIndex ? ' is-active' : ''}`}
            data-timeline-index={index}
            data-timeline-track={milestone.track.toLowerCase()}
            aria-current={index === activeIndex ? 'step' : undefined}
          >
            <div className="about-timeline__step-meta">
              <span>{milestone.period}</span>
              <span>{milestone.track}</span>
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
