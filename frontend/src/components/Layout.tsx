import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wifi, Shield, MapPin, LogOut, Menu, X, Home as HomeIcon, AlertTriangle, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/LoginDialog";
import { useState, useEffect } from "react";

const Layout = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative selection:bg-blue-500/20 selection:text-blue-300">
      {/* Global Ambient Circuit Trace Background across all pages & sections */}
      <div className="bg-circuit-ambient-global" aria-hidden="true" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#080b0e]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20 gap-4">
            {/* Left: Brand Logo */}
            <div className="flex items-center shrink-0">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(56,189,248,0.4)] group-hover:shadow-[0_0_28px_rgba(56,189,248,0.6)] group-hover:scale-105 transition-all duration-300">
                  <Wifi className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Outfit'] group-hover:text-sky-400 transition-colors">
                    SPORS
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-sky-500/10 border border-sky-500/25 text-sky-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                    NETWORK
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Navigation Links Floating Dock */}
            <div className="hidden lg:flex items-center justify-center shrink-0">
              <div className="flex items-center gap-1 xl:gap-1.5 p-1.5 rounded-full bg-slate-900/90 border border-white/[0.09] shadow-[0_4px_24px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                <Link
                  to="/"
                  className={`flex items-center gap-2 px-3.5 xl:px-4 py-2 rounded-full text-xs xl:text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-200 ${
                    isActive("/")
                      ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold shadow-[0_0_16px_rgba(56,189,248,0.35)] scale-[1.02]"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <HomeIcon className={`w-4 h-4 shrink-0 transition-colors ${isActive("/") ? "text-white" : "text-sky-400"}`} />
                  <span>Home</span>
                </Link>

                <Link
                  to="/report-lost"
                  className={`flex items-center gap-2 px-3.5 xl:px-4 py-2 rounded-full text-xs xl:text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-200 ${
                    isActive("/report-lost")
                      ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold shadow-[0_0_16px_rgba(56,189,248,0.35)] scale-[1.02]"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <AlertTriangle className={`w-4 h-4 shrink-0 transition-colors ${isActive("/report-lost") ? "text-white" : "text-sky-400"}`} />
                  <span>Report Lost</span>
                </Link>

                <Link
                  to="/find-my"
                  className={`flex items-center gap-2 px-3.5 xl:px-4 py-2 rounded-full text-xs xl:text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-200 ${
                    isActive("/find-my")
                      ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold shadow-[0_0_16px_rgba(56,189,248,0.35)] scale-[1.02]"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <MapPin className={`w-4 h-4 shrink-0 transition-colors ${isActive("/find-my") ? "text-white" : "text-sky-400"}`} />
                  <span>Find My Device</span>
                </Link>

                <Link
                  to="/report-lost-device"
                  className={`flex items-center gap-2 px-3.5 xl:px-4 py-2 rounded-full text-xs xl:text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-200 ${
                    isActive("/report-lost-device")
                      ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold shadow-[0_0_16px_rgba(56,189,248,0.35)] scale-[1.02]"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <Search className={`w-4 h-4 shrink-0 transition-colors ${isActive("/report-lost-device") ? "text-white" : "text-sky-400"}`} />
                  <span>Report Found</span>
                </Link>
              </div>
            </div>

            {/* Right: Actions & User Controls */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <div className="hidden lg:flex items-center gap-2.5 shrink-0">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/[0.09] text-xs sm:text-sm shrink-0">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <span className="font-mono text-slate-200 font-semibold shrink-0">{user?.username}</span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/30 text-sky-300 font-bold tracking-wider shrink-0">
                        {user?.role}
                      </span>
                    </div>

                    {(user?.role === "admin" || user?.role === "police") && (
                      <Link to={user.role === "admin" ? "/admin" : "/police"} className="shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 px-3 text-xs font-mono font-semibold rounded-xl border-slate-700/80 hover:border-sky-500/50 hover:bg-slate-800/70 text-slate-200 shrink-0"
                        >
                          Dashboard
                        </Button>
                      </Link>
                    )}

                    <Link to="/register-device" className="hidden xl:inline-flex shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 text-xs font-semibold rounded-xl border-slate-700/80 hover:border-sky-500/50 hover:bg-slate-800/70 text-slate-200 shrink-0"
                      >
                        Register Device
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={logout}
                      className="h-9 px-3 text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors shrink-0"
                    >
                      <LogOut className="w-4 h-4 mr-1.5" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 text-xs font-medium rounded-xl border-slate-700/80 hover:border-sky-500/50 hover:bg-slate-800/70 text-slate-200 transition-all duration-150 shrink-0"
                      >
                        Register
                      </Button>
                    </Link>
                    <LoginDialog
                      triggerClassName="h-9 px-5 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-[0_0_16px_rgba(56,189,248,0.35)] transition-all duration-150 hover:shadow-[0_0_22px_rgba(56,189,248,0.5)] shrink-0"
                    />
                  </>
                )}
              </div>

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                className="lg:hidden w-10 h-10 p-0 rounded-xl border border-white/[0.08] bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 shrink-0"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile menu panel */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-2 p-4 sm:p-5 rounded-2xl bg-[#0a0e14]/95 border border-white/[0.09] shadow-2xl backdrop-blur-2xl flex flex-col space-y-3 pb-5 max-h-[calc(100vh-5.5rem)] overflow-y-auto">
              {isAuthenticated && (
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Logged in as</span>
                    <div className="text-sm font-semibold text-white">{user?.username}</div>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-blue-500/20 text-sky-400 font-bold">
                    {user?.role}
                  </span>
                </div>
              )}
              <div className="flex flex-col space-y-2">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive("/") ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold shadow-[0_0_16px_rgba(56,189,248,0.3)]" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <HomeIcon className={`w-4 h-4 ${isActive("/") ? "text-white" : "text-sky-400"}`} />
                  <span>Home</span>
                </Link>

                <Link
                  to="/report-lost"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive("/report-lost") ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold shadow-[0_0_16px_rgba(56,189,248,0.3)]" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <AlertTriangle className={`w-4 h-4 ${isActive("/report-lost") ? "text-white" : "text-sky-400"}`} />
                  <span>Report Lost Device</span>
                </Link>

                <Link
                  to="/find-my"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive("/find-my") ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold shadow-[0_0_16px_rgba(56,189,248,0.3)]" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <MapPin className={`w-4 h-4 ${isActive("/find-my") ? "text-white" : "text-sky-400"}`} />
                  <span>Find My Device</span>
                </Link>

                <Link
                  to="/report-lost-device"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive("/report-lost-device") ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold shadow-[0_0_16px_rgba(56,189,248,0.3)]" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <Search className={`w-4 h-4 ${isActive("/report-lost-device") ? "text-white" : "text-sky-400"}`} />
                  <span>Report Found Device</span>
                </Link>

                {isAuthenticated ? (
                  <div className="pt-2 flex flex-col space-y-2 border-t border-slate-800">
                    <Link to="/register-device" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start text-sm h-11 rounded-xl">
                        Register Device
                      </Button>
                    </Link>
                    {(user?.role === 'admin' || user?.role === 'police') && (
                      <Link to={user.role === 'admin' ? "/admin" : "/police"} onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full justify-start text-sm h-11 rounded-xl">
                          Dashboard
                        </Button>
                      </Link>
                    )}
                    <Button variant="destructive" className="w-full justify-start text-sm h-11 rounded-xl" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </Button>
                  </div>
                ) : (
                  <div className="pt-3 flex flex-col gap-2.5 border-t border-slate-800">
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full h-11 rounded-xl text-sm font-medium">
                        Register
                      </Button>
                    </Link>
                    <div className="w-full [&>button]:w-full [&>button]:h-11 [&>button]:rounded-xl [&>button]:justify-center">
                      <LoginDialog />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative bg-card/60 backdrop-blur-md border-t border-border mt-auto overflow-hidden">
        <div className="bg-circuit-section opacity-15" aria-hidden="true" />
        <div className="container mx-auto px-6 py-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">
                  <Wifi className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-lg text-foreground font-['Outfit']">SPORS</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
                Community-driven device tracking network. Helping people find lost phones and offline items through anonymous peer coordination.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3 font-['Outfit']">Device Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/find-my" className="hover:text-foreground transition-colors duration-150">Track Device</Link></li>
                <li><Link to="/report-lost" className="hover:text-foreground transition-colors duration-150">Report Lost Device</Link></li>
                <li><Link to="/report-lost-device" className="hover:text-foreground transition-colors duration-150">Report Found Device</Link></li>
                <li><Link to="/register-device" className="hover:text-foreground transition-colors duration-150">Register Device ID</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3 font-['Outfit']">Community & Privacy</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                  <span>Privacy-first tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>Encrypted location pings</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Wifi className="w-3.5 h-3.5 text-sky-400" />
                  <span>Community peer relays</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
            <p>
              &copy; {new Date().getFullYear()} SPORS Device Tracking. All rights reserved.
            </p>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                All Systems Operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;