
import React, { useState, useEffect } from 'react';
import { Student, AnalysisResult, UserRole } from '../types';
import { getLocalStudentAnalysis } from '../services/analysisService';

interface AnalysisProps {
  students: Student[];
  selectedStudentId?: string;
  role: UserRole;
}

const Analysis: React.FC<AnalysisProps> = ({ students, selectedStudentId, role }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [targetId, setTargetId] = useState(selectedStudentId || (students.length > 0 ? students[0].id : ''));

  const isParent = role === UserRole.PARENT;

  useEffect(() => {
    if (selectedStudentId) {
      setTargetId(selectedStudentId);
    } else if (students.length > 0 && !targetId) {
      setTargetId(students[0].id);
    }
  }, [selectedStudentId, students]);

  const handleRunAnalysis = () => {
    const student = students.find(s => s.id === targetId);
    if (!student) return;

    setLoading(true);
    setTimeout(() => {
      const result = getLocalStudentAnalysis(student);
      setAnalysis(result);
      setLoading(false);
    }, 600);
  };

  const student = students.find(s => s.id === targetId);
  const avgScore = student 
    ? Math.round(student.subjects.reduce((acc, s) => acc + (s.score * s.weight), 0) / student.subjects.reduce((acc, s) => acc + s.weight, 0))
    : 0;

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      <header className="flex justify-between items-end border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-sm font-bold tracking-wider text-indigo-600 uppercase mb-1">Learning Insights</h2>
          <h3 className="text-3xl font-outfit font-bold text-slate-800">
            {isParent ? `${student?.name}'s Progress Review` : 'Student Progress Review'}
          </h3>
        </div>
        <div className="flex space-x-3">
          {!isParent && students.length > 1 && (
            <select 
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          )}
          <button 
            onClick={handleRunAnalysis}
            disabled={loading || students.length === 0}
            className={`px-8 py-3 rounded-lg bg-indigo-600 text-white text-sm font-bold transition-all hover:bg-indigo-700 disabled:opacity-50 shadow-md`}
          >
            {loading ? 'Reviewing...' : 'Run Review'}
          </button>
        </div>
      </header>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-4 bg-white rounded-2xl border border-slate-100">
          <div className="w-10 h-10 border-2 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium italic">Analyzing academic data...</p>
        </div>
      )}

      {analysis && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            <div className={`bg-white p-8 rounded-2xl shadow-sm border ${avgScore < 50 ? 'border-red-200' : 'border-slate-100'}`}>
              <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Report for {student?.name}</span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${avgScore < 50 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                  {avgScore < 50 ? 'Needs Attention' : 'Active Status'}
                </span>
              </div>
              
              <div className="space-y-8">
                <section>
                  <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${avgScore < 50 ? 'text-red-600' : 'text-indigo-600'}`}>Summary</h4>
                  <p className="text-slate-700 leading-relaxed text-lg font-medium">
                    {analysis.summary}
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100/50">
                    <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">Key Strengths</h4>
                    <ul className="space-y-2">
                      {analysis.strengths.map((s, i) => (
                        <li key={i} className="text-sm font-medium text-slate-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50/50 p-5 rounded-xl border border-red-100/50">
                    <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-3">Areas for Growth</h4>
                    <ul className="space-y-2">
                      {analysis.weaknesses.map((w, i) => (
                        <li key={i} className="text-sm font-medium text-slate-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <section>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Recommended Learning Path</h4>
                  <div className="space-y-4">
                    {analysis.roadmap.map((step, i) => (
                      <div key={i} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg group hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100">
                        <span className="text-xs font-bold text-indigo-500 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm">Step {i + 1}</span>
                        <span className="text-sm font-semibold text-slate-700">{step}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className={`p-8 rounded-2xl border shadow-xl relative overflow-hidden ${avgScore < 50 ? 'bg-red-600 text-white border-red-500' : 'bg-indigo-600 text-white border-indigo-500'}`}>
              <div className="relative z-10">
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-80">Parent Advisory</h4>
                <p className="text-lg font-outfit font-bold leading-relaxed mb-6">
                  "{analysis.limitBreakerAdvice}"
                </p>
                <div className="pt-6 border-t border-white/20 flex justify-between items-center">
                  <div>
                    <p className="text-[11px] font-bold uppercase opacity-70 mb-1">Projected Goal</p>
                    <p className="text-2xl font-black">{analysis.statisticalProbability}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold uppercase opacity-70 mb-1">Status</p>
                    <p className="text-sm font-black uppercase">
                      {avgScore < 50 ? 'Priority' : avgScore > 80 ? 'Exceptional' : 'Steady'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px] rounded-full -mr-10 -mt-10"></div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h5 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest text-center">Progress Status</h5>
              <div className="flex flex-col items-center space-y-3">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${avgScore < 50 ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : avgScore < 65 ? 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]'}`}>
                   <span className="text-white text-xl font-bold">!</span>
                 </div>
                 <span className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                   {avgScore < 50 ? 'Support Needed' : avgScore < 65 ? 'Neutral' : 'On Track'}
                 </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!analysis && !loading && (
        <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Generate Progress Report</h3>
          <p className="text-slate-500 max-w-sm mx-auto text-sm font-medium leading-relaxed">
            {isParent 
              ? "Click 'Run Review' to generate a detailed progress report and recommendations for your child."
              : "Select a student and click 'Run Review' to generate a detailed audit."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Analysis;
