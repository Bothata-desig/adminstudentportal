
import React, { useState } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Student, UserRole } from '../types';

interface DashboardProps {
  role: UserRole;
  students: Student[];
  onLinkChild?: (code: string) => boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ role, students, onLinkChild }) => {
  const [selectedStudentIdx, setSelectedStudentIdx] = useState(0);
  const [linkCode, setLinkCode] = useState('');
  const [linkError, setLinkError] = useState(false);
  
  const isParent = role === UserRole.PARENT;

  if (isParent && students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
        <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center max-w-lg">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
            ?
          </div>
          <h3 className="text-2xl font-outfit font-bold text-slate-800 mb-4">Link Your Child's Profile</h3>
          <p className="text-slate-500 mb-8 font-medium">
            Please enter the Unique Student ID provided by your child's teacher to access their academic performance data.
          </p>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Unique ID (e.g. LMT-1234)"
              value={linkCode}
              onChange={(e) => {
                setLinkCode(e.target.value.toUpperCase());
                setLinkError(false);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-center font-black tracking-widest text-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {linkError && <p className="text-red-500 text-xs font-bold uppercase">Invalid ID. Please check and try again.</p>}
            <button 
              onClick={() => {
                if (onLinkChild && onLinkChild(linkCode)) {
                  setLinkError(false);
                } else {
                  setLinkError(true);
                }
              }}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
            >
              Connect Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
        <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center max-w-md">
          <h3 className="text-2xl font-outfit font-bold text-slate-800 mb-4">No Data Available</h3>
          <p className="text-slate-500 mb-8 font-medium">
            Please add students in the 'Students' tab to start tracking their performance.
          </p>
        </div>
      </div>
    );
  }

  const activeStudent = students[selectedStudentIdx] || students[0];

  // Stats calculation
  const personalAvg = activeStudent.subjects.length > 0 
    ? Math.round(activeStudent.subjects.reduce((acc, s) => acc + (s.score * s.weight), 0) / activeStudent.subjects.reduce((acc, s) => acc + s.weight, 0))
    : 0;

  const cohortAvgAttendance = Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length);
  
  const topStudent = [...students].sort((a, b) => {
    const aAvg = a.subjects.length > 0 ? a.subjects.reduce((acc, s) => acc + (s.score * s.weight), 0) / a.subjects.reduce((acc, s) => acc + s.weight, 0) : 0;
    const bAvg = b.subjects.length > 0 ? b.subjects.reduce((acc, s) => acc + (s.score * s.weight), 0) / b.subjects.reduce((acc, s) => acc + s.weight, 0) : 0;
    return bAvg - aAvg;
  })[0];

  const kpiData = isParent 
    ? [
        { label: 'Current Average', value: personalAvg, unit: '%' },
        { label: 'Attendance', value: activeStudent.attendance, unit: '%' },
        { label: 'Subjects', value: activeStudent.subjects.length, unit: 'Enrolled' },
        { label: 'Status', value: personalAvg > 70 ? 'Excellent' : personalAvg > 50 ? 'Steady' : 'Support Needed', unit: '' },
      ]
    : [
        { label: 'Total Students', value: students.length, unit: 'Enrolled' },
        { label: 'Avg. Attendance', value: cohortAvgAttendance, unit: '%' },
        { label: 'Lead Student', value: topStudent?.name.split(' ')[0] || 'N/A', unit: 'Top-Rank' },
        { label: 'Data Status', value: 'Sync', unit: 'Active' },
      ];

  const overallPerformance = activeStudent.performance || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="border-b border-slate-200 pb-6 flex justify-between items-end">
        <div>
          <h2 className="text-sm font-bold tracking-wider text-indigo-600 uppercase mb-1">
            {isParent ? 'Student Profile' : 'Overview'}
          </h2>
          <h3 className="text-3xl font-outfit font-bold text-slate-800">
            {isParent ? `${activeStudent.name}'s Progress` : 'Performance Dashboard'}
          </h3>
        </div>
        {!isParent && students.length > 1 && (
          <select 
            value={selectedStudentIdx}
            onChange={(e) => setSelectedStudentIdx(Number(e.target.value))}
            className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
          >
            {students.map((s, idx) => (
              <option key={s.id} value={idx}>{s.name}</option>
            ))}
          </select>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{stat.label}</p>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
              <span className="text-xs font-medium text-slate-400">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-md font-bold text-slate-800">
              Growth Path: {activeStudent.name}
            </h3>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">
              Overall Average: {personalAvg}%
            </span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overallPerformance}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    fontSize: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="averageScore" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorAvg)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-md font-bold text-slate-800 mb-6">Subject Marks</h3>
          {activeStudent.subjects.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No marks recorded yet for this student.</p>
          ) : (
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {activeStudent.subjects.map((sub, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-semibold text-slate-600">{sub.name}</span>
                    <span className={`text-sm font-bold ${sub.score < 50 ? 'text-red-500' : 'text-indigo-600'}`}>{sub.score}%</span>
                  </div>
                  <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-slate-100">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${sub.score < 50 ? 'bg-red-400' : 'bg-indigo-500'}`} 
                      style={{ width: `${sub.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
