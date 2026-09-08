import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiPlayCircle } from 'react-icons/fi';
import { aboutTimeline } from '../data/aboutTimeline';
import './CareerHistory.css';

// This is a sequence diagram, not a proportional time axis. The parallel rails
// distinguish employment, independent study, and the continuing degree.
const points = [
  { index: 0, x: 36, y: 70, label: 'Games' },
  { index: 1, x: 36, y: 125, label: 'Liberty Bank' },
  { index: 2, x: 418, y: 170, label: 'KIU' },
  { index: 3, x: 36, y: 210, label: 'Reconsidering' },
  { index: 4, x: 36, y: 275, label: 'BP' },
  { index: 4, x: 36, y: 330, label: 'Microsoft' },
  { index: 5, x: 210, y: 275, label: 'Biotech' },
  { index: 6, x: 210, y: 335, label: 'Aerospace' },
  { index: 7, x: 210, y: 395, label: 'Neurotech' },
  { index: 8, x: 210, y: 455, label: 'Robotics' },
  { index: 9, x: 210, y: 515, label: 'AI' },
  { index: 10, x: 210, y: 575, label: 'AI alignment' },
  { index: 11, x: 36, y: 660, label: 'LASR Labs' },
];
const segments = [
  { at: 1, d: 'M36 70 V125', track: 'work' },
  { at: 2, d: 'M36 140 H398 Q418 140 418 160 V170', track: 'degree' },
  { at: 3, d: 'M36 125 V210', track: 'work' },
  { at: 4, d: 'M36 210 V330', track: 'work' },
  { at: 5, d: 'M36 225 H190 Q210 225 210 245 V275', track: 'study' },
  ...[6, 7, 8, 9, 10].map((at, i) => ({ at, d: `M210 ${275 + i * 60} V${335 + i * 60}`, track: 'study' })),
  { at: 11, d: 'M36 330 V660', track: 'work' },
  { at: 11, d: 'M210 575 V610 Q210 630 190 630 H56 Q36 630 36 650 V660', track: 'study' },
];

export default function AboutTimeline() {
  const [active, setActive] = useState(0);
  const steps = useRef<Array<HTMLElement | null>>([]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const entry = entries.filter(item => item.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
      if (entry) setActive(Number((entry.target as HTMLElement).dataset.index));
    }, { rootMargin: '-25% 0px -45% 0px' });
    steps.current.forEach(step => { if (step) observer.observe(step); });
    return () => observer.disconnect();
  }, []);
  const jump = (index: number) => {
    setActive(index);
    steps.current[index]?.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  return <div className="career-history">
    <aside className="career-route" aria-label="Career overview">
      <div className="career-route__key"><span>Work</span><span>Independent study</span><span>University</span></div>
      <svg viewBox="0 0 470 710" className="career-route__map" aria-label="Work and independent study meet at LASR Labs; university continues alongside them.">
        {segments.map((segment, index) => <path key={index} d={segment.d} className={`career-route__line ${segment.track}${active >= segment.at ? ' reached' : ''}`} />)}
        <path d="M418 170 V675 l-4 -7 m4 7 l4 -7" className={`career-route__line degree${active >= 2 ? ' reached' : ''}`} />
        <text x="418" y="697" textAnchor="middle" className="career-route__ongoing">Ongoing</text>
        {points.map((point, index) => <g key={index} className={`career-route__point${active >= point.index ? ' reached' : ''}${active === point.index ? ' current' : ''}`}>
          <a href={`#career-${aboutTimeline[point.index].id}`} onClick={event => { event.preventDefault(); jump(point.index); }} aria-label={`${aboutTimeline[point.index].period}: ${point.label}`}>
            <rect x={point.x - 12} y={point.y - 19} width={point.index === 2 ? 48 : 150} height="38" fill="transparent" />
            <circle cx={point.x} cy={point.y} r="4" />
            <text x={point.x + 12} y={point.y + 4}>{point.label}</text>
          </a>
        </g>)}
      </svg>
      <p className="career-route__caption">2016 — present <span>Select a stop to read more</span></p>
    </aside>
    <div className="career-entries">
      {aboutTimeline.map((milestone, index) => <article key={milestone.id} id={`career-${milestone.id}`} ref={element => { steps.current[index] = element; }} data-index={index} className={`career-entry${active === index ? ' is-current' : ''}`}>
        <div className="career-entry__meta"><time>{milestone.period}</time><span>{milestone.track === 'Interests' ? 'Independent study' : milestone.track === 'Education' ? 'University' : milestone.track === 'Decision' ? 'Personal' : 'Work'}</span></div>
        <h3>{milestone.title}</h3>
        <p>{milestone.summary}</p>
        <div className="career-entry__links">
          {milestone.link && <Link to={milestone.link.to}>{milestone.link.label.replace('Explore my ', '').replace('See my ', '')} <FiArrowUpRight aria-hidden="true" /></Link>}
          {milestone.videos?.map(video => <a key={video.href} href={video.href} target="_blank" rel="noopener noreferrer"><FiPlayCircle aria-hidden="true" />{video.label.replace('Watch ', '')}</a>)}
        </div>
      </article>)}
    </div>
  </div>;
}
