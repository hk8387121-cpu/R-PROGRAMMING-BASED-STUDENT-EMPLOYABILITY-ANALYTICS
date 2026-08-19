import React, { useState, useMemo } from 'react';
import { useDataset } from '../context/DatasetContext';
import { getMappedColumns, parseNumber, isPlaced } from '../utils/dataProcessing';
import { Search, UserSquare2, Award, Briefcase, GraduationCap, Clock, AlertTriangle } from 'lucide-react';

export default function StudentAnalysis() {
  const { processedDataset, columns, isLoadingDefault } = useDataset();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  const mappedCols = useMemo(() => getMappedColumns(columns), [columns]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mappedCols.studentId) return;

    const student = processedDataset.find(r => 
      String(r[mappedCols.studentId!]).toLowerCase() === searchTerm.toLowerCase()
    );

    setSelectedStudent(student || null);
  };

  if (!processedDataset.length) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        {isLoadingDefault ? 'Loading dataset...' : 'Please upload a dataset first.'}
      </div>
    );
  }

  const renderStudentProfile = () => {
    if (!selectedStudent) return null;

    const cgpa = parseNumber(selectedStudent[mappedCols.cgpa || '']);
    const tech = parseNumber(selectedStudent[mappedCols.technicalSkill || '']);
    const soft = parseNumber(selectedStudent[mappedCols.softSkill || '']);
    const interns = parseNumber(selectedStudent[mappedCols.internships || '']);
    const projects = parseNumber(selectedStudent[mappedCols.liveProjects || '']);
    const attendance = parseNumber(selectedStudent[mappedCols.attendance || '']);
    const backlogs = parseNumber(selectedStudent[mappedCols.backlogs || '']);
    
    // Calculate simple normalized scores (0-100)
    const academicScore = Math.min(100, Math.max(0, (cgpa / 10) * 100));
    const techScore = isNaN(tech) ? 0 : tech;
    const softScore = isNaN(soft) ? 0 : soft;
    const experienceScore = Math.min(100, (interns * 15) + (projects * 10));
    
    const employabilityScore = (academicScore * 0.3) + (techScore * 0.4) + (softScore * 0.15) + (experienceScore * 0.15);

    const recommendations = [];
    if (techScore < 70) recommendations.push("Improve technical skills through practical projects and coding challenges.");
    if (softScore < 70) recommendations.push("Enhance soft skills by participating in group discussions and presentations.");
    if (interns === 0) recommendations.push("Complete at least one internship to gain industry experience.");
    if (backlogs > 0) recommendations.push("Focus on clearing existing backlogs immediately.");
    if (attendance < 75) recommendations.push("Improve attendance to meet academic requirements and show consistency.");
    if (recommendations.length === 0) recommendations.push("Excellent profile! Continue maintaining your current performance.");

    return (
      <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center">
                <UserSquare2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Student ID: {selectedStudent[mappedCols.studentId!]}</h3>
                <p className="text-slate-500 text-sm">
                  {isPlaced(selectedStudent[mappedCols.placementStatus || '']) ? 
                    <span className="text-emerald-600 font-medium">Placed • {selectedStudent[mappedCols.salary || '']} LPA</span> : 
                    <span className="text-amber-600 font-medium">Seeking Placement</span>
                  }
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ProfileStat icon={<GraduationCap />} label="CGPA" value={cgpa} />
              <ProfileStat icon={<Award />} label="Technical" value={tech} suffix="%" />
              <ProfileStat icon={<MessagesSquare />} label="Soft Skills" value={soft} suffix="%" />
              <ProfileStat icon={<Briefcase />} label="Internships" value={interns} />
              <ProfileStat icon={<Code2 />} label="Projects" value={projects} />
              <ProfileStat icon={<AlertTriangle className={backlogs > 0 ? 'text-red-500' : ''} />} label="Backlogs" value={backlogs} />
            </div>
          </div>

          <div className="w-full md:w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-center items-center text-center">
            <h4 className="text-slate-500 font-medium mb-4">Rule-Based Employability Score</h4>
            <div className="relative inline-flex items-center justify-center w-40 h-40 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="72" className="text-slate-100 dark:text-slate-800" strokeWidth="16" fill="none" stroke="currentColor" />
                <circle 
                  cx="80" cy="80" r="72" 
                  className={employabilityScore >= 75 ? 'text-emerald-500' : employabilityScore >= 50 ? 'text-amber-500' : 'text-red-500'} 
                  strokeWidth="16" fill="none" stroke="currentColor" 
                  strokeDasharray={452.39} strokeDashoffset={452.39 - (452.39 * (employabilityScore / 100))} 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold">{employabilityScore.toFixed(0)}</span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 px-4 leading-tight">
              * Note: This is a composite analytical score, NOT a machine-learning placement probability.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Personalized Recommendations</h3>
          <ul className="space-y-3">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                <p>{rec}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      <h2 className="text-2xl font-bold">Student Analysis</h2>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-4 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter Student ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
            Search
          </button>
        </form>
      </div>

      {renderStudentProfile()}
    </div>
  );
}

function ProfileStat({ icon, label, value, suffix = '' }: any) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
      <div className="text-slate-400">
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
      </div>
      <div>
        <div className="text-xs text-slate-500 font-medium">{label}</div>
        <div className="font-bold">{value}{suffix}</div>
      </div>
    </div>
  );
}

// Ensure these imports are available since we used them in the component
import { MessagesSquare, Code2 } from 'lucide-react';
