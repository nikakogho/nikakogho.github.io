import { PointerEvent, useEffect, useMemo, useRef, useState } from 'react';
import { FiArrowDown, FiArrowLeft, FiArrowRight, FiArrowUp, FiCornerDownRight } from 'react-icons/fi';
import { RealmLandmark, TerrainKind, VehicleKind, WORLD_BOUNDS, WorldRealm } from '../../data/worldRealms';

interface RealmCanvasProps {
  realm: WorldRealm;
  onNearbyChange: (landmark: RealmLandmark | null) => void;
  onOpenLandmark: (landmark: RealmLandmark) => void;
}

interface MovingPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  heading: number;
}

interface CanvasSize {
  width: number;
  height: number;
  dpr: number;
}

interface DecorPoint {
  x: number;
  y: number;
  size: number;
  phase: number;
  variant: number;
}

interface TrailPoint {
  x: number;
  y: number;
  life: number;
}

const VERTICAL_SCALE = 0.62;
const INTERACTION_RADIUS = 145;

const clamp = (value: number, minimum: number, maximum: number) => (
  Math.max(minimum, Math.min(maximum, value))
);

const project = (x: number, y: number, camera: { x: number; y: number }, size: CanvasSize) => ({
  x: x - camera.x + size.width / 2,
  y: (y - camera.y) * VERTICAL_SCALE + size.height / 2,
});

const unproject = (x: number, y: number, camera: { x: number; y: number }, size: CanvasSize) => ({
  x: x + camera.x - size.width / 2,
  y: (y - size.height / 2) / VERTICAL_SCALE + camera.y,
});

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1_664_525 + 1_013_904_223) >>> 0;
    return value / 4_294_967_296;
  };
}

function createDecor(realm: WorldRealm): DecorPoint[] {
  const seed = realm.id.split('').reduce((total, character) => total + character.charCodeAt(0), 41);
  const random = seededRandom(seed);
  return Array.from({ length: 96 }, () => ({
    x: 70 + random() * (WORLD_BOUNDS.width - 140),
    y: 70 + random() * (WORLD_BOUNDS.height - 140),
    size: 9 + random() * 31,
    phase: random() * Math.PI * 2,
    variant: Math.floor(random() * 4),
  })).sort((a, b) => a.y - b.y);
}

function pathPolygon(
  context: CanvasRenderingContext2D,
  sides: number,
  radius: number,
  rotation = -Math.PI / 2,
) {
  context.beginPath();
  for (let index = 0; index < sides; index += 1) {
    const angle = rotation + (index / sides) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.closePath();
}

function drawTerrainPattern(
  context: CanvasRenderingContext2D,
  realm: WorldRealm,
  camera: { x: number; y: number },
  size: CanvasSize,
  elapsed: number,
) {
  const { palette, terrain } = realm;
  const gradient = context.createRadialGradient(
    size.width * 0.52,
    size.height * 0.48,
    20,
    size.width * 0.5,
    size.height * 0.5,
    Math.max(size.width, size.height) * 0.75,
  );
  gradient.addColorStop(0, palette.groundLight);
  gradient.addColorStop(0.52, palette.ground);
  gradient.addColorStop(1, palette.sky);
  context.fillStyle = gradient;
  context.fillRect(0, 0, size.width, size.height);

  context.save();
  context.lineWidth = 1;
  context.globalAlpha = terrain === 'astral' ? 0.12 : 0.2;
  context.strokeStyle = palette.accent;

  const grid = terrain === 'lattice' ? 86 : terrain === 'verdant' ? 130 : 105;
  const minX = Math.floor((camera.x - size.width / 2 - grid) / grid) * grid;
  const maxX = camera.x + size.width / 2 + grid;
  const worldHeight = size.height / VERTICAL_SCALE;
  const minY = Math.floor((camera.y - worldHeight / 2 - grid) / grid) * grid;
  const maxY = camera.y + worldHeight / 2 + grid;

  if (terrain === 'lattice') {
    const radius = grid * 0.46;
    for (let y = minY; y <= maxY; y += grid * 0.78) {
      for (let x = minX; x <= maxX; x += grid) {
        const offsetX = Math.round(y / (grid * 0.78)) % 2 === 0 ? 0 : grid / 2;
        const point = project(x + offsetX, y, camera, size);
        context.save();
        context.translate(point.x, point.y);
        context.scale(1, VERTICAL_SCALE);
        pathPolygon(context, 6, radius);
        context.stroke();
        context.restore();
      }
    }
  } else {
    for (let x = minX; x <= maxX; x += grid) {
      const start = project(x, minY, camera, size);
      const end = project(x, maxY, camera, size);
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();
    }

    for (let y = minY; y <= maxY; y += grid) {
      const start = project(minX, y, camera, size);
      const end = project(maxX, y, camera, size);
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();
    }
  }
  context.restore();

  if (terrain === 'circuit' || terrain === 'dream') {
    context.save();
    context.globalAlpha = 0.28;
    context.lineWidth = 2;
    context.strokeStyle = palette.accentHot;
    for (let index = 0; index < 7; index += 1) {
      const worldY = ((index * 241 + elapsed * (terrain === 'circuit' ? 18 : 5)) % WORLD_BOUNDS.height);
      const start = project(0, worldY, camera, size);
      const bend = project(650 + (index % 3) * 220, worldY + 70, camera, size);
      const end = project(WORLD_BOUNDS.width, worldY - 30, camera, size);
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(bend.x, bend.y);
      context.lineTo(end.x, end.y);
      context.stroke();
    }
    context.restore();
  }

  if (terrain === 'astral') {
    context.save();
    for (let index = 0; index < 55; index += 1) {
      const x = (index * 137.31 + 41) % size.width;
      const y = (index * 79.77 + 29) % size.height;
      const pulse = 0.35 + Math.sin(elapsed * 1.5 + index) * 0.25;
      context.globalAlpha = pulse;
      context.fillStyle = index % 9 === 0 ? palette.accentHot : '#dcecff';
      context.fillRect(x, y, index % 7 === 0 ? 2 : 1, index % 7 === 0 ? 2 : 1);
    }
    context.restore();
  }
}

function drawPathways(
  context: CanvasRenderingContext2D,
  realm: WorldRealm,
  camera: { x: number; y: number },
  size: CanvasSize,
) {
  const hub = project(WORLD_BOUNDS.width / 2, WORLD_BOUNDS.height / 2, camera, size);
  context.save();
  context.lineCap = 'round';
  for (const landmark of realm.landmarks) {
    const point = project(landmark.x, landmark.y, camera, size);
    context.beginPath();
    context.moveTo(hub.x, hub.y);
    context.quadraticCurveTo((hub.x + point.x) / 2, hub.y - 45, point.x, point.y);
    context.lineWidth = 22;
    context.globalAlpha = 0.075;
    context.strokeStyle = realm.palette.accent;
    context.stroke();
    context.lineWidth = 2;
    context.globalAlpha = 0.32;
    context.setLineDash([4, 13]);
    context.stroke();
    context.setLineDash([]);
  }
  context.restore();
}

function drawDecorPoint(
  context: CanvasRenderingContext2D,
  terrain: TerrainKind,
  point: DecorPoint,
  screen: { x: number; y: number },
  realm: WorldRealm,
  elapsed: number,
) {
  const { palette } = realm;
  const pulse = 0.82 + Math.sin(elapsed * 1.4 + point.phase) * 0.16;
  context.save();
  context.translate(screen.x, screen.y);

  context.globalAlpha = 0.36;
  context.fillStyle = '#000';
  context.beginPath();
  context.ellipse(0, 4, point.size * 0.7, point.size * 0.24, 0, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 1;

  if (terrain === 'circuit') {
    context.shadowBlur = 13 * pulse;
    context.shadowColor = palette.accent;
    context.fillStyle = point.variant % 2 === 0 ? palette.accent : palette.accentHot;
    context.fillRect(-1.5, -point.size * 1.25, 3, point.size * 1.1);
    context.globalAlpha = 0.32;
    context.fillRect(-point.size * 0.36, -3, point.size * 0.72, 3);
  } else if (terrain === 'foundry') {
    context.rotate(point.phase);
    context.strokeStyle = point.variant % 2 === 0 ? palette.accent : palette.groundLight;
    context.lineWidth = Math.max(2, point.size * 0.18);
    pathPolygon(context, 8, point.size * 0.48);
    context.stroke();
    context.fillStyle = palette.accentHot;
    context.globalAlpha = 0.58;
    context.beginPath();
    context.arc(0, 0, point.size * 0.11, 0, Math.PI * 2);
    context.fill();
  } else if (terrain === 'verdant') {
    context.fillStyle = point.variant % 2 === 0 ? '#173f2d' : '#1c5137';
    context.beginPath();
    context.moveTo(0, -point.size * 1.45);
    context.lineTo(point.size * 0.72, 0);
    context.lineTo(-point.size * 0.72, 0);
    context.closePath();
    context.fill();
    context.fillStyle = palette.accentHot;
    context.shadowBlur = 9;
    context.shadowColor = palette.accent;
    context.beginPath();
    context.arc(point.size * 0.22, -point.size * 0.55, 2.3 * pulse, 0, Math.PI * 2);
    context.fill();
  } else if (terrain === 'dream') {
    context.strokeStyle = '#824fa1';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, 0);
    context.quadraticCurveTo(-point.size * 0.3, -point.size * 0.7, 0, -point.size * 1.1);
    context.stroke();
    context.fillStyle = point.variant % 2 === 0 ? palette.accent : palette.accentHot;
    context.shadowBlur = 15 * pulse;
    context.shadowColor = context.fillStyle;
    context.beginPath();
    context.arc(0, -point.size * 1.15, point.size * 0.23, 0, Math.PI * 2);
    context.fill();
  } else if (terrain === 'astral') {
    context.rotate(point.phase);
    context.fillStyle = point.variant % 2 === 0 ? '#263653' : '#344a6d';
    pathPolygon(context, 7, point.size * 0.54);
    context.fill();
    context.strokeStyle = palette.accent;
    context.globalAlpha = 0.28;
    context.stroke();
  } else {
    context.fillStyle = point.variant % 2 === 0 ? palette.accent : palette.accentHot;
    context.globalAlpha = 0.62;
    context.shadowBlur = 10 * pulse;
    context.shadowColor = palette.accent;
    context.beginPath();
    context.moveTo(0, -point.size * 1.3);
    context.lineTo(point.size * 0.42, -point.size * 0.18);
    context.lineTo(0, point.size * 0.14);
    context.lineTo(-point.size * 0.42, -point.size * 0.18);
    context.closePath();
    context.fill();
  }
  context.restore();
}

function drawLandmark(
  context: CanvasRenderingContext2D,
  landmark: RealmLandmark,
  screen: { x: number; y: number },
  realm: WorldRealm,
  elapsed: number,
  isNearby: boolean,
) {
  const pulse = 1 + Math.sin(elapsed * 2.2 + landmark.x) * 0.06;
  context.save();
  context.translate(screen.x, screen.y);

  context.globalAlpha = 0.34;
  context.fillStyle = '#000';
  context.beginPath();
  context.ellipse(0, 10, 52, 17, 0, 0, Math.PI * 2);
  context.fill();

  context.globalAlpha = isNearby ? 0.34 : 0.16;
  context.fillStyle = realm.palette.accent;
  context.shadowBlur = isNearby ? 42 : 24;
  context.shadowColor = realm.palette.accent;
  context.beginPath();
  context.ellipse(0, 0, 55 * pulse, 22 * pulse, 0, 0, Math.PI * 2);
  context.fill();

  context.globalAlpha = 1;
  context.shadowBlur = 22;
  context.lineWidth = isNearby ? 3 : 2;
  context.strokeStyle = isNearby ? realm.palette.accentHot : realm.palette.accent;
  context.beginPath();
  context.ellipse(0, -26, 32 * pulse, 54 * pulse, 0, 0, Math.PI * 2);
  context.stroke();

  context.fillStyle = '#0a0b16';
  context.strokeStyle = realm.palette.accent;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(-22, 5);
  context.lineTo(-14, -52);
  context.lineTo(0, -72);
  context.lineTo(14, -52);
  context.lineTo(22, 5);
  context.closePath();
  context.fill();
  context.stroke();

  context.fillStyle = realm.palette.accentHot;
  context.shadowBlur = 15;
  context.font = '700 10px Poppins, sans-serif';
  context.textAlign = 'center';
  context.fillText(landmark.kind.toUpperCase(), 0, -31);

  const label = landmark.monument;
  context.shadowBlur = 0;
  context.font = '700 12px Poppins, sans-serif';
  const width = Math.min(230, context.measureText(label).width + 24);
  context.fillStyle = 'rgba(3, 5, 13, 0.86)';
  context.strokeStyle = isNearby ? realm.palette.accentHot : 'rgba(255,255,255,0.2)';
  context.lineWidth = 1;
  context.beginPath();
  context.roundRect(-width / 2, 25, width, 30, 8);
  context.fill();
  context.stroke();
  context.fillStyle = '#f7f5ef';
  context.fillText(label, 0, 45, width - 14);
  context.restore();
}

function drawVehicleShape(
  context: CanvasRenderingContext2D,
  kind: VehicleKind,
  realm: WorldRealm,
  elapsed: number,
) {
  const flap = Math.sin(elapsed * 9) * 5;
  const accent = realm.palette.accent;
  const hot = realm.palette.accentHot;
  context.strokeStyle = hot;
  context.fillStyle = accent;
  context.lineWidth = 2;
  context.shadowBlur = 18;
  context.shadowColor = accent;

  if (kind === 'wisp') {
    const gradient = context.createRadialGradient(0, 0, 1, 0, 0, 17);
    gradient.addColorStop(0, '#fff');
    gradient.addColorStop(0.25, hot);
    gradient.addColorStop(1, 'rgba(100, 110, 255, 0)');
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(0, 0, 18, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.moveTo(-12, 0);
    context.quadraticCurveTo(-28, -10, -40, 1);
    context.stroke();
  } else if (kind === 'strider') {
    context.fillStyle = '#3a2630';
    context.strokeStyle = hot;
    context.fillRect(-18, -10, 36, 20);
    context.strokeRect(-18, -10, 36, 20);
    for (const side of [-1, 1]) {
      context.beginPath();
      context.moveTo(-10, side * 8);
      context.lineTo(-18, side * 20);
      context.lineTo(-28, side * 23);
      context.moveTo(10, side * 8);
      context.lineTo(18, side * 20);
      context.lineTo(27, side * 23);
      context.stroke();
    }
    context.fillStyle = hot;
    context.fillRect(11, -5, 4, 4);
    context.fillRect(11, 3, 4, 4);
  } else if (kind === 'sporewing') {
    context.globalAlpha = 0.7;
    context.fillStyle = accent;
    context.beginPath();
    context.ellipse(-5, -13, 20 + flap, 9, -0.55, 0, Math.PI * 2);
    context.ellipse(-5, 13, 20 + flap, 9, 0.55, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 1;
    context.fillStyle = hot;
    context.beginPath();
    context.ellipse(5, 0, 21, 7, 0, 0, Math.PI * 2);
    context.fill();
  } else if (kind === 'moth') {
    context.fillStyle = accent;
    context.globalAlpha = 0.75;
    context.beginPath();
    context.moveTo(7, 0);
    context.lineTo(-12, -25 - flap);
    context.lineTo(-22, -4);
    context.lineTo(-10, 0);
    context.lineTo(-22, 4);
    context.lineTo(-12, 25 + flap);
    context.closePath();
    context.fill();
    context.globalAlpha = 1;
    context.fillStyle = hot;
    context.beginPath();
    context.ellipse(5, 0, 15, 5, 0, 0, Math.PI * 2);
    context.fill();
  } else if (kind === 'skiff') {
    context.fillStyle = '#182c4c';
    context.beginPath();
    context.moveTo(30, 0);
    context.lineTo(-17, -14);
    context.lineTo(-8, 0);
    context.lineTo(-17, 14);
    context.closePath();
    context.fill();
    context.stroke();
    context.fillStyle = hot;
    context.fillRect(-17, -7, 8, 4);
    context.fillRect(-17, 3, 8, 4);
  } else {
    context.fillStyle = '#123d44';
    context.beginPath();
    context.ellipse(0, 0, 20, 14, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.beginPath();
    context.moveTo(16, -7);
    context.quadraticCurveTo(29, -18, 34, -8);
    context.moveTo(16, 7);
    context.quadraticCurveTo(29, 18, 34, 8);
    context.stroke();
    context.strokeStyle = accent;
    context.beginPath();
    context.moveTo(-4, -12);
    context.lineTo(-4, 12);
    context.stroke();
  }
}

function drawVehicle(
  context: CanvasRenderingContext2D,
  player: MovingPoint,
  camera: { x: number; y: number },
  size: CanvasSize,
  realm: WorldRealm,
  elapsed: number,
) {
  const screen = project(player.x, player.y, camera, size);
  const angle = Math.atan2(player.vy * VERTICAL_SCALE, player.vx);
  context.save();
  context.translate(screen.x, screen.y);
  context.globalAlpha = 0.38;
  context.fillStyle = '#000';
  context.beginPath();
  context.ellipse(0, 13, 27, 9, 0, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 1;
  context.rotate(Number.isFinite(angle) && Math.hypot(player.vx, player.vy) > 4 ? angle : player.heading);
  drawVehicleShape(context, realm.vehicle.kind, realm, elapsed);
  context.restore();
}

function drawTrail(
  context: CanvasRenderingContext2D,
  trail: TrailPoint[],
  camera: { x: number; y: number },
  size: CanvasSize,
  realm: WorldRealm,
) {
  context.save();
  context.fillStyle = realm.palette.accent;
  context.shadowBlur = 8;
  context.shadowColor = realm.palette.accent;
  for (const point of trail) {
    const screen = project(point.x, point.y, camera, size);
    context.globalAlpha = point.life * 0.45;
    context.beginPath();
    context.arc(screen.x, screen.y, 2.5 + point.life * 2, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}

function renderRealm(
  context: CanvasRenderingContext2D,
  realm: WorldRealm,
  player: MovingPoint,
  camera: { x: number; y: number },
  size: CanvasSize,
  decor: DecorPoint[],
  trail: TrailPoint[],
  nearbyId: string | null,
  target: { x: number; y: number } | null,
  elapsed: number,
) {
  context.clearRect(0, 0, size.width, size.height);
  drawTerrainPattern(context, realm, camera, size, elapsed);
  drawPathways(context, realm, camera, size);

  if (target) {
    const screen = project(target.x, target.y, camera, size);
    context.save();
    context.strokeStyle = realm.palette.accentHot;
    context.globalAlpha = 0.56;
    context.lineWidth = 2;
    context.beginPath();
    context.ellipse(screen.x, screen.y, 18 + Math.sin(elapsed * 4) * 4, 8, 0, 0, Math.PI * 2);
    context.stroke();
    context.restore();
  }

  for (const point of decor) {
    const screen = project(point.x, point.y, camera, size);
    if (screen.x < -70 || screen.x > size.width + 70 || screen.y < -90 || screen.y > size.height + 70) continue;
    drawDecorPoint(context, realm.terrain, point, screen, realm, elapsed);
  }

  drawTrail(context, trail, camera, size, realm);
  for (const landmark of realm.landmarks) {
    const screen = project(landmark.x, landmark.y, camera, size);
    drawLandmark(context, landmark, screen, realm, elapsed, nearbyId === landmark.id);
  }
  drawVehicle(context, player, camera, size, realm, elapsed);

  const vignette = context.createRadialGradient(
    size.width / 2,
    size.height / 2,
    Math.min(size.width, size.height) * 0.28,
    size.width / 2,
    size.height / 2,
    Math.max(size.width, size.height) * 0.72,
  );
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.48)');
  context.fillStyle = vignette;
  context.fillRect(0, 0, size.width, size.height);

  context.save();
  context.globalAlpha = 0.055;
  context.fillStyle = '#fff';
  context.font = `700 ${Math.min(size.width * 0.22, 230)}px Georgia, serif`;
  context.textAlign = 'center';
  context.fillText(realm.sigil, size.width / 2, size.height * 0.62);
  context.restore();
}

const RealmCanvas = ({ realm, onNearbyChange, onOpenLandmark }: RealmCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef<CanvasSize>({ width: 1, height: 1, dpr: 1 });
  const playerRef = useRef<MovingPoint>({ ...realm.entry, vx: 0, vy: 0, heading: 0 });
  const cameraRef = useRef({ ...realm.entry });
  const targetRef = useRef<{ x: number; y: number } | null>(null);
  const keysRef = useRef(new Set<string>());
  const virtualDirectionRef = useRef({ x: 0, y: 0 });
  const nearbyRef = useRef<RealmLandmark | null>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const lastTrailAtRef = useRef(0);
  const openLandmarkRef = useRef(onOpenLandmark);
  const nearbyChangeRef = useRef(onNearbyChange);
  const [nearby, setNearby] = useState<RealmLandmark | null>(null);
  const decor = useMemo(() => createDecor(realm), [realm]);

  useEffect(() => {
    openLandmarkRef.current = onOpenLandmark;
    nearbyChangeRef.current = onNearbyChange;
  }, [onNearbyChange, onOpenLandmark]);

  useEffect(() => {
    playerRef.current = { ...realm.entry, vx: 0, vy: 0, heading: 0 };
    cameraRef.current = { ...realm.entry };
    targetRef.current = null;
    trailRef.current = [];
    nearbyRef.current = null;
    setNearby(null);
    nearbyChangeRef.current(null);
  }, [realm]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const bounds = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeRef.current = { width: bounds.width, height: bounds.height, dpr };
      canvas.width = Math.max(1, Math.round(bounds.width * dpr));
      canvas.height = Math.max(1, Math.round(bounds.height * dpr));
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    let frameId = 0;
    let previousTime = performance.now();
    let elapsed = 0;
    let telemetryAt = 0;
    const activeKeys = keysRef.current;

    const interact = () => {
      if (nearbyRef.current) openLandmarkRef.current(nearbyRef.current);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
        event.preventDefault();
        keysRef.current.add(key);
        targetRef.current = null;
      }
      if ((key === 'e' || key === 'enter') && nearbyRef.current) {
        event.preventDefault();
        interact();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(event.key.toLowerCase());
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const frame = (time: number) => {
      const delta = Math.min(0.034, Math.max(0.001, (time - previousTime) / 1_000));
      previousTime = time;
      elapsed += delta;
      const player = playerRef.current;
      const keys = keysRef.current;
      let inputX = virtualDirectionRef.current.x;
      let inputY = virtualDirectionRef.current.y;
      inputX += (keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0);
      inputY += (keys.has('s') || keys.has('arrowdown') ? 1 : 0) - (keys.has('w') || keys.has('arrowup') ? 1 : 0);

      if (inputX === 0 && inputY === 0 && targetRef.current) {
        const distanceX = targetRef.current.x - player.x;
        const distanceY = targetRef.current.y - player.y;
        const distance = Math.hypot(distanceX, distanceY);
        if (distance < 22) {
          targetRef.current = null;
        } else {
          inputX = distanceX / distance;
          inputY = distanceY / distance;
        }
      }

      const inputLength = Math.hypot(inputX, inputY);
      if (inputLength > 0) {
        inputX /= inputLength;
        inputY /= inputLength;
        const acceleration = realm.vehicle.handling * realm.vehicle.speed;
        player.vx += inputX * acceleration * delta;
        player.vy += inputY * acceleration * delta;
        player.heading = Math.atan2(inputY * VERTICAL_SCALE, inputX);
      }

      const drag = Math.exp(-(inputLength > 0 ? 3.3 : 5.2) * delta);
      player.vx *= drag;
      player.vy *= drag;
      const speed = Math.hypot(player.vx, player.vy);
      if (speed > realm.vehicle.speed) {
        player.vx = (player.vx / speed) * realm.vehicle.speed;
        player.vy = (player.vy / speed) * realm.vehicle.speed;
      }

      player.x = clamp(player.x + player.vx * delta, 55, WORLD_BOUNDS.width - 55);
      player.y = clamp(player.y + player.vy * delta, 55, WORLD_BOUNDS.height - 55);

      const cameraEase = 1 - Math.exp(-5.6 * delta);
      cameraRef.current.x += (player.x - cameraRef.current.x) * cameraEase;
      cameraRef.current.y += (player.y - cameraRef.current.y) * cameraEase;

      if (speed > 45 && time - lastTrailAtRef.current > 82) {
        trailRef.current.push({ x: player.x, y: player.y + 12, life: 1 });
        lastTrailAtRef.current = time;
      }
      for (const trailPoint of trailRef.current) trailPoint.life -= delta * 0.72;
      trailRef.current = trailRef.current.filter((trailPoint) => trailPoint.life > 0);

      let closest: RealmLandmark | null = null;
      let closestDistance = Number.POSITIVE_INFINITY;
      for (const landmark of realm.landmarks) {
        const distance = Math.hypot(landmark.x - player.x, landmark.y - player.y);
        if (distance < INTERACTION_RADIUS && distance < closestDistance) {
          closest = landmark;
          closestDistance = distance;
        }
      }
      if (closest?.id !== nearbyRef.current?.id) {
        nearbyRef.current = closest;
        setNearby(closest);
        nearbyChangeRef.current(closest);
      }

      const size = sizeRef.current;
      if (time - telemetryAt > 180) {
        canvas.dataset.playerX = player.x.toFixed(1);
        canvas.dataset.playerY = player.y.toFixed(1);
        canvas.dataset.nearby = closest?.id ?? '';
        telemetryAt = time;
      }
      context.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
      renderRealm(
        context,
        realm,
        player,
        cameraRef.current,
        size,
        decor,
        trailRef.current,
        closest?.id ?? null,
        targetRef.current,
        elapsed,
      );
      frameId = requestAnimationFrame(frame);
    };

    frameId = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      activeKeys.clear();
    };
  }, [decor, realm]);

  const travelToPointer = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const world = unproject(
      event.clientX - bounds.left,
      event.clientY - bounds.top,
      cameraRef.current,
      sizeRef.current,
    );
    targetRef.current = {
      x: clamp(world.x, 55, WORLD_BOUNDS.width - 55),
      y: clamp(world.y, 55, WORLD_BOUNDS.height - 55),
    };
    canvas.focus({ preventScroll: true });
  };

  const setVirtualDirection = (x: number, y: number) => (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    virtualDirectionRef.current = { x, y };
    targetRef.current = null;
  };

  const stopVirtualDirection = () => {
    virtualDirectionRef.current = { x: 0, y: 0 };
  };

  return (
    <div ref={containerRef} className="realm-canvas-wrap" data-testid="realm-canvas-wrap">
      <canvas
        ref={canvasRef}
        className="realm-canvas"
        tabIndex={0}
        aria-label={`Explore ${realm.realmName} using arrow keys, WASD, or by clicking the terrain`}
        onPointerDown={travelToPointer}
      />

      <div className="realm-touch-controls" aria-label="Movement controls">
        <button
          type="button"
          aria-label="Move up"
          className="realm-touch-controls__up"
          onPointerDown={setVirtualDirection(0, -1)}
          onPointerUp={stopVirtualDirection}
          onPointerCancel={stopVirtualDirection}
          onPointerLeave={stopVirtualDirection}
        ><FiArrowUp aria-hidden="true" /></button>
        <button
          type="button"
          aria-label="Move left"
          className="realm-touch-controls__left"
          onPointerDown={setVirtualDirection(-1, 0)}
          onPointerUp={stopVirtualDirection}
          onPointerCancel={stopVirtualDirection}
          onPointerLeave={stopVirtualDirection}
        ><FiArrowLeft aria-hidden="true" /></button>
        <button
          type="button"
          aria-label="Move right"
          className="realm-touch-controls__right"
          onPointerDown={setVirtualDirection(1, 0)}
          onPointerUp={stopVirtualDirection}
          onPointerCancel={stopVirtualDirection}
          onPointerLeave={stopVirtualDirection}
        ><FiArrowRight aria-hidden="true" /></button>
        <button
          type="button"
          aria-label="Move down"
          className="realm-touch-controls__down"
          onPointerDown={setVirtualDirection(0, 1)}
          onPointerUp={stopVirtualDirection}
          onPointerCancel={stopVirtualDirection}
          onPointerLeave={stopVirtualDirection}
        ><FiArrowDown aria-hidden="true" /></button>
      </div>

      <button
        type="button"
        className="realm-interact-button"
        disabled={!nearby}
        onClick={() => nearby && onOpenLandmark(nearby)}
      >
        <FiCornerDownRight aria-hidden="true" />
        {nearby ? `Open ${nearby.monument}` : 'Move closer to a beacon'}
      </button>
    </div>
  );
};

export default RealmCanvas;
