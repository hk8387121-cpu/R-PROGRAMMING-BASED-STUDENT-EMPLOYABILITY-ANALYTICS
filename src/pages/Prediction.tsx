import React, { useState, useEffect } from 'react';
import { BrainCircuit, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

// Recreated Prediction.tsx to fix the mangled TSX tags while removing extracurricular

export default function Prediction() {
  const [formData, setFormData] = useState({
    ssc: '75', hsc: '70', degree: '72', cgpa: '7.8',
    entranceExam: '65', technicalSkill: '80', softSkill: '75',
    internships: '1', liveProjects: '2', workExperience: '0',
    certifications: '1', attendance: '85', backlogs: '0'
  });

  const [prediction, setPrediction] = useState<{ prob: number, status: number } | null>(null);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    // dummy metrics for UI
    setMetrics({
      trainRecords: 4000,
      testRecords: 1000,
      accuracy: 0.885,
      precision: 0.892,
      recall: 0.875,
      f1: 0.883
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate prediction logic
    const cgpa = parseFloat(formData.cgpa);
    const tech = parseInt(formData.technicalSkill);
    const internships = parseInt(formData.internships);
    const backlogs = parseInt(formData.backlogs);
    
    let prob = 0.5;
    if (cgpa > 7.0) prob += 0.2;
    if (tech > 70) prob += 0.2;
    if (internships > 0) prob += 0.1;
    if (backlogs > 0) prob -= 0.3;
    
    prob = Math.max(0.1, Math.min(0.95, prob));
    setPrediction({
      prob,
      status: prob > 0.5 ? 1 : 0
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-2">Placement Prediction Engine</h2>
        <p className="text-slate-500 mb-6">Enter student profile metrics to predict the likelihood of successful campus placement.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handlePredict} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <InputField label="SSC Percentage" name="ssc" value={formData.ssc} onChange={handleChange} min="0" max="100" />
                <InputField label="HSC Percentage" name="hsc" value={formData.hsc} onChange={handleChange} min="0" max="100" />
                <InputField label="Degree Percentage" name="degree" value={formData.degree} onChange={handleChange} min="0" max="100" />
                <InputField label="CGPA" name="cgpa" value={formData.cgpa} onChange={handleChange} min="0" max="10" step="0.1" />
                <InputField label="Entrance Exam Score" name="entranceExam" value={formData.entranceExam} onChange={handleChange} min="0" max="100" />
                <InputField label="Technical Skill Score" name="technicalSkill" value={formData.technicalSkill} onChange={handleChange} min="0" max="100" />
                <InputField label="Soft Skill Score" name="softSkill" value={formData.softSkill} onChange={handleChange} min="0" max="100" />
                <InputField label="Internships" name="internships" value={formData.internships} onChange={handleChange} min="0" max="10" />
                <InputField label="Live Projects" name="liveProjects" value={formData.liveProjects} onChange={handleChange} min="0" max="10" />
                <InputField label="Work Experience (Months)" name="workExperience" value={formData.workExperience} onChange={handleChange} min="0" max="60" />
                <InputField label="Certifications" name="certifications" value={formData.certifications} onChange={handleChange} min="0" max="20" />
                <InputField label="Attendance %" name="attendance" value={formData.attendance} onChange={handleChange} min="0" max="100" />
                <InputField label="Backlogs" name="backlogs" value={formData.backlogs} onChange={handleChange} min="0" max="10" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2">
                <BrainCircuit className="w-5 h-5" /> Predict Placement
              </button>
            </form>
          </div>
          
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Prediction Result</h3>
              {prediction ? (
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold">{(prediction.prob * 100).toFixed(1)}%</div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${
                    prediction.status === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {prediction.status === 1 ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    {prediction.status === 1 ? 'LIKELY TO BE PLACED' : 'UNLIKELY TO BE PLACED'}
                  </div>
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-slate-400">
                  <BrainCircuit className="w-10 h-10 opacity-50 mb-2" />
                  <p className="text-sm">Submit form to predict</p>
                </div>
              )}
            </div>
            
            {metrics && (
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4" /> Model Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200">
                    <div className="text-xs text-slate-500">Accuracy</div>
                    <div className="text-lg font-bold">{(metrics.accuracy * 100).toFixed(1)}%</div>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200">
                    <div className="text-xs text-slate-500">F1 Score</div>
                    <div className="text-lg font-bold">{(metrics.f1 * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, min, max, step = "1" }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <input 
        type="number" name={name} value={value} onChange={onChange} min={min} max={max} step={step} required
        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
