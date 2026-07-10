import { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { IconType } from 'react-icons';
import { FaAtom, FaBrain, FaDna, FaMicrochip, FaRobot, FaSatellite } from 'react-icons/fa';
import { FiArrowUpRight, FiBookOpen, FiCode, FiFileText, FiPlay } from 'react-icons/fi';
import {
  HomePortal,
  HomePortalId,
  PortalLink,
  PortalLinkKind,
  homePortals,
} from '../../data/homePortals';

export type HomeConcept = 'orrery' | 'grimoire' | 'grove';

interface HomeRealmExperienceProps {
  concept: HomeConcept;
  selectedId: HomePortalId;
  onSelect: (id: HomePortalId) => void;
}

type PortalStyle = CSSProperties & {
  '--portal-accent': string;
  '--portal-soft': string;
  '--orbit-x'?: string;
  '--orbit-y'?: string;
};

const portalIcons: Record<HomePortalId, IconType> = {
  ai: FaMicrochip,
  robotics: FaRobot,
  biotech: FaDna,
  neurotech: FaBrain,
  space: FaSatellite,
  nanotech: FaAtom,
};

const kindIcons: Record<PortalLinkKind, IconType> = {
  Research: FiFileText,
  Blog: FiBookOpen,
  Nexus: FiBookOpen,
  Video: FiPlay,
  Project: FiCode,
};

function getPortalStyle(portal: HomePortal): PortalStyle {
  return {
    '--portal-accent': portal.accent,
    '--portal-soft': portal.softAccent,
  };
}

interface PortalDestinationProps {
  item: PortalLink;
  className: string;
  children: React.ReactNode;
}

const PortalDestination = ({ item, className, children }: PortalDestinationProps) => {
  if (item.external) {
    return (
      <a href={item.href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return <Link to={item.href} className={className}>{children}</Link>;
};

const LinkDeck = ({ portal, compact = false }: { portal: HomePortal; compact?: boolean }) => (
  <div className={`portal-link-deck${compact ? ' portal-link-deck--compact' : ''}`}>
    {portal.links.map((item) => {
      const KindIcon = kindIcons[item.kind];
      return (
        <PortalDestination key={`${portal.id}-${item.title}`} item={item} className="portal-link-card">
          <span className="portal-link-card__kind"><KindIcon aria-hidden="true" /> {item.kind}</span>
          <strong>{item.title}</strong>
          <span>{item.description}</span>
          <FiArrowUpRight className="portal-link-card__arrow" aria-hidden="true" />
        </PortalDestination>
      );
    })}
  </div>
);

const PortalIdentity = ({ portal, compact = false }: { portal: HomePortal; compact?: boolean }) => {
  const PortalIcon = portalIcons[portal.id];
  return (
    <div className={`portal-identity${compact ? ' portal-identity--compact' : ''}`}>
      <span className="portal-identity__sigil" aria-hidden="true"><PortalIcon /></span>
      <div>
        <p>{portal.realm}</p>
        <h3>{portal.title}</h3>
        {!compact && <span>{portal.summary}</span>}
      </div>
    </div>
  );
};

const DomainButton = ({
  portal,
  selected,
  onSelect,
  className,
}: {
  portal: HomePortal;
  selected: boolean;
  onSelect: (id: HomePortalId) => void;
  className: string;
}) => {
  const PortalIcon = portalIcons[portal.id];
  return (
    <button
      type="button"
      className={`${className}${selected ? ' is-selected' : ''}`}
      style={getPortalStyle(portal)}
      onClick={() => onSelect(portal.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(portal.id);
        }
      }}
      aria-pressed={selected}
      aria-label={`Open ${portal.title}: ${portal.realm}`}
    >
      <span className="domain-gate__ring" aria-hidden="true">
        <span>{portal.rune}</span>
        <PortalIcon />
      </span>
      <span className="domain-gate__label">{portal.title}</span>
    </button>
  );
};

const OrreryRealm = ({ selected, onSelect }: { selected: HomePortal; onSelect: (id: HomePortalId) => void }) => {
  const featured = selected.links[0];
  const PortalIcon = portalIcons[selected.id];

  return (
    <div className="realm-view realm-view--orrery" style={getPortalStyle(selected)}>
      <div className="orrery-stage">
        <div className="orrery-stage__constellations" aria-hidden="true" />
        <div className="orrery-stage__orbit orrery-stage__orbit--outer" aria-hidden="true" />
        <div className="orrery-stage__orbit orrery-stage__orbit--inner" aria-hidden="true" />

        {homePortals.map((portal) => (
          <div
            key={portal.id}
            className="orrery-domain-position"
            style={{
              ...getPortalStyle(portal),
              '--orbit-x': `${portal.orbit.x}%`,
              '--orbit-y': `${portal.orbit.y}%`,
            } as PortalStyle}
          >
            <DomainButton
              portal={portal}
              selected={portal.id === selected.id}
              onSelect={onSelect}
              className="domain-gate domain-gate--orrery"
            />
          </div>
        ))}

        <article className="orrery-core" aria-live="polite">
          <div className="orrery-core__halo" aria-hidden="true" />
          <div className="orrery-core__window">
            <span className="orrery-core__rune" aria-hidden="true"><PortalIcon /></span>
            <p>{selected.realm}</p>
            <h3>{selected.title}</h3>
            <span>{selected.summary}</span>
            <PortalDestination item={featured} className="orrery-feature-card">
              <small>{featured.kind} · featured doorway</small>
              <strong>{featured.title}</strong>
              <FiArrowUpRight aria-hidden="true" />
            </PortalDestination>
          </div>
        </article>
      </div>
      <LinkDeck portal={selected} compact />
    </div>
  );
};

const GrimoireRealm = ({ selected, onSelect }: { selected: HomePortal; onSelect: (id: HomePortalId) => void }) => {
  const PortalIcon = portalIcons[selected.id];

  return (
    <div className="realm-view realm-view--grimoire" style={getPortalStyle(selected)}>
      <div className="grimoire-tabs" aria-label="Grimoire chapters">
        {homePortals.map((portal) => (
          <DomainButton
            key={portal.id}
            portal={portal}
            selected={portal.id === selected.id}
            onSelect={onSelect}
            className="domain-gate domain-gate--grimoire"
          />
        ))}
      </div>

      <article className="grimoire-book" aria-live="polite">
        <div className="grimoire-book__spine" aria-hidden="true" />
        <section className="grimoire-page grimoire-page--sigil">
          <p className="grimoire-page__folio">Field grimoire · {selected.rune}</p>
          <div className="grimoire-sigil" aria-hidden="true">
            <span>{selected.rune}</span>
            <PortalIcon />
          </div>
          <p className="grimoire-page__realm">{selected.realm}</p>
          <h3>{selected.title}</h3>
          <p className="grimoire-page__summary">{selected.summary}</p>
          <div className="grimoire-annotation" aria-hidden="true">
            <span>observe</span><span>build</span><span>share</span>
          </div>
        </section>
        <section className="grimoire-page grimoire-page--entries">
          <p className="grimoire-page__folio">Known passages</p>
          <LinkDeck portal={selected} />
        </section>
      </article>
    </div>
  );
};

const GroveRealm = ({ selected, onSelect }: { selected: HomePortal; onSelect: (id: HomePortalId) => void }) => (
  <div className="realm-view realm-view--grove" style={getPortalStyle(selected)}>
    <div className="grove-canopy" aria-label="Choose a glowing gate">
      <div className="grove-stars" aria-hidden="true" />
      {homePortals.map((portal) => (
        <DomainButton
          key={portal.id}
          portal={portal}
          selected={portal.id === selected.id}
          onSelect={onSelect}
          className="domain-gate domain-gate--grove"
        />
      ))}
      <svg className="grove-roots" viewBox="0 0 1000 160" preserveAspectRatio="none" aria-hidden="true">
        <path d="M20 30 C170 130 280 10 420 100 S720 120 980 20" />
        <path d="M10 110 C180 20 300 150 510 60 S770 10 990 120" />
        <path d="M150 150 C250 80 370 100 500 130 S750 80 880 150" />
      </svg>
    </div>

    <article className="grove-clearing" aria-live="polite">
      <PortalIdentity portal={selected} />
      <LinkDeck portal={selected} />
    </article>
  </div>
);

const HomeRealmExperience = ({ concept, selectedId, onSelect }: HomeRealmExperienceProps) => {
  const selected = homePortals.find((portal) => portal.id === selectedId) ?? homePortals[0];

  if (concept === 'grimoire') return <GrimoireRealm selected={selected} onSelect={onSelect} />;
  if (concept === 'grove') return <GroveRealm selected={selected} onSelect={onSelect} />;
  return <OrreryRealm selected={selected} onSelect={onSelect} />;
};

export default HomeRealmExperience;
