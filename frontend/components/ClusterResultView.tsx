import React, { useState } from 'react';
import { Trophy, Award, Sparkles, Printer, RefreshCw, Bot, ChevronRight, CheckCircle, ExternalLink, Compass } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BoxScore, StudentInfo, LanguageMode } from '../types';
import { CAREER_BOXES } from '../surveyData';
import { generateAICareerAdvice } from '../services/geminiService';

interface ClusterResultViewProps {
  scores: BoxScore[];
  student: StudentInfo;
  languageMode: LanguageMode;
  onResetSurvey: () => void;
}

export const ClusterResultView: React.FC<ClusterResultViewProps> = ({
  scores,
  student,
  languageMode,
  onResetSurvey,
}) => {
  const [aiReport, setAiReport] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Sort scores descending
  const sortedScores = [...scores].sort((a, b) => b.count - a.count);
  const topThree = sortedScores.slice(0, 3);
  const highestScore = Math.max(...scores.map(s => s.count), 1);

  const chartData = sortedScores.map((s, idx) => ({
    name: `Box ${s.boxNumber}`,
    fullName: s.titleEn,
    score: s.count,
    isTopThree: idx < 3 && s.count > 0,
  }));

  const handleGenerateAI = async () => {
    setIsGeneratingAi(true);
    setAiError(null);
    try {
      const report = await generateAICareerAdvice(student, topThree);
      setAiReport(report);
    } catch (err: any) {
      setAiError(err.message || 'Error communicating with AI counselor.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getRankBadge = (rank: number) => {
    if (rank === 0) return { label: '1st Highest', ur: 'پہلا نمبر', color: 'bg-amber-500 text-white' };
    if (rank === 1) return { label: '2nd Highest', ur: 'دوسرا نمبر', color: 'bg-slate-400 text-white' };
    if (rank === 2) return { label: '3rd Highest', ur: 'تیسرا نمبر', color: 'bg-amber-700 text-white' };
    return { label: `#${rank + 1}`, ur: '', color: 'bg-slate-200 text-slate-700' };
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Certificate Header */}
      <div className="bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-orange-500/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-orange-500/40">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>Survey Results & Official Career Ranking</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {student.name ? `${student.name}'s Career Profile` : 'Your Career Clusters Exploration'}
            </h2>
            <p className="font-urdu text-orange-200 text-base sm:text-lg mt-1">
              آپ کے سب سے زیادہ نمبر والے تین کیریئر کلسٹرز جنہیں آپ کو تلاش کرنا چاہیے
            </p>
            {student.school && (
              <p className="text-xs text-slate-300 mt-2">
                School: <span className="font-semibold text-white">{student.school}</span> • Class: <span className="font-semibold text-white">{student.classGrade || 'N/A'}</span> • Date: <span className="font-semibold text-white">{student.date || new Date().toISOString().split('T')[0]}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 no-print">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-white text-slate-900 font-bold px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all shadow-md text-sm"
            >
              <Printer className="w-4 h-4 text-orange-600" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onResetSurvey}
              className="flex items-center gap-2 bg-slate-800 text-slate-300 hover:text-white font-medium px-3 py-2.5 rounded-xl hover:bg-slate-700 transition-all border border-slate-700 text-sm"
              title="Reset All Answers"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 3 Highest Boxes Summary as in Page 10 of OCR */}
      <div className="bg-white rounded-3xl border-2 border-orange-300 p-6 shadow-md">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <div className="inline-block bg-orange-100 text-orange-800 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-2">
            Survey Conclusion (Page 10)
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            My Three Highest Boxes / Clusters to Explore
          </h3>
          <p className="font-urdu text-sm sm:text-base text-slate-600 mt-1">
            میرے سب سے زیادہ نمبر والے تین خانے / جن شعبوں کو میں جاننا چاہتا/چاہتی ہوں
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topThree.map((item, index) => {
            const badge = getRankBadge(index);
            const boxData = CAREER_BOXES.find(b => b.boxNumber === item.boxNumber);
            return (
              <div
                key={item.boxNumber}
                className="relative bg-gradient-to-b from-orange-50/70 to-white rounded-2xl border-2 border-orange-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="font-urdu text-xs font-semibold text-slate-500">
                      {badge.ur}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-orange-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow">
                      {item.boxNumber}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base leading-tight">
                        Cluster {item.boxNumber}: {item.titleEn}
                      </h4>
                      <div className="font-urdu text-xs text-orange-800 font-semibold mt-0.5">
                        {item.titleUr}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-orange-100 my-3">
                    <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
                      <span>Total Circles in Box:</span>
                      <span className="font-extrabold text-orange-600 text-sm">{item.count} / 17</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (item.count / 17) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {boxData && (
                    <div className="space-y-2 text-xs text-slate-700">
                      <p className="line-clamp-2 text-slate-600 italic">
                        "{boxData.descriptionEn}"
                      </p>
                      <div>
                        <span className="font-bold text-slate-900 block mb-1">Key Careers / شعبہ جات:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {boxData.careerExamplesEn.slice(0, 3).map((career, i) => (
                            <span key={i} className="bg-orange-100/80 text-orange-900 text-[11px] px-2 py-0.5 rounded-md font-medium">
                              {career}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-orange-700 font-semibold">
                  <span>Explore Pathways</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900">
            All 16 Career Clusters Score Comparison
          </h3>
          <p className="text-xs text-slate-500 font-urdu">تمام ۱۶ کیریئر کلسٹرز میں حاصل کردہ نمبرات کا موازنہ</p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 17]} tick={{ fontSize: 11 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-lg border border-slate-700">
                        <div className="font-bold text-orange-400">{data.name}: {data.fullName}</div>
                        <div className="text-slate-300 mt-1">Score: <strong className="text-white">{data.score}</strong> items circled</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isTopThree ? '#ea580c' : '#cbd5e1'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 text-xs text-slate-500 mt-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-600 inline-block" />
            <span>Top 3 Recommended Clusters</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
            <span>Other Clusters</span>
          </div>
        </div>
      </div>

      {/* Gemini AI Personalized Counselor Section */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-orange-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span>AI Career Counselor & Educational Roadmap</span>
                <span className="bg-indigo-500 text-white text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full">
                  Gemini 2.5
                </span>
              </h3>
              <p className="font-urdu text-sm text-indigo-200 mt-0.5">
                آپ کے منتخب کردہ شعبوں کے مطابق مصنوعی ذہانت سے جامع تعلیمی و پیشہ ورانہ رہنمائی حاصل کریں
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateAI}
            disabled={isGeneratingAi}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed shrink-0 text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGeneratingAi ? 'Analyzing Profile...' : 'Generate My Career Roadmap'}</span>
          </button>
        </div>

        {aiError && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-200 text-xs p-4 rounded-xl mb-4">
            {aiError}
          </div>
        )}

        {isGeneratingAi && (
          <div className="py-12 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-300">
              Examining Box scores and synthesizing Pakistan & global career pathways...
            </p>
          </div>
        )}

        {aiReport && !isGeneratingAi && (
          <div className="bg-black/30 rounded-2xl p-6 border border-white/10 prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {aiReport}
          </div>
        )}

        {!aiReport && !isGeneratingAi && (
          <div className="bg-white/5 rounded-2xl p-6 text-center text-xs text-slate-400 border border-white/5">
            Click <strong className="text-orange-400">"Generate My Career Roadmap"</strong> above to receive a personalized analysis combining your top 3 clusters with education options (Matric, FSc, A-Levels, BS/MS), industry trends in Pakistan & overseas, and required skills.
          </div>
        )}
      </div>

      {/* Comprehensive 16 Clusters Reference Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Complete Overview of All 16 Career Clusters
        </h3>
        <p className="font-urdu text-xs text-slate-500 mb-6">
          تمام ۱۶ کیریئر کلسٹرز کی فہرست اور تفصیلات
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CAREER_BOXES.map((box) => {
            const scoreItem = scores.find(s => s.boxNumber === box.boxNumber);
            const count = scoreItem?.count || 0;
            const isTop = topThree.some(t => t.boxNumber === box.boxNumber);

            return (
              <div
                key={box.boxNumber}
                className={`p-4 rounded-2xl border transition-all ${
                  isTop
                    ? 'border-orange-500 bg-orange-50/40 shadow-sm ring-1 ring-orange-500'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-lg bg-orange-600 text-white font-bold text-sm flex items-center justify-center">
                    {box.boxNumber}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isTop ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count} circled
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">
                  {box.clusterTitleEn}
                </h4>
                <div className="font-urdu text-xs text-slate-600 mt-1 line-clamp-1">
                  {box.clusterTitleUr}
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                  <strong className="text-slate-700">Top Paths:</strong> {box.careerExamplesEn.slice(0, 2).join(', ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
