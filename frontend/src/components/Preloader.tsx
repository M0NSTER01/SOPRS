import React, { useState, useEffect } from "react";
import VectorWordmark from "./ui/vector-wordmark";

interface PreloaderProps {
  duration?: number; // total duration in ms (4500ms = 4.5s)
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({
  duration = 4500,
  onComplete,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress counter smoothly hits 100% right before fade-out (at ~3.9s)
    const fadeStartTime = Math.max(0, duration - 600);
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / fadeStartTime) * 100));
      setProgress(pct);
    }, 40);

    // Trigger smooth fade-out 600ms before total duration (at ~3.9s)
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, fadeStartTime);

    // Complete and unmount at exactly duration (4.5s)
    const finishTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#080b0e] text-foreground transition-opacity duration-500 ease-out select-none ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ willChange: "opacity" }}
    >
      {/* Subtle circuit background overlay (under layer) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-15 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.08)_0%,transparent_75%)]" 
      />

      {/* Vector Wordmark WebGL Canvas - Enlarged SPORS */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        <VectorWordmark
          text="SPORS"
          background="#080b0e"
          textColor="#F1F5F9"
          shade="#64748B"
          accent="#38BDF8"
          reach={360}
          speed={55}
          damping={65}
          hoverOnly={true}
          handles={{
            size: 24,
            spread: 18,
            labels: true,
          }}
          font={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 900,
            fontSize: "310px",
            letterSpacing: "-0.02em",
          }}
          style={{
            width: "100%",
            height: "100%",
            minWidth: 0,
            minHeight: 0,
          }}
        />
      </div>

      {/* Top Header */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-auto z-10">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-300 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span className="font-semibold text-sky-400">SPORS</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400">FIND MY DEVICE</span>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsFadingOut(true);
            setTimeout(() => {
              setIsVisible(false);
              if (onComplete) onComplete();
            }, 300);
          }}
          className="text-xs font-mono text-zinc-400 hover:text-white px-3.5 py-1.5 rounded-full border border-zinc-800 hover:border-sky-500/50 bg-zinc-900/80 hover:bg-zinc-800/90 backdrop-blur-md transition-colors duration-150 active:scale-95 flex items-center gap-1.5"
        >
          <span>Skip</span>
          <span className="text-sky-400">&rarr;</span>
        </button>
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-8 left-8 right-8 max-w-md mx-auto flex flex-col gap-2 z-10 pointer-events-none">
        <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
          <span className="tracking-wider text-zinc-400">LOADING</span>
          <span className="tabular-nums font-semibold text-zinc-200">{progress}%</span>
        </div>

        <div className="w-full h-[3px] bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden p-[1px]">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-400 rounded-full transition-[width] duration-100 ease-out shadow-[0_0_12px_rgba(56,189,248,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
