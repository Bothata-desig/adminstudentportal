
import React, { useState } from 'react';
import { Student } from '../types';

interface StudentListProps {
  students: Student[];
  onSelectStudent: (id: string) => void;
  onAddStudent: (name: string, grade: string) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onSelectStudent, onAddStudent }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState('10th Grade');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAddStudent(newName, newGrade);
      setNewName('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      <header className="flex justify-between items-end border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-sm font-bold tracking-wider text-indigo-600 uppercase mb-1">Registry</h2>
          <h3 className="text-3xl font-outfit font-bold text-slate-800">Student List</h3>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all shadow-md"
        >
          {showAddForm ? 'Cancel' : 'Add New Student'}
        </button>
      </header>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-indigo-100 shadow-sm animate-fadeIn space-y-4 max-w-2xl">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">New Student Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Student Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
            <select 
              value={newGrade}
              onChange={(e) => setNewGrade(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option>9th Grade</option>
              <option>10th Grade</option>
              <option>11th Grade</option>
              <option>12th Grade</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold text-sm">Save Student</button>
        </form>
      )}

      {students.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-16 text-center shadow-sm">
          <p className="text-slate-500 font-medium">No students registered. Use the button above to add your first student.</p>
        </div>
      ) : (
        <div className="overflow-hidden border border-slate-200 rounded-xl bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Name</th>
                <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Unique Student ID</th>
                <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Grade</th>
                <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overall Avg</th>
                <th className="px-8 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => {
                const avgScore = student.subjects.length > 0 
                  ? Math.round(student.subjects.reduce((acc, s) => acc + s.score, 0) / student.subjects.length)
                  : 0;
                
                return (
                  <tr 
                    key={student.id} 
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() => onSelectStudent(student.id)}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 border border-slate-200 flex items-center justify-center font-bold text-slate-400">
                          {student.name.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-slate-800">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded border border-indigo-100 tracking-widest">{student.uniqueCode}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-semibold text-slate-500">{student.grade}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-slate-800">{avgScore}%</span>
                        <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${avgScore > 75 ? 'bg-emerald-500' : avgScore > 50 ? 'bg-indigo-500' : 'bg-red-500'}`} 
                            style={{ width: `${avgScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-xs font-bold text-indigo-600 group-hover:underline">Review →</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentList;
