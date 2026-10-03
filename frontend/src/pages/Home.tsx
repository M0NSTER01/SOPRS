import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  AlertTriangle,
  Smartphone,
  Radio,
  ArrowRight,
  Zap,
  Signal,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import PipelineTelemetry from "@/components/PipelineTelemetry";

/* ─── Intersection Observer hook for scroll-triggered entrances ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}

const Home = () => {
  const navigate = useNavigate();
  const [quickDeviceId, setQuickDeviceId] = useState("");

  // Section visibility for staggered entrances
  const heroVis = useInView(0.1);
  const servicesVis = useInView(0.12);
  const howVis = useInView(0.12);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = quickDeviceId.trim();
    if (!trimmed) {
      toast.error("Please enter a Device ID to search");
      return;
    }
    navigate(`/find-my?device=${encodeURIComponent(trimmed)}`);
  };

  const handleApplyDemoId = (id: string) => {
    setQuickDeviceId(id);
    toast.info(`Selected demo ID: ${id}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      {/* Ambient depth vignette */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-[#080b0e]/50 to-[#080b0e] pointer-events-none"
        aria-hidden="true"
      />

      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <section
        ref={heroVis.ref}
        className="relative pt-16 pb-16 md:pt-24 md:pb-24 z-10 overflow-hidden"
      >
        <div className="bg-circuit-section opacity-20" aria-hidden="true" />
        <div
          className={`container mx-auto px-6 max-w-4xl text-center relative z-10 transition-all duration-700 ease-out ${
            heroVis.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 font-['Outfit'] text-foreground leading-[1.08]">
            Never truly lost. <br />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Even when offline.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            When cellular cuts out and GPS goes dark, our community brings your
            devices home. Locate missing smartphones, hardware, and tags using
            anonymous peer beacons.
          </p>

          {/* ── Device Tracker Console ── */}
          <div className="max-w-2xl mx-auto mb-8 text-left">
            <div className="p-5 sm:p-6 rounded-2xl circuit-card shadow-2xl relative overflow-hidden group/console">
              {/* Shimmer overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/[0.04] via-blue-500/[0.04] to-transparent opacity-0 group-hover/console:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Header Bar */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-border/80 text-[11px] font-mono text-muted-foreground relative z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  <span className="text-foreground font-semibold tracking-wider">
                    DEVICE TRACKER CONSOLE
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">PEER MESH:</span>
                  <span className="text-emerald-400 font-medium">READY</span>
                </div>
              </div>

              {/* Search Form */}
              <form
                onSubmit={handleQuickSearch}
                className="flex flex-col sm:flex-row gap-2.5 relative z-10"
              >
                <div className="relative flex-1">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-muted-foreground pointer-events-none font-mono text-xs">
                    <Search className="w-4 h-4 text-sky-400" />
                    <span className="text-muted-foreground font-semibold">
                      ID //
                    </span>
                  </div>
                  <Input
                    type="text"
                    placeholder="Enter Device ID (e.g. SIH_PROJECT_COBRA)"
                    value={quickDeviceId}
                    onChange={(e) => setQuickDeviceId(e.target.value)}
                    className="pl-16 h-12 bg-background border-border text-foreground font-mono text-sm placeholder:font-sans placeholder:text-muted-foreground/70 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 transition-shadow duration-200"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 px-7 font-semibold bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shrink-0 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_28px_rgba(56,189,248,0.5)] active:scale-[0.97] transition-all duration-200"
                >
                  <span>Track Device</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </form>

              {/* Demo Shortcuts */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-border/60 text-xs relative z-10">
                <div className="flex items-center gap-2 text-muted-foreground font-mono text-[11px]">
                  <span>Try Demo:</span>
                  <button
                    type="button"
                    onClick={() => handleApplyDemoId("SIH_PROJECT_COBRA")}
                    className="px-2 py-0.5 rounded bg-secondary hover:bg-sky-500/10 border border-border hover:border-sky-500/30 text-sky-400 hover:text-sky-300 font-mono transition-all duration-200 font-medium active:scale-[0.97]"
                  >
                    SIH_PROJECT_COBRA
                  </button>
                </div>
                <Link
                  to="/register-device"
                  className="text-sky-400 hover:text-sky-300 hover:underline text-xs flex items-center gap-1 font-medium transition-colors duration-200"
                >
                  <span>Register a new device ID</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/report-lost">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 text-xs font-medium border-border hover:border-amber-500/40 hover:bg-amber-500/[0.06] active:scale-[0.97] transition-all duration-200"
              >
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                Report Lost Device
              </Button>
            </Link>
            <Link to="/find-my">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 text-xs font-medium border-border hover:border-yellow-400/40 hover:bg-yellow-400/[0.06] active:scale-[0.97] transition-all duration-200"
              >
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-yellow-300" />
                Open Live Map
              </Button>
            </Link>
            <Link to="/report-lost-device">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 text-xs font-medium border-border hover:border-emerald-500/40 hover:bg-emerald-500/[0.06] active:scale-[0.97] transition-all duration-200"
              >
                <Radio className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                Report Found Device
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ PIPELINE TELEMETRY ═══════════════════ */}
      <PipelineTelemetry />

      {/* ═══════════════════ CORE SERVICES ═══════════════════ */}
      <section
        ref={servicesVis.ref}
        className="relative py-20 border-t border-border/60 bg-background/50 backdrop-blur-[2px] z-10 overflow-hidden"
      >
        <div className="bg-circuit-section opacity-18" aria-hidden="true" />
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <div
            className={`text-center max-w-xl mx-auto mb-12 transition-all duration-600 ease-out ${
              servicesVis.isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
          >
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 font-['Outfit']">
              What would you like to do?
            </h2>
            <p className="text-muted-foreground text-sm">
              Instant access to core tracking tools.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {/* Card 1: Track */}
            <Link
              to="/find-my"
              className={`group transition-all duration-500 ease-out ${
                servicesVis.isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: servicesVis.isVisible ? "100ms" : "0ms" }}
            >
              <Card className="circuit-card h-full rounded-2xl p-6 relative overflow-hidden">
                {/* Hover gradient wash */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-4 text-yellow-300 group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(250,204,21,0.35)] transition-all duration-200">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-1.5 font-['Outfit'] group-hover:text-yellow-300 transition-colors duration-200">
                    Track My Device
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    View the last confirmed GPS fix, address, and timestamp on
                    an interactive map.
                  </p>
                  <div className="text-xs font-semibold text-yellow-300 flex items-center gap-1 mt-auto">
                    <span>Open map tracker</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
                  </div>
                </div>
              </Card>
            </Link>

            {/* Card 2: Report */}
            <Link
              to="/report-lost"
              className={`group transition-all duration-500 ease-out ${
                servicesVis.isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: servicesVis.isVisible ? "200ms" : "0ms" }}
            >
              <Card className="circuit-card h-full rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400 group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(245,158,11,0.3)] transition-all duration-200">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-1.5 font-['Outfit'] group-hover:text-amber-400 transition-colors duration-200">
                    Report Lost Status
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    Flag your device as missing so community nodes know to
                    listen for its beacon signal.
                  </p>
                  <div className="text-xs font-semibold text-amber-400 flex items-center gap-1 mt-auto">
                    <span>Change device status</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
                  </div>
                </div>
              </Card>
            </Link>

            {/* Card 3: Register */}
            <Link
              to="/register-device"
              className={`group transition-all duration-500 ease-out ${
                servicesVis.isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: servicesVis.isVisible ? "300ms" : "0ms" }}
            >
              <Card className="circuit-card h-full rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(16,185,129,0.3)] transition-all duration-200">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-1.5 font-['Outfit'] group-hover:text-emerald-400 transition-colors duration-200">
                    Register Hardware
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    Add your phone, tablet, or tag to secure its unique
                    identifier before it goes missing.
                  </p>
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-auto">
                    <span>Register device</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section
        ref={howVis.ref}
        className="relative py-20 border-t border-border/60 bg-background/30 backdrop-blur-[2px] z-10 overflow-hidden"
      >
        <div className="bg-circuit-section-alt opacity-18" aria-hidden="true" />
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <div
            className={`text-center max-w-xl mx-auto mb-12 transition-all duration-600 ease-out ${
              howVis.isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
          >
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 font-['Outfit']">
              How the Network Operates
            </h2>
            <p className="text-muted-foreground text-sm">
              Simple, secure, and privacy-respecting device location.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                label: "BROADCAST",
                title: "Beacon Chirp",
                desc: "When a device is offline or marked missing, it broadcasts a low-energy Bluetooth beacon without sharing personal data.",
                icon: <Signal className="w-4 h-4" />,
                accent: "sky",
                delay: 100,
              },
              {
                step: "02",
                label: "RELAY",
                title: "Community Hop",
                desc: "When another community member passes nearby, their device safely detects the beacon and securely uploads the location.",
                icon: <Zap className="w-4 h-4" />,
                accent: "violet",
                delay: 200,
              },
              {
                step: "03",
                label: "LOCATE",
                title: "Owner Lock",
                desc: "Only the registered owner can look up the device's location on their map using their secure device ID.",
                icon: <Lock className="w-4 h-4" />,
                accent: "emerald",
                delay: 300,
              },
            ].map((item) => {
              const accentMap: Record<string, { text: string; bg: string; border: string; glow: string }> = {
                sky: {
                  text: "text-sky-400",
                  bg: "bg-sky-500/10",
                  border: "border-sky-500/20",
                  glow: "group-hover:shadow-[0_0_14px_rgba(56,189,248,0.25)]",
                },
                violet: {
                  text: "text-yellow-300",
                  bg: "bg-yellow-400/10",
                  border: "border-yellow-400/20",
                  glow: "group-hover:shadow-[0_0_14px_rgba(250,204,21,0.3)]",
                },
                emerald: {
                  text: "text-emerald-400",
                  bg: "bg-emerald-500/10",
                  border: "border-emerald-500/20",
                  glow: "group-hover:shadow-[0_0_14px_rgba(16,185,129,0.25)]",
                },
              };
              const a = accentMap[item.accent];

              return (
                <div
                  key={item.step}
                  className={`group p-6 rounded-2xl circuit-card space-y-3 relative overflow-hidden transition-all duration-500 ease-out ${
                    howVis.isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{
                    transitionDelay: howVis.isVisible ? `${item.delay}ms` : "0ms",
                  }}
                >
                  {/* Hover gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-${item.accent}-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                  />
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`text-xs font-mono font-semibold ${a.text}`}>
                        {item.step} // {item.label}
                      </div>
                      <div
                        className={`w-7 h-7 rounded-lg ${a.bg} ${a.border} border flex items-center justify-center ${a.text} group-hover:scale-110 ${a.glow} transition-all duration-200`}
                      >
                        {item.icon}
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground text-base font-['Outfit'] group-hover:text-white transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
