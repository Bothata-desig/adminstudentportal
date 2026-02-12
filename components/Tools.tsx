
import React, { useState } from 'react';
import { MOCK_TOOLS } from '../constants';

const Tools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const handleInitialize = (id: string) => {
    setActiveTool(id);
    setTimeout(() => setActiveTool(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="border-b border-slate-200 pb-8">
        <h2 className="text-sm font-bold tracking-wider text-indigo-600 uppercase mb-1">Support Resources</h2>
        <h3 className="text-3xl font-outfit font-bold text-slate-800">Learning Toolkit</h3>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MOCK_TOOLS.map((tool) => (
          <div key={tool.id} className="bg-white border border-slate-100 p-8 rounded-2xl hover:border-indigo-500 transition-all group relative overflow-hidden shadow-sm">
            {activeTool === tool.id && (
              <div className="absolute inset-0 bg-indigo-600/95 flex flex-col items-center justify-center z-10 animate-fadeIn text-white">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mb-3"></div>
                <p className="text-xs font-bold uppercase tracking-widest">Opening Resource...</p>
              </div>
            )}
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase tracking-wider">{tool.category}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                tool.complexity === 'ADVANCED' ? 'text-indigo-600' : 'text-slate-400'
              }`}>{tool.complexity}</span>
            </div>
            <h4 className="text-xl font-outfit font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">{tool.title}</h4>
            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">{tool.description}</p>
            <button 
              onClick={() => handleInitialize(tool.id)}
              className="w-full py-3 bg-slate-50 text-slate-700 text-sm font-bold rounded-xl border border-slate-100 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
              Start Module
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 p-10 rounded-2xl text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full"></div>
        <h4 className="text-xs font-bold tracking-wider text-indigo-400 uppercase mb-4">Coming Soon</h4>
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <p className="text-xl font-outfit font-medium text-slate-300 italic max-w-lg leading-relaxed">
            "We're constantly researching and adding new methods to help students reach their peak performance."
          </p>
          <button className="px-8 py-3 bg-white text-slate-900 text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-lg">
            Suggest a Topic
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tools;
