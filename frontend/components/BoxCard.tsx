import React from 'react';
import { Check, Sparkles, BookOpen, UserCheck } from 'lucide-react';
import { BoxDefinition, LanguageMode } from '../types';

interface BoxCardProps {
  box: BoxDefinition;
  selectedIds: Set<string>;
  onToggleItem: (id: string) => void;
  languageMode: LanguageMode;
  onClearBox: (boxNumber: number) => void;
  onSelectAllBox: (boxNumber: number) => void;
}

export const BoxCard: React.FC<BoxCardProps> = ({
  box,
  selectedIds,
  onToggleItem,
  languageMode,
  onClearBox,
  onSelectAllBox,
}) => {
  const allItemIds = [
    ...box.activities.map(a => a.id),
    ...box.personalQualities.map(q => q.id),
    ...box.schoolSubjects.map(s => s.id)
  ];

  const totalCircledInBox = allItemIds.filter(id => selectedIds.has(id)).length;
  const totalItems = allItemIds.length;

  const renderItemText = (en: string, ur: string) => {
    if (languageMode === 'en') {
      return <span className="text-slate-800 text-sm font-medium">{en}</span>;
    }
    if (languageMode === 'ur') {
      return <span className="font-urdu text-sm text-slate-900 leading-relaxed text-right block">{ur}</span>;
    }
    return (
      <div className="space-y-1">
        <p className="text-slate-900 text-sm font-semibold">{en}</p>
        <p className="font-urdu text-xs sm:text-sm text-slate-600 leading-relaxed text-right">{ur}</p>
      </div>
    );
  };

  const renderCheckbox = (id: string, indexNumber: number, en: string, ur: string) => {
    const isSelected = selectedIds.has(id);
    return (
      <button
        key={id}
        type="button"
        onClick={() => onToggleItem(id)}
        className={`w-full text-left p-3 rounded-xl border transition-all duration-150 flex items-start gap-3 group ${
          isSelected
            ? 'bg-orange-50/90 border-orange-400 ring-1 ring-orange-400 shadow-sm'
            : 'bg-white border-slate-200/90 hover:border-orange-300 hover:bg-slate-50/80'
        }`}
      >
        <div className="mt-0.5 shrink-0">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-colors border ${
              isSelected
                ? 'bg-orange-600 border-orange-600 text-white shadow-sm'
                : 'border-slate-300 text-slate-500 bg-slate-100 group-hover:border-orange-400 group-hover:text-orange-600'
            }`}
          >
            {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : indexNumber}
          </div>
        </div>

        <div className="flex-1">
          {renderItemText(en, ur)}
        </div>
      </button>
    );
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-orange-400/80 shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
      {/* Box Header Banner mirroring the orange print header */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white text-orange-600 font-black text-xl flex items-center justify-center shadow-md shrink-0 ring-2 ring-white/30">
            {box.boxNumber}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight">Box {box.boxNumber}</span>
              <span className="font-urdu text-lg sm:text-xl font-bold text-orange-100">خانہ {box.boxNumber}</span>
            </div>
            <div className="text-xs sm:text-sm font-medium text-orange-100/90">
              {box.clusterTitleEn} • <span className="font-urdu text-xs">{box.clusterTitleUr}</span>
            </div>
          </div>
        </div>

        {/* Right side Total Circled Box */}
        <div className="flex items-center gap-4 bg-orange-950/40 border border-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wider font-bold text-orange-200">Total Circled</div>
            <div className="font-urdu text-xs text-orange-200">کل دائرے</div>
          </div>
          <div className="w-12 h-10 rounded-lg bg-white text-orange-700 font-extrabold text-2xl flex items-center justify-center shadow-inner">
            {totalCircledInBox}
          </div>
        </div>
      </div>

      {/* Quick Action bar */}
      <div className="bg-orange-50/70 border-b border-orange-200 px-4 py-2 flex items-center justify-between text-xs">
        <span className="text-slate-600">
          Circle all items that best describe you ({totalCircledInBox} of {totalItems} selected)
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectAllBox(box.boxNumber)}
            className="text-orange-700 hover:text-orange-900 font-semibold px-2 py-1 rounded hover:bg-orange-100 transition-colors"
          >
            Select All
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={() => onClearBox(box.boxNumber)}
            className="text-slate-500 hover:text-red-600 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
          >
            Clear Box
          </button>
        </div>
      </div>

      {/* 3 Column Questionnaire Grid */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        {/* Column 1: Activities (7 items) */}
        <div className="space-y-3 pt-4 md:pt-0">
          <div className="pb-2 border-b border-slate-100">
            <h4 className="text-sm font-bold text-orange-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>Activities that describe what I like to do:</span>
            </h4>
            <p className="font-urdu text-xs text-slate-500 text-right mt-0.5">
              وہ کام جو مجھے کرنا پسند ہیں:
            </p>
          </div>
          <div className="space-y-2">
            {box.activities.map((item, idx) => renderCheckbox(item.id, idx + 1, item.en, item.ur))}
          </div>
        </div>

        {/* Column 2: Personal Qualities (5 items) */}
        <div className="space-y-3 pt-6 md:pt-0 md:pl-6">
          <div className="pb-2 border-b border-slate-100">
            <h4 className="text-sm font-bold text-amber-800 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-amber-600" />
              <span>Personal qualities that describe me:</span>
            </h4>
            <p className="font-urdu text-xs text-slate-500 text-right mt-0.5">
              میری ذاتی خوبیاں:
            </p>
          </div>
          <div className="space-y-2">
            {box.personalQualities.map((item, idx) => renderCheckbox(item.id, idx + 1, item.en, item.ur))}
          </div>
        </div>

        {/* Column 3: School Subjects (5 items) */}
        <div className="space-y-3 pt-6 md:pt-0 md:pl-6">
          <div className="pb-2 border-b border-slate-100">
            <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>School subjects that I like:</span>
            </h4>
            <p className="font-urdu text-xs text-slate-500 text-right mt-0.5">
              اسکول کے وہ مضامین جو مجھے پسند ہیں:
            </p>
          </div>
          <div className="space-y-2">
            {box.schoolSubjects.map((item, idx) => renderCheckbox(item.id, idx + 1, item.en, item.ur))}
          </div>
        </div>
      </div>
    </div>
  );
};
