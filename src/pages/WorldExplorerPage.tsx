import { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBookOpen, FiCompass, FiExternalLink, FiMap, FiNavigation, FiX } from 'react-icons/fi';
import AmbienceToggle from '../components/AmbienceToggle';
import RealmCanvas from '../components/world/RealmCanvas';
import { HomePortalId } from '../data/homePortals';
import { RealmLandmark, worldRealmById, worldRealms } from '../data/worldRealms';
import '../styles/world.css';

const isRealmId = (value: string | null): value is HomePortalId => (
  value !== null && worldRealms.some((realm) => realm.id === value)
);

const WorldExplorerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const requestedRealm = useMemo(() => new URLSearchParams(location.search).get('realm'), [location.search]);
  const [realmId, setRealmId] = useState<HomePortalId>(() => (
    isRealmId(requestedRealm) ? requestedRealm : 'ai'
  ));
  const [nearbyLandmark, setNearbyLandmark] = useState<RealmLandmark | null>(null);
  const [selectedLandmark, setSelectedLandmark] = useState<RealmLandmark | null>(null);
  const [atlasOpen, setAtlasOpen] = useState(false);
  const realm = worldRealmById[realmId];
  const activeLandmark = selectedLandmark ?? nearbyLandmark;

  useEffect(() => {
    if (isRealmId(requestedRealm) && requestedRealm !== realmId) setRealmId(requestedRealm);
  }, [realmId, requestedRealm]);

  useEffect(() => {
    const closeAtlas = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAtlasOpen(false);
      if (event.key.toLowerCase() === 'm' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        setAtlasOpen((current) => !current);
      }
    };
    window.addEventListener('keydown', closeAtlas);
    return () => window.removeEventListener('keydown', closeAtlas);
  }, []);

  const selectRealm = useCallback((nextRealm: HomePortalId) => {
    setRealmId(nextRealm);
    setNearbyLandmark(null);
    setSelectedLandmark(null);
    setAtlasOpen(false);
    navigate(`/world?realm=${nextRealm}`, { replace: true });
  }, [navigate]);

  const openLandmark = useCallback((landmark: RealmLandmark) => {
    setSelectedLandmark(landmark);
  }, []);

  return (
    <main
      className="world-explorer"
      data-realm={realm.id}
      style={{
        '--realm-accent': realm.palette.accent,
        '--realm-hot': realm.palette.accentHot,
        '--realm-ground': realm.palette.ground,
        '--realm-sky': realm.palette.sky,
      } as CSSProperties}
    >
      <RealmCanvas
        key={`canvas-${realm.id}`}
        realm={realm}
        onNearbyChange={setNearbyLandmark}
        onOpenLandmark={openLandmark}
      />

      <nav className="world-nav" aria-label="Exploration navigation">
        <Link to="/" className="world-nav__brand">
          <span>NK</span>
          <strong>Worlds in progress</strong>
        </Link>
        <div>
          <Link to="/nexus"><FiBookOpen aria-hidden="true" /> Nexus</Link>
          <button type="button" onClick={() => setAtlasOpen(true)} aria-haspopup="dialog">
            <FiMap aria-hidden="true" /> Realm atlas <kbd>M</kbd>
          </button>
        </div>
      </nav>

      <aside className="world-realm-rail" aria-label="Choose a realm">
        {worldRealms.map((option) => (
          <button
            key={option.id}
            type="button"
            className={option.id === realm.id ? 'is-active' : ''}
            aria-pressed={option.id === realm.id}
            data-realm-option={option.id}
            onClick={() => selectRealm(option.id)}
            style={{ '--option-accent': option.palette.accent } as CSSProperties}
          >
            <span>{option.sigil}</span>
            <strong>{option.shortName}</strong>
          </button>
        ))}
      </aside>

      <section key={`intro-${realm.id}`} className="world-realm-intro" aria-live="polite">
        <p>{realm.invitation}</p>
        <h1>{realm.realmName}</h1>
        <span>{realm.title}</span>
        <p>{realm.lore}</p>
      </section>

      <section className="world-vehicle-hud" aria-label="Current means of transportation">
        <span className="world-vehicle-hud__sigil">{realm.sigil}</span>
        <div>
          <span>Your familiar</span>
          <strong>{realm.vehicle.name}</strong>
          <p>{realm.vehicle.description}</p>
        </div>
      </section>

      <section className="world-controls-hud" aria-label="How to explore">
        <span><kbd>WASD</kbd><kbd>↑↓←→</kbd> move</span>
        <span><FiNavigation aria-hidden="true" /> click terrain to travel</span>
        <span><kbd>E</kbd> open nearby beacon</span>
      </section>

      <AmbienceToggle
        key={realm.id}
        src={realm.ambience.src}
        label={realm.ambience.label}
        className="world-ambience"
      />

      <aside
        className={`world-landmark-card${activeLandmark ? ' is-visible' : ''}`}
        aria-live="polite"
        aria-label="Nearby landmark"
      >
        {activeLandmark ? (
          <>
            <button
              type="button"
              className="world-landmark-card__close"
              aria-label="Close landmark details"
              onClick={() => {
                setSelectedLandmark(null);
                setNearbyLandmark(null);
              }}
            ><FiX aria-hidden="true" /></button>
            <span className="world-landmark-card__kind">{activeLandmark.kind} beacon</span>
            <h2>{activeLandmark.monument}</h2>
            <strong>{activeLandmark.title}</strong>
            <p>{activeLandmark.description}</p>
            {activeLandmark.external ? (
              <a href={activeLandmark.href} target="_blank" rel="noopener noreferrer">
                Cross this threshold <FiExternalLink aria-hidden="true" />
              </a>
            ) : (
              <Link to={activeLandmark.href}>
                Cross this threshold <FiCompass aria-hidden="true" />
              </Link>
            )}
          </>
        ) : (
          <>
            <span className="world-landmark-card__kind">No beacon in range</span>
            <h2>Follow the light.</h2>
          </>
        )}
      </aside>

      {atlasOpen && (
        <div className="realm-atlas-backdrop" role="presentation" onMouseDown={() => setAtlasOpen(false)}>
          <section
            className="realm-atlas"
            role="dialog"
            aria-modal="true"
            aria-labelledby="realm-atlas-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <p>Waygate instrument</p>
                <h2 id="realm-atlas-title">The six-realm atlas</h2>
              </div>
              <button type="button" aria-label="Close realm atlas" onClick={() => setAtlasOpen(false)}>
                <FiX aria-hidden="true" />
              </button>
            </header>
            <div className="realm-atlas__grid">
              {worldRealms.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={option.id === realm.id ? 'is-current' : ''}
                  onClick={() => selectRealm(option.id)}
                  style={{ '--option-accent': option.palette.accent } as CSSProperties}
                >
                  <span>{option.sigil}</span>
                  <div>
                    <small>{option.title}</small>
                    <strong>{option.realmName}</strong>
                    <p>Travel by {option.vehicle.name}</p>
                  </div>
                </button>
              ))}
            </div>
            <footer><FiArrowLeft aria-hidden="true" /> The atlas changes realm instantly; movement within it is yours.</footer>
          </section>
        </div>
      )}
    </main>
  );
};

export default WorldExplorerPage;
