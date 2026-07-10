import { useEffect, useRef, useState } from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';

interface AmbienceToggleProps {
  src: string;
  label: string;
  className?: string;
}

const AmbienceToggle = ({ src, label, className = '' }: AmbienceToggleProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;

    if (enabled) {
      audio.src = src;
      audio.load();
      void audio.play().catch(() => setEnabled(false));
    } else {
      audio.removeAttribute('src');
    }
  }, [enabled, src]);

  return (
    <div className={`ambience-control ${className}`.trim()}>
      <audio ref={audioRef} loop preload="none" />
      <button
        type="button"
        className="ambience-toggle"
        aria-pressed={enabled}
        aria-label={`${enabled ? 'Mute' : 'Play'} ambience: ${label}`}
        onClick={() => setEnabled((current) => !current)}
      >
        {enabled ? <FiVolume2 aria-hidden="true" /> : <FiVolumeX aria-hidden="true" />}
        <span>{enabled ? 'Ambience on' : 'Ambience off'}</span>
      </button>
      <span className="ambience-label" aria-hidden="true">{label}</span>
    </div>
  );
};

export default AmbienceToggle;
