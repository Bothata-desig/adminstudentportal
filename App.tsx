
import React, { useState, useEffect } from 'react';
import { UserRole, User, Student } from './types';
import { MOCK_USERS, MOCK_STUDENTS } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import Analysis from './components/Analysis';
import Tools from './components/Tools';
import DataEntry from './components/DataEntry';

const STORAGE_KEY = 'limitless_student_data';
const USER_LINK_KEY = 'limitless_parent_links';

// Hard-coded access keys for authorization
const ACCESS_KEYS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'admin123',
  [UserRole.TEACHER]: 'teacher123',
  [UserRole.PARENT]: 'parent123',
};

const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Admin',
  [UserRole.TEACHER]: 'Teacher',
  [UserRole.PARENT]: 'Primary Caretaker',
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>(undefined);
  
  // Login flow states
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const [accessKey, setAccessKey] = useState('');
  const [authError, setAuthError] = useState(false);

  // Initialize data from localStorage or fallback to MOCK_STUDENTS
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStudents(parsed.length > 0 ? parsed : MOCK_STUDENTS);
      } catch (e) {
        console.error("Corruption in local storage, reverting to defaults.");
        setStudents(MOCK_STUDENTS);
      }
    } else {
      setStudents(MOCK_STUDENTS);
    }
  }, []);

  // Persist changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pendingRole && accessKey === ACCESS_KEYS[pendingRole]) {
      const foundUser = MOCK_USERS.find(u => u.role === pendingRole) || MOCK_USERS[0];
      const mockUser = { ...foundUser };
      
      if (pendingRole === UserRole.PARENT) {
        const savedLinks = localStorage.getItem(USER_LINK_KEY);
        if (savedLinks) {
          const links = JSON.parse(savedLinks);
          if (links[mockUser.id]) {
            mockUser.studentId = links[mockUser.id];
          }
        }
      }
      
      setUser(mockUser);
      setPendingRole(null);
      setAccessKey('');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
    setSelectedStudentId(undefined);
    setPendingRole(null);
    setAccessKey('');
  };

  const handleLinkChild = (uniqueCode: string) => {
    if (!user || user.role !== UserRole.PARENT) return false;
    
    const foundStudent = students.find(s => s.uniqueCode === uniqueCode);
    if (foundStudent) {
      const updatedUser = { ...user, studentId: foundStudent.id };
      setUser(updatedUser);
      
      const savedLinks = localStorage.getItem(USER_LINK_KEY);
      const links = savedLinks ? JSON.parse(savedLinks) : {};
      links[user.id] = foundStudent.id;
      localStorage.setItem(USER_LINK_KEY, JSON.stringify(links));
      return true;
    }
    return false;
  };

  const handleAddStudent = (name: string, grade: string) => {
    const uniqueCode = `LMT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newStudent: Student = {
      id: `s${Date.now()}`,
      uniqueCode,
      name,
      grade,
      avatar: `https://picsum.photos/seed/${name}/200`,
      attendance: 100,
      performance: [
        { month: 'Jan', averageScore: 0, percentile: 0 },
      ],
      subjects: [],
      comments: []
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const handleUpdatePerformance = (studentId: string, subject: { name: string; score: number; weight: number }) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const existingSubjectIndex = s.subjects.findIndex(sub => sub.name.toLowerCase() === subject.name.toLowerCase());
        const newSubjects = [...s.subjects];
        if (existingSubjectIndex > -1) {
          newSubjects[existingSubjectIndex] = subject;
        } else {
          newSubjects.push(subject);
        }

        const totalWeightedScore = newSubjects.reduce((acc, sub) => acc + (sub.score * sub.weight), 0);
        const totalWeight = newSubjects.reduce((acc, sub) => acc + sub.weight, 0);
        const newAverage = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;

        const newPerformance = [...s.performance];
        const currentMonthIdx = newPerformance.length - 1; 
        if (currentMonthIdx > -1) {
          newPerformance[currentMonthIdx] = { ...newPerformance[currentMonthIdx], averageScore: newAverage };
        }

        return { ...s, subjects: newSubjects, performance: newPerformance };
      }
      return s;
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0c10] p-6 font-inter">
        <div className="max-w-md w-full bg-[#111418] rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-white text-slate-900 flex items-center justify-center rounded-lg mx-auto mb-8 text-2xl font-black shadow-2xl">
              SL
            </div>
            <h1 className="text-2xl font-outfit font-black text-white mb-2 uppercase tracking-tight">SELLO SYSTEM</h1>
            <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-10">Access Authorization Required</p>
            
            {!pendingRole ? (
              <div className="space-y-3">
                <button 
                  onClick={() => setPendingRole(UserRole.ADMIN)}
                  className="w-full py-4 bg-white text-slate-950 text-xs font-black uppercase tracking-widest rounded-lg hover:bg-slate-200 transition-all active:scale-95"
                >
                  Admin
                </button>
                <button 
                  onClick={() => setPendingRole(UserRole.TEACHER)}
                  className="w-full py-4 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-indigo-700 transition-all active:scale-95"
                >
                  Teacher
                </button>
                <button 
                  onClick={() => setPendingRole(UserRole.PARENT)}
                  className="w-full py-4 bg-transparent border border-slate-700 text-slate-300 text-xs font-black uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all active:scale-95"
                >
                  Primary Caretaker
                </button>
              </div>
            ) : (
              <form onSubmit={handleAuthSubmit} className="space-y-4 animate-fadeIn">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Authorizing: {ROLE_DISPLAY_NAMES[pendingRole]}</p>
                <input 
                  type="password"
                  placeholder="Enter Access Key"
                  autoFocus
                  value={accessKey}
                  onChange={(e) => {
                    setAccessKey(e.target.value);
                    setAuthError(false);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-4 text-white text-center tracking-widest focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {authError && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">Invalid Access Key</p>}
                <div className="flex space-x-2 pt-2">
                   <button 
                    type="button"
                    onClick={() => { setPendingRole(null); setAccessKey(''); setAuthError(false); }}
                    className="flex-1 py-3 bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-indigo-500/20"
                  >
                    Confirm Identity
                  </button>
                </div>
                <p className="text-[10px] text-slate-600 font-medium italic mt-4">Hint: Use {ACCESS_KEYS[pendingRole]}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentUser = user as User;

  // Filtered students for Parent role
  const filteredStudents = currentUser.role === UserRole.PARENT
    ? (currentUser.studentId ? students.filter(s => s.id === currentUser.studentId) : [])
    : students;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            role={currentUser.role} 
            students={filteredStudents} 
            onLinkChild={handleLinkChild}
          />
        );
      case 'students':
        return (
          <StudentList 
            students={filteredStudents} 
            onAddStudent={handleAddStudent}
            onSelectStudent={(id) => {
              setSelectedStudentId(id);
              setActiveTab('analysis');
            }} 
          />
        );
      case 'data-entry':
        return (
          <DataEntry 
            students={filteredStudents} 
            onUpdatePerformance={handleUpdatePerformance}
          />
        );
      case 'analysis':
        return (
          <Analysis 
            role={currentUser.role}
            students={filteredStudents} 
            selectedStudentId={selectedStudentId}
          />
        );
      case 'tools':
        return <Tools />;
      default:
        return <Dashboard role={currentUser.role} students={filteredStudents} onLinkChild={handleLinkChild} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-inter">
      <Sidebar 
        role={currentUser.role} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
      />
      
      <main className="ml-72 flex-1 p-12 lg:p-16 pb-32">
        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-4">
            <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded border border-emerald-100">
              Live Secure Channel
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-xs font-black text-slate-900 uppercase tracking-tight leading-tight">{currentUser.name}</p>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">{ROLE_DISPLAY_NAMES[currentUser.role]}</p>
            </div>
            <div className="w-12 h-12 rounded bg-white border border-slate-200 flex items-center justify-center font-black text-slate-900 text-xs shadow-sm">
              {currentUser.name?.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
