import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [prompt, setPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (sessionStorage.getItem('pwa-dismissed')) return;

    // iOS detection
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);
    if (ios) { setShowBanner(true); return; }

    // Android/Chrome install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
      setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setShowBanner(false);
    setPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setIsDismissed(true);
    sessionStorage.setItem('pwa-dismissed', '1');
  };

  if (!showBanner || isDismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-lg rounded-2xl border border-white/20 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 p-4 flex items-center gap-4">
        <img src="/icons/icon-72.png" alt="Permit Pilot" className="w-12 h-12 rounded-xl shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm">Add Permit Pilot to Home Screen</p>
          {isIOS ? (
            <p className="text-xs text-slate-400 mt-0.5">
              Tap <span className="text-cyan-400">Share</span> then <span className="text-cyan-400">Add to Home Screen</span>
            </p>
          ) : (
            <p className="text-xs text-slate-400 mt-0.5">Get quick access from your home screen</p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          {!isIOS && (
            <button onClick={handleInstall}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-sm font-medium hover:bg-cyan-400">
              Install
            </button>
          )}
          <button onClick={handleDismiss}
            className="px-3 py-1.5 rounded-lg bg-white/10 text-slate-300 text-sm hover:bg-white/20">
            {isIOS ? 'Got it' : 'Later'}
          </button>
        </div>
      </div>
    </div>
  );
}
