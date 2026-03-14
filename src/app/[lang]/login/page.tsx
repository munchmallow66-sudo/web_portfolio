"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import dynamic from "next/dynamic";

const ParticleNetwork = dynamic(
  () => import("@/components/ui/ParticleNetwork").then((mod) => mod.ParticleNetwork),
  { ssr: false }
);

export default function LoginPage() {
  const { dict, lang } = useDictionary();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const router = useRouter();

  const fullText = "PORTFOLIO.";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!mounted) return;

    let index = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      if (!isDeleting) {
        index++;
        setDisplayText(fullText.slice(0, index));
        if (index === fullText.length) {
          timeoutId = setTimeout(() => {
            isDeleting = true;
            tick();
          }, 2000);
          return;
        }
        timeoutId = setTimeout(tick, 150);
      } else {
        index--;
        setDisplayText(fullText.slice(0, index));
        if (index === 0) {
          isDeleting = false;
          timeoutId = setTimeout(tick, 800);
          return;
        }
        timeoutId = setTimeout(tick, 80);
      }
    };

    timeoutId = setTimeout(tick, 500);

    return () => clearTimeout(timeoutId);
  }, [mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push(`/${lang}/admin`);
      } else {
        const data = await response.json();
        setError(data.error || dict.login.loginFailed);
      }
    } catch (err) {
      setError(dict.login.networkError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0a0a19" }}>
      {/* Left side - Particle Network Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ParticleNetwork />
        {/* PORTFOLIO. text - centered with typewriter effect */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <h2
            className="text-white text-5xl xl:text-7xl font-extrabold tracking-widest select-none"
            style={{ minWidth: "1ch", textShadow: "0 0 40px rgba(139, 92, 246, 0.5), 0 0 80px rgba(99, 102, 241, 0.3)" }}
          >
            {mounted ? displayText : "PORTFOLIO."}
            <span
              className="inline-block w-[3px] ml-1 align-middle"
              style={{
                height: "1em",
                backgroundColor: "#c4b5fd",
                animation: "cursorBlink 0.8s step-end infinite",
                boxShadow: "0 0 8px rgba(196, 181, 253, 0.8)",
              }}
            />
          </h2>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 relative" style={{ backgroundColor: "#000000" }}>
        <div className="w-full max-w-md">
          {/* Welcome heading */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white tracking-wide">
              Welcome
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                {dict.login.emailLabel}
              </label>
              <input
                id="email"
                type="text"
                placeholder={dict.login.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 border border-purple-500/20 outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/40 transition-all duration-200"
                style={{ backgroundColor: "rgba(139, 92, 246, 0.08)" }}
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                {dict.login.passwordLabel}
              </label>
              <input
                id="password"
                type="password"
                placeholder={dict.login.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 border border-purple-500/20 outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/40 transition-all duration-200"
                style={{ backgroundColor: "rgba(139, 92, 246, 0.08)" }}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* LOGIN button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-full font-semibold text-white text-sm uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #7c3aed 50%, #6366f1 100%)",
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {dict.login.loggingIn}
                  </div>
                ) : (
                  dict.login.loginButton.toUpperCase()
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
