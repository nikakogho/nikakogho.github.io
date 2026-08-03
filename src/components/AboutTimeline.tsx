import { CSSProperties, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiPlayCircle } from 'react-icons/fi';
import { aboutTimeline } from '../data/aboutTimeline';

interface TimelineMapNode {
  id: string;
  label: string;
  x: number;
  y: number;
  milestoneIndex: number;
  color: string;
  note?: boolean;
}

interface TimelineMapSegment {
  id: string;
  from: [number, number];
  to: [number, number];
  unlockAt: number;
  color: string;
  note?: boolean;
}

const yearGuides = [
  { label: '2016', x: 92 },
  { label: '2020', x: 170 },
  { label: '2022', x: 258 },
  { label: '2023', x: 342 },
  { label: '2024', x: 468 },
  { label: '2025', x: 578 },
  { label: '2026', x: 690 },
];

const mapNodes: TimelineMapNode[] = [
  { id: 'playable-worlds', label: 'Games', x: 92, y: 110, milestoneIndex: 0, color: '#9ec9e8' },
  { id: 'liberty-bank', label: 'Liberty', x: 170, y: 110, milestoneIndex: 1, color: '#9ec9e8' },
  { id: 'university', label: 'University', x: 214, y: 293, milestoneIndex: 2, color: '#a995df' },
  { id: 'reflection', label: 'Reflection', x: 258, y: 110, milestoneIndex: 3, color: '#d7c17e' },
  { id: 'bp', label: 'BP', x: 342, y: 62, milestoneIndex: 4, color: '#d6a15f' },
  { id: 'microsoft', label: 'Microsoft', x: 416, y: 62, milestoneIndex: 4, color: '#d6a15f' },
  { id: 'biotech', label: 'Bio', x: 342, y: 198, milestoneIndex: 5, color: '#6dbda6' },
  { id: 'aerospace', label: 'Space', x: 404, y: 198, milestoneIndex: 6, color: '#6dbda6' },
  { id: 'neurotech', label: 'Neuro', x: 468, y: 198, milestoneIndex: 7, color: '#6dbda6' },
  { id: 'robotics', label: 'Robots', x: 528, y: 198, milestoneIndex: 8, color: '#6dbda6' },
  { id: 'ai', label: 'AI', x: 578, y: 198, milestoneIndex: 9, color: '#6dbda6' },
  { id: 'alignment', label: 'Align', x: 628, y: 198, milestoneIndex: 10, color: '#6dbda6' },
  { id: 'lasr-labs', label: 'LASR', x: 690, y: 110, milestoneIndex: 11, color: '#e6b86d' },
  { id: 'biotech-notes', label: '', x: 342, y: 231, milestoneIndex: 5, color: '#65d790', note: true },
  { id: 'aerospace-notes', label: '', x: 404, y: 231, milestoneIndex: 6, color: '#63b8ff', note: true },
  { id: 'neurotech-notes', label: '', x: 468, y: 231, milestoneIndex: 7, color: '#e778bd', note: true },
  { id: 'robotics-notes', label: '', x: 528, y: 231, milestoneIndex: 8, color: '#f49a3f', note: true },
  { id: 'ai-notes', label: '', x: 578, y: 231, milestoneIndex: 9, color: '#7581ff', note: true },
  { id: 'alignment-notes', label: '', x: 628, y: 231, milestoneIndex: 10, color: '#ff7f73', note: true },
];

const mapSegments: TimelineMapSegment[] = [
  { id: 'games-liberty', from: [92, 110], to: [170, 110], unlockAt: 1, color: '#9ec9e8' },
  { id: 'liberty-reflection', from: [170, 110], to: [258, 110], unlockAt: 3, color: '#9ec9e8' },
  { id: 'liberty-university', from: [170, 110], to: [214, 293], unlockAt: 2, color: '#a995df' },
  { id: 'reflection-bp', from: [258, 110], to: [342, 62], unlockAt: 4, color: '#d6a15f' },
  { id: 'bp-microsoft', from: [342, 62], to: [416, 62], unlockAt: 4, color: '#d6a15f' },
  { id: 'reflection-biotech', from: [258, 110], to: [342, 198], unlockAt: 5, color: '#6dbda6' },
  { id: 'biotech-aerospace', from: [342, 198], to: [404, 198], unlockAt: 6, color: '#6dbda6' },
  { id: 'aerospace-neurotech', from: [404, 198], to: [468, 198], unlockAt: 7, color: '#6dbda6' },
  { id: 'neurotech-robotics', from: [468, 198], to: [528, 198], unlockAt: 8, color: '#6dbda6' },
  { id: 'robotics-ai', from: [528, 198], to: [578, 198], unlockAt: 9, color: '#6dbda6' },
  { id: 'ai-alignment', from: [578, 198], to: [628, 198], unlockAt: 10, color: '#6dbda6' },
  { id: 'microsoft-lasr', from: [416, 62], to: [690, 110], unlockAt: 11, color: '#d6a15f' },
  { id: 'alignment-lasr', from: [628, 198], to: [690, 110], unlockAt: 11, color: '#d6a15f' },
  { id: 'biotech-notes', from: [342, 198], to: [342, 231], unlockAt: 5, color: '#65d790', note: true },
  { id: 'aerospace-notes', from: [404, 198], to: [404, 231], unlockAt: 6, color: '#63b8ff', note: true },
  { id: 'neurotech-notes', from: [468, 198], to: [468, 231], unlockAt: 7, color: '#e778bd', note: true },
  { id: 'robotics-notes', from: [528, 198], to: [528, 231], unlockAt: 8, color: '#f49a3f', note: true },
  { id: 'ai-notes', from: [578, 198], to: [578, 231], unlockAt: 9, color: '#7581ff', note: true },
  { id: 'alignment-notes', from: [628, 198], to: [628, 231], unlockAt: 10, color: '#ff7f73', note: true },
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
        <div className="about-timeline__visual-header">
          <div>
            <span>A life in parallel</span>
            <small>Career · curiosity · study</small>
          </div>
          <strong>{String(activeIndex + 1).padStart(2, '0')} / {String(aboutTimeline.length).padStart(2, '0')}</strong>
        </div>
        <div className="about-timeline__chapter-progress" aria-hidden="true"><span /></div>

        <svg
          className="about-timeline__map"
          viewBox="0 0 720 340"
          role="img"
          aria-label={`Career, education, and interest timeline at ${activeMilestone.period}`}
        >
          {yearGuides.map((guide) => (
            <g className="about-timeline__year-guide" key={guide.label}>
              <text x={guide.x} y="18" textAnchor="middle">{guide.label}</text>
              <line x1={guide.x} y1="30" x2={guide.x} y2="317" />
            </g>
          ))}

          <text className="about-timeline__track-label" x="18" y="114">Career</text>
          <text className="about-timeline__track-label" x="18" y="202">Interests</text>
          <text className="about-timeline__track-label" x="18" y="297">Education</text>
          <text className="about-timeline__note-label" x="340" y="257">Linked Nexus notes</text>

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

          <line className="about-timeline__education-path about-timeline__education-path--base" x1="214" y1="293" x2="690" y2="293" />
          <line
            className="about-timeline__education-path about-timeline__education-path--progress"
            x1="214"
            y1="293"
            x2={214 + universityProgress * 476}
            y2="293"
          />
          <path className="about-timeline__education-arrow" d="M690 288 L700 293 L690 298 Z" />
          <text className="about-timeline__ongoing-label" x="684" y="312" textAnchor="end">Ongoing</text>

          {mapNodes.map((point) => {
            const milestone = aboutTimeline[point.milestoneIndex];
            const isReached = point.milestoneIndex <= activeIndex;
            const isCurrent = point.milestoneIndex === activeIndex && !point.note;
            return (
              <g
                key={point.id}
                className={`about-timeline__map-point${isReached ? ' is-reached' : ''}${isCurrent ? ' is-current' : ''}${point.note ? ' is-note' : ''}`}
                transform={`translate(${point.x} ${point.y})`}
                style={{ '--node-color': point.color, '--active-color': milestone.accent } as CSSProperties}
                data-map-node={point.id}
              >
                <title>{point.note ? `${milestone.title} — linked notes` : milestone.title}</title>
                {!point.note && <circle className="about-timeline__map-focus" r="11" />}
                {point.note ? (
                  <rect className="about-timeline__map-note" x="-3" y="-3" width="6" height="6" rx="1" />
                ) : (
                  <circle className="about-timeline__map-node" r={isCurrent ? 6.5 : 4.5} />
                )}
                {point.label && (
                  <text x="0" y="-14" textAnchor="middle">
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
            {(milestone.link || milestone.videos) && (
              <div className="about-timeline__step-links">
                {milestone.link && (
                  <Link to={milestone.link.to}>
                    {milestone.link.label} <FiArrowUpRight aria-hidden="true" />
                  </Link>
                )}
                {milestone.videos?.map((video) => (
                  <a key={video.href} href={video.href} target="_blank" rel="noopener noreferrer">
                    <FiPlayCircle aria-hidden="true" /> {video.label} <FiArrowUpRight aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
};

export default AboutTimeline;
