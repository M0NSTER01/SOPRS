import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Wifi,
  Cpu,
  Radio,
  Bluetooth,
  MapPin,
  Shield,
  Pause,
  ChevronLeft,
  ChevronRight,
  Radar,
  ArrowRight,
  Smartphone,
  Lock,
  Eye,
} from "lucide-react";

/* ─── Per-stage accent palette ─── */
const STAGE_ACCENTS = [
  { bead: "#38bdf8", glow: "rgba(56,189,248,0.35)", glowSoft: "rgba(56,189,248,0.25)", border: "border-sky-400", borderSoft: "border-sky-400/80", bg: "bg-sky-950/40", borderProgress: "border-sky-500/60", dot: "bg-sky-400", dotShadow: "shadow-[0_0_10px_#38bdf8]", dotSmall: "shadow-[0_0_6px_#38bdf8]", text: "text-sky-400", categoryText: "text-sky-400", shadow: "shadow-[0_0_24px_rgba(56,189,248,0.35)]", cardShadow: "shadow-[0_0_20px_rgba(56,189,248,0.25)]", ctaText: "text-sky-400", ctaBorder: "border-sky-500/60", ctaHover: "hover:text-sky-300" },
  { bead: "#a78bfa", glow: "rgba(167,139,250,0.35)", glowSoft: "rgba(167,139,250,0.25)", border: "border-violet-400", borderSoft: "border-violet-400/80", bg: "bg-violet-950/40", borderProgress: "border-violet-500/60", dot: "bg-violet-400", dotShadow: "shadow-[0_0_10px_#a78bfa]", dotSmall: "shadow-[0_0_6px_#a78bfa]", text: "text-violet-400", categoryText: "text-violet-400", shadow: "shadow-[0_0_24px_rgba(167,139,250,0.35)]", cardShadow: "shadow-[0_0_20px_rgba(167,139,250,0.25)]", ctaText: "text-violet-400", ctaBorder: "border-violet-500/60", ctaHover: "hover:text-violet-300" },
  { bead: "#34d399", glow: "rgba(52,211,153,0.35)", glowSoft: "rgba(52,211,153,0.25)", border: "border-emerald-400", borderSoft: "border-emerald-400/80", bg: "bg-emerald-950/40", borderProgress: "border-emerald-500/60", dot: "bg-emerald-400", dotShadow: "shadow-[0_0_10px_#34d399]", dotSmall: "shadow-[0_0_6px_#34d399]", text: "text-emerald-400", categoryText: "text-emerald-400", shadow: "shadow-[0_0_24px_rgba(52,211,153,0.35)]", cardShadow: "shadow-[0_0_20px_rgba(52,211,153,0.25)]", ctaText: "text-emerald-400", ctaBorder: "border-emerald-500/60", ctaHover: "hover:text-emerald-300" },
];

/* ─────────────── Stage Data (Project-specific) ─────────────── */
interface StageData {
  id: number;
  stageName: string;
  category: string;
  titleTop: string;
  titleMain: string;
  description: string;
  leftCard: {
    icon1: React.ReactNode;
    icon2: React.ReactNode;
    title: string;
    subtitle: string;
  };
  rightSlot: {
    icon1: React.ReactNode;
    icon2: React.ReactNode;
    title: string;
    slotDesc: string;
  };
  drawer: {
    label: string;
    title: string;
    actionText: string;
    linkTo: string;
  };
}

const STAGES: StageData[] = [
  {
    id: 0,
    stageName: "1. BEACON BROADCAST",
    category: "LOW-ENERGY DEVICE CHIRP",
    titleTop: "DEVICE BEACON",
    titleMain: "BROADCAST ENGINE",
    description:
      "When your device goes offline or is marked lost, it emits an encrypted Bluetooth Low Energy chirp — a unique beacon pulse that carries no personal data.",
    leftCard: {
      icon1: <Bluetooth className="w-4 h-4 text-sky-400" />,
      icon2: <Radio className="w-4 h-4 text-slate-400" />,
      title: "BLE BEACON CHIRP",
      subtitle: "ENCRYPTED SIGNAL BURST",
    },
    rightSlot: {
      icon1: <Radar className="w-3.5 h-3.5" />,
      icon2: <Wifi className="w-3.5 h-3.5" />,
      title: "SIGNAL DETECTION",
      slotDesc: "slot 01 • BLE Beacon Captured",
    },
    drawer: {
      label: "SPORS DEVICE TRACKING",
      title: "Beacon Emitted",
      actionText: "REGISTER YOUR DEVICE",
      linkTo: "/register-device",
    },
  },
  {
    id: 1,
    stageName: "2. PEER MESH RELAY",
    category: "COMMUNITY NODE NETWORK",
    titleTop: "ANONYMOUS PEER",
    titleMain: "MESH RELAY",
    description:
      "Nearby community devices passively detect the beacon, encrypt the location stamp, and relay it through the peer mesh — without ever revealing the finder's identity.",
    leftCard: {
      icon1: <Smartphone className="w-4 h-4 text-sky-400" />,
      icon2: <Cpu className="w-4 h-4 text-slate-400" />,
      title: "PEER NODE RELAY",
      subtitle: "COMMUNITY MESH HOP",
    },
    rightSlot: {
      icon1: <MapPin className="w-3.5 h-3.5" />,
      icon2: <Shield className="w-3.5 h-3.5" />,
      title: "LOCATION STAMP",
      slotDesc: "slot 02 • Encrypted GPS Relay",
    },
    drawer: {
      label: "SPORS DEVICE TRACKING",
      title: "Location Relayed",
      actionText: "OPEN LIVE MAP",
      linkTo: "/find-my",
    },
  },
  {
    id: 2,
    stageName: "3. OWNER TRIANGULATION",
    category: "ZERO-KNOWLEDGE LOCATE",
    titleTop: "SECURE OWNER",
    titleMain: "TRIANGULATION",
    description:
      "Only the registered owner can decrypt the location data. Multiple peer sightings converge to triangulate your device's position on a private, encrypted map view.",
    leftCard: {
      icon1: <Lock className="w-4 h-4 text-sky-400" />,
      icon2: <Eye className="w-4 h-4 text-slate-400" />,
      title: "OWNER DECRYPTION",
      subtitle: "PRIVATE KEY UNLOCK",
    },
    rightSlot: {
      icon1: <MapPin className="w-3.5 h-3.5" />,
      icon2: <Radar className="w-3.5 h-3.5" />,
      title: "TRIANGULATED POSITION",
      slotDesc: "slot 03 • Owner-Only Map View",
    },
    drawer: {
      label: "SPORS DEVICE TRACKING",
      title: "Device Located",
      actionText: "TRACK YOUR DEVICE",
      linkTo: "/find-my",
    },
  },
];

/* ───── SVG Path Definitions for the 6 conduit tracks ───── */
const LEFT_PATHS = [
  "M 270 70 L 330 70 L 390 170 L 415 170",
  "M 270 215 L 415 215",
  "M 270 360 L 330 360 L 390 260 L 415 260",
];
const RIGHT_PATHS = [
  "M 685 170 L 710 170 L 770 70 L 830 70",
  "M 685 215 L 830 215",
  "M 685 260 L 710 260 L 770 360 L 830 360",
];

/* ───── Animated Bead Component ───── */
interface BeadProps {
  path: string;
  color: string;
  duration: number;
  delay: number;
  size: number;
}

const AnimatedBead: React.FC<BeadProps> = ({ path, color, duration, delay, size }) => (
  <g>
    {/* Glow circle (larger, blurred) */}
    <circle r={size * 2.5} fill={color} opacity="0.3">
      <animateMotion
        dur={`${duration}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
        path={path}
        rotate="auto"
      />
    </circle>
    {/* Core bead (sharp, bright) */}
    <circle r={size} fill={color}>
      <animateMotion
        dur={`${duration}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
        path={path}
        rotate="auto"
      />
    </circle>
    {/* Inner hot core */}
    <circle r={size * 0.4} fill="white" opacity="0.9">
      <animateMotion
        dur={`${duration}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
        path={path}
        rotate="auto"
      />
    </circle>
  </g>
);

/* ───────────────── Main Component ───────────────── */
export const PipelineTelemetry: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);
  const accent = STAGE_ACCENTS[activeStage];

  // Auto-cycle stages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = STAGES[activeStage];

  const handlePrev = () => {
    setActiveStage((prev) => (prev > 0 ? prev - 1 : STAGES.length - 1));
  };

  const handleNext = () => {
    setActiveStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : 0));
  };

  return (
    <section className="relative py-16 sm:py-20 z-10 overflow-hidden border-t border-border/50 bg-[#080b0e]">
      {/* Circuit Board Under Layer */}
      <div className="bg-circuit-section opacity-20 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Watermark Header */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">
              DEVICE RECOVERY PIPELINE
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-500 tracking-wider">
            SPORS-CORE &nbsp;v1.0 TRACKING ENGINE
          </div>
        </div>

        {/* Main 3-Column Architecture View */}
        <div className="relative">
          {/* ── Desktop SVG Circuit Bus with Animated Beads ── */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 1100 480"
              fill="none"
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="beadGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="trackGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* ── LEFT CONDUITS (Input → Engine) ── */}
              {LEFT_PATHS.map((pathD, idx) => {
                const isActive = activeStage === idx;
                return (
                  <g key={`left-${idx}`} opacity={isActive ? "1" : "0.25"} style={{ transition: "opacity 0.4s ease" }}>
                    {/* Base track rail */}
                    <path d={pathD} stroke="#1e293b" strokeWidth="10" strokeLinecap="round" fill="none" />
                    {/* Dashed track texture */}
                    <path d={pathD} stroke="#334155" strokeWidth="8" strokeDasharray="2 4" fill="none" />
                    {/* Active glow overlay */}
                    {isActive && (
                      <path
                        d={pathD}
                        stroke={accent.bead}
                        strokeWidth="2.5"
                        strokeDasharray="8 8"
                        fill="none"
                        filter="url(#trackGlow)"
                        opacity="0.7"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          from="0"
                          to="-32"
                          dur="1s"
                          repeatCount="indefinite"
                        />
                      </path>
                    )}
                    {/* Junction nodes */}
                    <circle cx={270} cy={idx === 0 ? 70 : idx === 1 ? 215 : 360} r="5" fill={isActive ? accent.bead : "#475569"} />
                    <circle cx={415} cy={idx === 0 ? 170 : idx === 1 ? 215 : 260} r="5" fill={isActive ? accent.bead : "#475569"} />

                    {/* ── ANIMATED BEADS (only on active track) ── */}
                    {isActive && (
                      <>
                        <AnimatedBead path={pathD} color={accent.bead} duration={1.8} delay={0} size={4} />
                        <AnimatedBead path={pathD} color={accent.bead} duration={1.8} delay={0.6} size={3.5} />
                        <AnimatedBead path={pathD} color={accent.bead} duration={1.8} delay={1.2} size={3} />
                      </>
                    )}
                  </g>
                );
              })}

              {/* ── RIGHT CONDUITS (Engine → Output) ── */}
              {RIGHT_PATHS.map((pathD, idx) => {
                const isActive = activeStage === idx;
                return (
                  <g key={`right-${idx}`} opacity={isActive ? "1" : "0.25"} style={{ transition: "opacity 0.4s ease" }}>
                    {/* Base track rail */}
                    <path d={pathD} stroke="#1e293b" strokeWidth="10" strokeLinecap="round" fill="none" />
                    {/* Dashed track texture */}
                    <path d={pathD} stroke="#334155" strokeWidth="8" strokeDasharray="2 4" fill="none" />
                    {/* Active glow overlay */}
                    {isActive && (
                      <path
                        d={pathD}
                        stroke={accent.bead}
                        strokeWidth="2.5"
                        strokeDasharray="8 8"
                        fill="none"
                        filter="url(#trackGlow)"
                        opacity="0.7"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          from="0"
                          to="-32"
                          dur="1s"
                          repeatCount="indefinite"
                        />
                      </path>
                    )}
                    {/* Junction nodes */}
                    <circle cx={685} cy={idx === 0 ? 170 : idx === 1 ? 215 : 260} r="5" fill={isActive ? accent.bead : "#475569"} />
                    <circle cx={830} cy={idx === 0 ? 70 : idx === 1 ? 215 : 360} r="5" fill={isActive ? accent.bead : "#475569"} />

                    {/* ── ANIMATED BEADS (only on active track) ── */}
                    {isActive && (
                      <>
                        <AnimatedBead path={pathD} color={accent.bead} duration={1.8} delay={0.15} size={4} />
                        <AnimatedBead path={pathD} color={accent.bead} duration={1.8} delay={0.75} size={3.5} />
                        <AnimatedBead path={pathD} color={accent.bead} duration={1.8} delay={1.35} size={3} />
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* ── Grid Layout: 3 Columns on Desktop ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
            
            {/* ─── Left Column: 3 Input Nodes (lg:col-span-3) ─── */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              {STAGES.map((s, idx) => {
                const isSelected = activeStage === idx;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveStage(idx)}
                    className={`text-left p-4 rounded-2xl transition-all duration-300 cursor-pointer relative active:scale-[0.97] ${
                      isSelected
                        ? `bg-[#0d141f] border-2 ${accent.border} ${accent.shadow} translate-x-1`
                        : "bg-[#0d1218]/95 border border-white/[0.08] hover:border-white/[0.18] opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* Icon Row */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        {s.leftCard.icon1}
                        {s.leftCard.icon2}
                      </div>
                      {/* Glowing Status Dot */}
                      <span
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          isSelected
                            ? `${accent.dot} ${accent.dotShadow} animate-pulse`
                            : "bg-slate-700"
                        }`}
                      />
                    </div>

                    {/* Title & Subtitle */}
                    <h4 className="text-xs sm:text-sm font-bold tracking-tight text-white font-mono">
                      {s.leftCard.title}
                    </h4>
                    <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">
                      {s.leftCard.subtitle}
                    </p>

                    {/* Micro connector bracket on right */}
                    <div
                      className={`hidden lg:block absolute right-[-9px] top-1/2 -translate-y-1/2 w-2 h-4 rounded-r border border-l-0 transition-all duration-300 ${
                        isSelected ? `${accent.border} ${accent.dot}` : "border-slate-700 bg-slate-800"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* ─── Center Column: Core Engine Card (lg:col-span-6) ─── */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="w-full max-w-lg bg-[#0d141e] border border-white/[0.12] rounded-3xl p-6 sm:p-8 shadow-[0_16px_50px_rgba(0,0,0,0.8)] relative overflow-hidden transition-shadow duration-500" style={{ boxShadow: `0 16px 50px rgba(0,0,0,0.8), 0 0 40px ${accent.glowSoft}` }}>
                
                {/* Subtle inner shimmer */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/[0.04] via-transparent to-blue-500/[0.03] pointer-events-none" />
                
                {/* Top Control Bar */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className={`flex items-center gap-1.5 ${accent.text}`}>
                    <Pause className={`w-4 h-4 fill-current ${accent.text}`} />
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center ${accent.text} shadow-inner`}>
                    <Shield className={`w-4 h-4 ${accent.text}`} />
                  </div>
                </div>

                {/* Category Pill */}
                <div className={`text-[11px] font-mono font-bold tracking-wider ${accent.categoryText} uppercase mb-2 relative z-10`}>
                  {current.category}
                </div>

                {/* Main Titles */}
                <h3 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-tight leading-tight relative z-10">
                  <div>{current.titleTop}</div>
                  <div className={accent.text}>{current.titleMain}</div>
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-300 leading-relaxed mt-4 font-normal relative z-10">
                  {current.description}
                </p>

                {/* Step / Pagination Bar */}
                <div className="mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between relative z-10">
                  <div className="flex items-center justify-between w-full bg-slate-900/90 border border-slate-800 rounded-full px-3 py-1.5 shadow-inner">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors active:scale-95"
                      aria-label="Previous step"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <span className="text-xs font-mono font-bold text-slate-200 tracking-wider">
                      {current.stageName}
                    </span>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors active:scale-95"
                      aria-label="Next step"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ─── Bottom Drawer / Suspended Telemetry Card ─── */}
              <div className="w-full max-w-sm flex flex-col items-center mt-[-6px] relative z-20">
                {/* Mounting Hinge Bracket */}
                <div className="w-32 h-2.5 rounded-t-md bg-slate-800/90 border-t border-x border-slate-700" />

                {/* Drawer Body */}
                <div className="w-full bg-[#0a0f16] border border-white/[0.12] rounded-2xl p-5 shadow-[0_12px_30px_rgba(0,0,0,0.7)] text-center relative overflow-hidden group">
                  <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-1">
                    {current.drawer.label}
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-white tracking-tight mb-2.5">
                    {current.drawer.title}
                  </h4>

                  <Link
                    to={current.drawer.linkTo}
                    className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest ${accent.ctaText} ${accent.ctaHover} pb-0.5 border-b-2 ${accent.ctaBorder} transition-colors uppercase`}
                  >
                    <span>{current.drawer.actionText}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ml-1 ${accent.ctaText}`} />
                  </Link>
                </div>
              </div>
            </div>

            {/* ─── Right Column: 3 Output Slots (lg:col-span-3) ─── */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              {STAGES.map((s, idx) => {
                const isSelected = activeStage === idx;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveStage(idx)}
                    className={`text-left p-4 rounded-2xl transition-all duration-300 cursor-pointer relative active:scale-[0.97] ${
                      isSelected
                        ? `bg-[#0d141f] border-2 ${accent.borderSoft} ${accent.cardShadow} -translate-x-1`
                        : "bg-[#0d1218]/95 border border-white/[0.08] hover:border-white/[0.18] opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* Micro connector bracket on left */}
                    <div
                      className={`hidden lg:block absolute left-[-9px] top-1/2 -translate-y-1/2 w-2 h-4 rounded-l border border-r-0 transition-all duration-300 ${
                        isSelected ? `${accent.border} ${accent.dot}` : "border-slate-700 bg-slate-800"
                      }`}
                    />

                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="space-y-0.5">
                        <h4 className="text-xs sm:text-sm font-bold tracking-tight text-white font-mono">
                          {s.rightSlot.title}
                        </h4>
                        <p className="text-[10px] font-mono text-slate-400">
                          {s.rightSlot.slotDesc}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-slate-400">
                        {s.rightSlot.icon1}
                        {s.rightSlot.icon2}
                      </div>
                    </div>

                    {/* Progress / Status Channel with animated fill */}
                    <div
                      className={`w-full h-7 rounded-lg border px-3 flex items-center gap-1.5 transition-all duration-500 relative overflow-hidden ${
                        isSelected
                          ? `${accent.bg} ${accent.borderProgress}`
                          : "bg-slate-900/80 border-slate-800"
                      }`}
                    >
                      {/* Animated fill bar */}
                      {isSelected && (
                        <div
                          className="absolute inset-y-0 left-0 rounded-lg"
                          style={{
                            background: `linear-gradient(to right, ${accent.bead}4D, ${accent.bead}1A)`,
                            animation: "fillBar 2s ease-in-out infinite alternate",
                          }}
                        />
                      )}
                      <div className="flex items-center gap-1.5 ml-auto relative z-10">
                        <span
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            isSelected ? `${accent.dot} ${accent.dotSmall}` : "bg-slate-600"
                          }`}
                        />
                        <span
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            isSelected ? `${accent.dot} ${accent.dotSmall} animate-pulse` : "bg-slate-600"
                          }`}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Keyframes for fill bar animation */}
      <style>{`
        @keyframes fillBar {
          0% { width: 15%; }
          100% { width: 85%; }
        }
      `}</style>
    </section>
  );
};

export default PipelineTelemetry;
