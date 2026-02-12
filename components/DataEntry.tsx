
import React, { useState } from 'react';
import { Student } from '../types';

interface DataEntryProps {
  students: Student[];
  onUpdatePerformance: (studentId: string, subject: { name: string; score: number; weight: number }) => void;
}

const DataEntry: React.FC<DataEntryProps> = ({ students, onUpdatePerformance }) => {
  const [selectedId, setSelectedId] = useState(students[0]?.id || '');
  const [subjectName, setSubjectName] = useState('');
  const [score, setScore] = useState<number | string>('');
  const [weight, setWeight] = useState<number | string>(1.0);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (students.length === 0) {
    return (
      <div className="p-16 bg-white border border-slate-100 rounded-3xl text-center animate-fadeIn shadow-sm max-w-2xl mx-auto mt-20">
        <h3 className="text-xl font-bold text-slate-800 mb-4">No Registered Students</h3>
        <p className="text-slate-500 font-medium">Please add students first in the "Students" tab before entering performance data.</p>
      </div>
    );
  }

  const selectedStudent = students.find(s => s.id === (selectedId || students[0].id)) || students[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const idToUse = selectedId || students[0].id;
    
    if (!subjectName || score === '' || weight === '') {
      setStatusMessage({ text: "Please fill in all fields", type: 'error' });
      return;
    }

    const scoreNum = Number(score);
    const weightNum = Number(weight);

    if (scoreNum < 0 || scoreNum > 100) {
      setStatusMessage({ text: "Score must be between 0 and 100", type: 'error' });
      return;
    }

    onUpdatePerformance(idToUse, {
      name: subjectName,
      score: scoreNum,
      weight: weightNum
    });

    setStatusMessage({ text: "Student progress updated successfully", type: 'success' });
    setSubjectName('');
    setScore('');
    setWeight(1.0);

    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      <header className="border-b border-slate-200 pb-8">
        <h2 className="text-sm font-bold tracking-wider text-indigo-600 uppercase mb-1">Data Management</h2>
        <h3 className="text-3xl font-outfit font-bold text-slate-800">Update Student Records</h3>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Student</label>
                <select 
                  value={selectedId || (students.length > 0 ? students[0].id : '')}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subject Name</label>
                  <input 
                    type="text"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="e.g. Mathematics"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mark Obtained (0-100)</label>
                  <input 
                    type="number"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="85"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Credit Weight</label>
                <input 
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="1.0"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-300"
                />
              </div>

              {statusMessage && (
                <div className={`p-4 rounded-xl text-sm font-bold border transition-all animate-pulse ${
                  statusMessage.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
                }`}>
                  {statusMessage.text}
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-end">
              <button 
                type="submit"
                className="bg-indigo-600 text-white px-10 py-3 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 text-white p-8 rounded-2xl border border-slate-700 shadow-lg">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4">Current Records</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-slate-700 pb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Student Name</span>
                <span className="text-sm font-bold">{selectedStudent.name}</span>
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Existing Marks</span>
                <div className="max-h-48 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                  {selectedStudent.subjects.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No marks recorded.</p>
                  ) : (
                    selectedStudent.subjects.map((s, i) => (
                      <div key={i} className="flex justify-between text-xs font-medium py-1.5 border-b border-slate-700/50">
                        <span className="text-slate-300">{s.name}</span>
                        <span className="text-white font-bold">{s.score}%</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataEntry;
