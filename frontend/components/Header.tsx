import React from 'react';
import { Mail, Phone, Linkedin, Compass, Sparkles, BookOpen } from 'lucide-react';
import { LanguageMode } from '../types';

interface HeaderProps {
  languageMode: LanguageMode;
  onLanguageChange: (mode: LanguageMode) => void;
  activeTab: 'survey' | 'overview' | 'results';
  setActiveTab: (tab: 'survey' | 'overview' | 'results') => void;
  totalAnswered: number;
}

export const Header: React.FC<HeaderProps> = ({
  languageMode,
  onLanguageChange,
  activeTab,
  setActiveTab,
  totalAnswered
}) => {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 text-white shadow-xl sticky top-0 z-40 border-b border-orange-500/30">
      {/* Creator Attribution Bar */}
      <div className="bg-black/40 border-b border-white/10 px-4 py-2 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center bg-orange-500/20 text-orange-300 font-medium px-2 py-0.5 rounded-full border border-orange-500/40 text-[11px] uppercase tracking-wider">
              Tool Creator & Developer
            </span>
            <span className="font-semibold text-slate-100 flex items-center gap-1.5">
              <span>Areeb Minhaj</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <a 
              href="mailto:areeb.minhaj@gmaill.com" 
              className="flex items-center gap-1.5 hover:text-orange-400 transition-colors"
              title="Email Areeb Minhaj"
            >
              <Mail className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">areeb.minhaj@gmaill.com</span>
              <span className="sm:hidden">Email</span>
            </a>

            <a 
              href="https://wa.me/923049778317" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
              title="Chat on WhatsApp"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+92 304 9778317</span>
            </a>

            <a 
              href="https://www.linkedin.com/in/areebminhaj" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-sky-400 transition-colors font-medium text-sky-300"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn Profile</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main App Title & Nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/30 ring-2 ring-white/20 shrink-0">
              <Compass className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white">
                  Career Clusters Interest Survey
                </h1>
                <span className="bg-orange-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full uppercase">
                  16 Clusters
                </span>
              </div>
              <p className="text-orange-200/90 font-urdu text-sm sm:text-base leading-relaxed">
                کیریئر کلسٹرز دلچسپی سروے — اپنے مستقبل اور کیریئر کی درست رہنمائی حاصل کریں
              </p>
            </div>
          </div>

          {/* Controls: Language & Tab Switcher */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="bg-slate-800/90 p-1 rounded-lg border border-slate-700 flex items-center text-xs">
              <button
                onClick={() => onLanguageChange('bilingual')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  languageMode === 'bilingual' ? 'bg-orange-500 text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                Bilingual / دونوں
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 rounded font-medium transition-all ${
                  languageMode === 'en' ? 'bg-orange-500 text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('ur')}
                className={`px-2.5 py-1 rounded font-urdu text-xs font-semibold transition-all ${
                  languageMode === 'ur' ? 'bg-orange-500 text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                اردو
              </button>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center bg-slate-800/90 p-1 rounded-lg border border-slate-700 text-xs sm:text-sm">
              <button
                onClick={() => setActiveTab('survey')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                  activeTab === 'survey' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Survey (1-16)</span>
              </button>
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                  activeTab === 'overview' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>Grid View</span>
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all relative ${
                  activeTab === 'results' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Results & Top 3</span>
                {totalAnswered > 0 && (
                  <span className="bg-amber-400 text-slate-900 text-[10px] font-black rounded-full px-1.5 py-0.5">
                    {totalAnswered}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
