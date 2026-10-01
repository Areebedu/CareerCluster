import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StudentInfoBar } from './components/StudentInfoBar';
import { BoxCard } from './components/BoxCard';
import { ClusterResultView } from './components/ClusterResultView';
import { CAREER_BOXES } from './surveyData';
import { StudentInfo, LanguageMode, BoxScore } from './types';
import { ArrowLeft, ArrowRight, Sparkles, Info } from 'lucide-react';

const STORAGE_KEY = 'career_survey_v1_selection';
const STUDENT_STORAGE_KEY = 'career_survey_v1_student';

export default function App() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch (e) {
      console.warn(e);
    }
    return new Set<string>();
  });

  const [student, setStudent] = useState<StudentInfo>(() => {
    try {
      const saved = localStorage.getItem(STUDENT_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn(e);
    }
    return {
      name: '',
      school: '',
      classGrade: '',
      date: new Date().toISOString().split('T')[0]
    };
  });

  const [currentBoxIndex, setCurrentBoxIndex] = useState(0);
  const [languageMode, setLanguageMode] = useState<LanguageMode>('bilingual');
  const [activeTab, setActiveTab] = useState<'survey' | 'overview' | 'results'>('survey');

  // Persistence to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(selectedIds)));
    } catch (e) {
      console.warn(e);
    }
  }, [selectedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(student));
    } catch (e) {
      console.warn(e);
    }
  }, [student]);

  const handleToggleItem = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleClearBox = (boxNumber: number) => {
    const targetBox = CAREER_BOXES.find(b => b.boxNumber === boxNumber);
    if (!targetBox) return;
    const boxItemIds = new Set([
      ...targetBox.activities.map(a => a.id),
      ...targetBox.personalQualities.map(q => q.id),
      ...targetBox.schoolSubjects.map(s => s.id)
    ]);
    setSelectedIds(prev => {
      const next = new Set(prev);
      boxItemIds.forEach(id => next.delete(id));
      return next;
    });
  };

  const handleSelectAllBox = (boxNumber: number) => {
    const targetBox = CAREER_BOXES.find(b => b.boxNumber === boxNumber);
    if (!targetBox) return;
    const boxItemIds = [
      ...targetBox.activities.map(a => a.id),
      ...targetBox.personalQualities.map(q => q.id),
      ...targetBox.schoolSubjects.map(s => s.id)
    ];
    setSelectedIds(prev => {
      const next = new Set(prev);
      boxItemIds.forEach(id => next.add(id));
      return next;
    });
  };

  const handleStudentChange = (field: keyof StudentInfo, value: string) => {
    setStudent(prev => ({ ...prev, [field]: value }));
  };

  const handleResetSurvey = () => {
    if (window.confirm("Are you sure you want to reset all survey answers? / کیا آپ تمام جوابات ختم کرنا چاہتے ہیں؟")) {
      setSelectedIds(new Set());
      setActiveTab('survey');
      setCurrentBoxIndex(0);
    }
  };

  // Sample quick presets for testing and demonstration
  const applyPreset = (type: 'tech' | 'medical' | 'arts' | 'business') => {
    const newSelection = new Set<string>();
    if (type === 'tech') {
      CAREER_BOXES.find(b => b.boxNumber === 11)?.activities.forEach(a => newSelection.add(a.id));
      CAREER_BOXES.find(b => b.boxNumber === 11)?.personalQualities.forEach(q => newSelection.add(q.id));
      CAREER_BOXES.find(b => b.boxNumber === 15)?.activities.slice(0, 5).forEach(a => newSelection.add(a.id));
      CAREER_BOXES.find(b => b.boxNumber === 15)?.schoolSubjects.forEach(s => newSelection.add(s.id));
      setStudent(s => ({ ...s, name: s.name || 'Ahmed Raza', classGrade: '10th Matric (Computer Science)' }));
    } else if (type === 'medical') {
      CAREER_BOXES.find(b => b.boxNumber === 8)?.activities.forEach(a => newSelection.add(a.id));
      CAREER_BOXES.find(b => b.boxNumber === 8)?.personalQualities.forEach(q => newSelection.add(q.id));
      CAREER_BOXES.find(b => b.boxNumber === 8)?.schoolSubjects.forEach(s => newSelection.add(s.id));
      CAREER_BOXES.find(b => b.boxNumber === 1)?.activities.slice(0, 4).forEach(a => newSelection.add(a.id));
      setStudent(s => ({ ...s, name: s.name || 'Zainab Noor', classGrade: 'FSc Pre-Medical' }));
    } else if (type === 'arts') {
      CAREER_BOXES.find(b => b.boxNumber === 3)?.activities.forEach(a => newSelection.add(a.id));
      CAREER_BOXES.find(b => b.boxNumber === 3)?.personalQualities.forEach(q => newSelection.add(q.id));
      CAREER_BOXES.find(b => b.boxNumber === 9)?.activities.slice(0, 4).forEach(a => newSelection.add(a.id));
      setStudent(s => ({ ...s, name: s.name || 'Hamza Tariq', classGrade: 'O-Levels Arts & Design' }));
    } else if (type === 'business') {
      CAREER_BOXES.find(b => b.boxNumber === 4)?.activities.forEach(a => newSelection.add(a.id));
      CAREER_BOXES.find(b => b.boxNumber === 6)?.activities.forEach(a => newSelection.add(a.id));
      CAREER_BOXES.find(b => b.boxNumber === 14)?.activities.forEach(a => newSelection.add(a.id));
      setStudent(s => ({ ...s, name: s.name || 'Bilal Khan', classGrade: 'I.Com / Business' }));
    }
    setSelectedIds(newSelection);
  };

  // Calculate scores for each box
  const boxScores: BoxScore[] = CAREER_BOXES.map(box => {
    const allIds = [
      ...box.activities.map(a => a.id),
      ...box.personalQualities.map(q => q.id),
      ...box.schoolSubjects.map(s => s.id)
    ];
    const selectedInBox = allIds.filter(id => selectedIds.has(id));
    return {
      boxNumber: box.boxNumber,
      titleEn: box.clusterTitleEn,
      titleUr: box.clusterTitleUr,
      count: selectedInBox.length,
      selectedIds: selectedInBox,
      percentage: Math.round((selectedInBox.length / allIds.length) * 100)
    };
  });

  const totalCircledCount = selectedIds.size;
  const currentBox = CAREER_BOXES[currentBoxIndex];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        languageMode={languageMode}
        onLanguageChange={setLanguageMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalAnswered={totalCircledCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Student Information bar */}
        <StudentInfoBar
          student={student}
          onChange={handleStudentChange}
          totalCircled={totalCircledCount}
        />

        {/* Survey Instructions Callout */}
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 sm:p-5 mb-6 text-xs sm:text-sm text-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-950">
                Directions: Circle (check) the items in each box that best describe you. You may make as many or as few circles in each box. Look to see which three boxes have the highest numbers.
              </p>
              <p className="font-urdu text-xs sm:text-sm text-amber-900 mt-1 leading-relaxed">
                ہدایات: ہر خانے میں سے وہ باتیں دائرے میں لگائیں جو آپ کو سب سے زیادہ بیان کرتی ہوں۔ ہر خانے میں آپ جتنے چاہیں دائرے لگا سکتے ہیں۔ پھر دیکھیں کہ کن تین خانوں میں سب سے زیادہ نمبر ہیں۔
              </p>
            </div>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">Demo Profiles:</span>
            <button
              onClick={() => applyPreset('tech')}
              className="px-2.5 py-1 text-xs bg-sky-100 hover:bg-sky-200 text-sky-800 font-semibold rounded-lg transition-colors"
            >
              Tech / IT
            </button>
            <button
              onClick={() => applyPreset('medical')}
              className="px-2.5 py-1 text-xs bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold rounded-lg transition-colors"
            >
              Medical
            </button>
            <button
              onClick={() => applyPreset('business')}
              className="px-2.5 py-1 text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold rounded-lg transition-colors"
            >
              Business
            </button>
          </div>
        </div>

        {/* TAB 1: Step-by-step Box Navigation View */}
        {activeTab === 'survey' && (
          <div className="space-y-6">
            {/* Box Navigator Strip 1 to 16 */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
              <div className="flex items-center gap-2 min-w-max pb-1">
                {CAREER_BOXES.map((b, idx) => {
                  const score = boxScores[idx].count;
                  const isCurrent = idx === currentBoxIndex;
                  return (
                    <button
                      key={b.boxNumber}
                      onClick={() => setCurrentBoxIndex(idx)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-orange-600 text-white shadow-md ring-2 ring-orange-400'
                          : score > 0
                          ? 'bg-orange-50 text-orange-900 border border-orange-200 hover:bg-orange-100'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>Box {b.boxNumber}</span>
                      {score > 0 && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          isCurrent ? 'bg-white text-orange-700' : 'bg-orange-500 text-white'
                        }`}>
                          {score}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Box Card */}
            <BoxCard
              box={currentBox}
              selectedIds={selectedIds}
              onToggleItem={handleToggleItem}
              languageMode={languageMode}
              onClearBox={handleClearBox}
              onSelectAllBox={handleSelectAllBox}
            />

            {/* Bottom Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                disabled={currentBoxIndex === 0}
                onClick={() => setCurrentBoxIndex(prev => Math.max(0, prev - 1))}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Box</span>
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500">
                  Box {currentBoxIndex + 1} of 16
                </span>
                {currentBoxIndex === CAREER_BOXES.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab('results')}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-md text-sm transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>View Top 3 Results</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCurrentBoxIndex(prev => Math.min(CAREER_BOXES.length - 1, prev + 1))}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 font-bold text-white shadow-md text-sm transition-all"
                  >
                    <span>Next Box ({currentBoxIndex + 2})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Overview Grid View (All 16 Boxes) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                All 16 Boxes Questionnaire Grid / تمام خانے
              </h3>
              <button
                onClick={() => setActiveTab('results')}
                className="flex items-center gap-2 bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow"
              >
                <Sparkles className="w-4 h-4" />
                <span>Calculate Top Clusters</span>
              </button>
            </div>

            <div className="space-y-10">
              {CAREER_BOXES.map((box) => (
                <BoxCard
                  key={box.boxNumber}
                  box={box}
                  selectedIds={selectedIds}
                  onToggleItem={handleToggleItem}
                  languageMode={languageMode}
                  onClearBox={handleClearBox}
                  onSelectAllBox={handleSelectAllBox}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Results & Top 3 Clusters */}
        {activeTab === 'results' && (
          <ClusterResultView
            scores={boxScores}
            student={student}
            onResetSurvey={handleResetSurvey}
          />
        )}
      </main>

      {/* Footer with Creator Attribution & Note */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-slate-200 font-semibold">
              Career Clusters Interest Survey — Digital Interactive Edition
            </p>
            <p className="text-[11px] text-slate-500 font-urdu leading-relaxed">
              ماخذ: گائیڈنس ڈویژن سروے، اوکلاہوما ڈیپارٹمنٹ آف کیریئر اینڈ ٹیکنالوجی ایجوکیشن (2005)۔ پاکستانی طلبہ کے لیے اردو ترجمہ کے ساتھ۔
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700 text-center">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-orange-400 font-bold block">Developer & Creator</span>
              <span className="font-bold text-white text-sm">Areeb Minhaj</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-slate-700" />
            <div className="flex items-center gap-4 text-slate-300 text-xs">
              <a href="mailto:areeb.minhaj@gmaill.com" className="hover:text-orange-400 transition-colors">
                areeb.minhaj@gmaill.com
              </a>
              <span>•</span>
              <a href="https://wa.me/923049778317" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
                +92 304 9778317
              </a>
              <span>•</span>
              <a href="https://www.linkedin.com/in/areebminhaj" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
