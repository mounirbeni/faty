import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface VoiceNotePlayerProps {
  src: string;
}

export default function VoiceNotePlayer({ src }: VoiceNotePlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / (audio.duration || 1)) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((e) => console.error("Audio playback failed", e));
    }
    setIsPlaying(!isPlaying);
  };

  // Fake glowing waveform bars
  const bars = Array.from({ length: 30 }).map((_, i) => {
    const height = 20 + Math.sin(i * 0.5) * 10 + Math.cos(i * 0.8) * 15;
    return (
      <div
        key={i}
        className={`w-1 rounded-full transition-all duration-300 ${
          isPlaying ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-white/20'
        }`}
        style={{
          height: `${height}%`,
          opacity: isPlaying ? 0.7 + Math.random() * 0.3 : 0.5,
          transform: isPlaying ? `scaleY(${0.8 + Math.random() * 0.4})` : 'scaleY(1)',
        }}
      />
    );
  });

  return (
    <div className="w-full max-w-sm glass-strong p-4 rounded-3xl flex items-center gap-4 border border-emerald-500/30 shadow-xl shadow-emerald-900/40 relative overflow-hidden">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/40 transition-transform"
      >
        {isPlaying ? (
          <Pause size={20} className="text-white fill-white" />
        ) : (
          <Play size={20} className="text-white fill-white ml-1" />
        )}
      </button>

      {/* Waveform and Progress */}
      <div className="flex-1 flex flex-col justify-center gap-2">
        <div className="flex items-center gap-0.5 h-8">
          {bars}
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-white/10 rounded-full overflow-hidden w-full relative">
          <div
            className="absolute top-0 left-0 h-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
