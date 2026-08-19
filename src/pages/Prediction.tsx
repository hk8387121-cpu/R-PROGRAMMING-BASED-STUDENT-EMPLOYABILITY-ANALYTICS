import React, { useState, useMemo, useEffect } from 'react';
import { useDataset } from '../context/DatasetContext';
import { getMappedColumns, parseNumber, isPlaced } from '../utils/dataProcessing';
import { LogisticRegression, standardize, transformWithScaler } from '../utils/prediction';
import { BrainCircuit, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function Prediction() {
  const { processedDataset, columns, isLoadingDefault } = useDataset();
  const [model, setModel] = useState<LogisticRegression | null>(null);
  const [scaler, setScaler] = useState<{means: number[], stds: number[]} | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  
  const mappedCols = useMemo(() => getMappedColumns(columns), [columns]);

  const [formData, setFormData] = useState({
    ssc: 75,
    hsc: 70,
    degree: 75,
    cgpa: 7.5,
    entranceExam: 70,
    technicalSkill: 75,
    softSkill: 75,
    internships: 1,
    liveProjects: 1,
    workExperience: 0,
    certifications: 1,
    attendance: 80,
    backlogs: 0,
    extracurricular: 1
  });

  const [prediction, setPrediction] = useState<{prob: number, status: number} | null>(null);

  useEffect(() => {
    if (!processedDataset.length || !mappedCols.placementStatus) return;

    // Prepare data
    const X: number[][] = [];
    const y: number[] = [];

    processedDataset.forEach(row => {
      const placed = isPlaced(row[mappedCols.placementStatus!]) ? 1 : 0;
      
      const extracurricular = String(row[mappedCols.extracurricularActivities || '']).toLowerCase() === 'yes' || 
                              parseNumber(row[mappedCols.extracurricularActivities || '']) === 1 ? 1 : 0;
      
      const features = [
        parseNumber(row[mappedCols.ssc || '']),
        parseNumber(row[mappedCols.hsc || '']),
        parseNumber(row[mappedCols.degree || '']),
        parseNumber(row[mappedCols.cgpa || '']),
        parseNumber(row[mappedCols.entranceExam || '']),
        parseNumber(row[mappedCols.technicalSkill || '']),
        parseNumber(row[mappedCols.softSkill || '']),
        parseNumber(row[mappedCols.internships || '']),
        parseNumber(row[mappedCols.liveProjects || '']),
        parseNumber(row[mappedCols.workExperience || '']),
        parseNumber(row[mappedCols.certifications || '']),
        parseNumber(row[mappedCols.attendance || '']),
        parseNumber(row[mappedCols.backlogs || '']),
        extracurricular
      ];

      if (features.every(f => !isNaN(f))) {
        X.push(features);
        y.push(placed);
      }
    });

    if (X.length < 10) return;

    // Train-test split (80-20)
    const splitIdx = Math.floor(X.length * 0.8);
    const X_train_raw = X.slice(0, splitIdx);
    const y_train = y.slice(0, splitIdx);
    const X_test_raw = X.slice(splitIdx);
    const y_test = y.slice(splitIdx);

    const { X_scaled: X_train, means, stds } = standardize(X_train_raw);
    const X_test = X_test_raw.map(row => transformWithScaler(row, means, stds));

    const lr = new LogisticRegression(0.1, 500);
    lr.train(X_train, y_train);

    // Evaluate
    let correct = 0;
    let tp = 0, fp = 0, fn = 0, tn = 0;

    for (let i = 0; i < X_test.length; i++) {
      const pred = lr.predict(X_test[i]);
      const actual = y_test[i];
      if (pred === actual) correct++;
      
      if (pred === 1 && actual === 1) tp++;
      if (pred === 1 && actual === 0) fp++;
      if (pred === 0 && actual === 1) fn++;
      if (pred === 0 && actual === 0) tn++;
    }

    const accuracy = correct / X_test.length;
    const precision = tp / (tp + fp) || 0;
    const recall = tp / (tp + fn) || 0;
    const f1 = 2 * (precision * recall) / (precision + recall) || 0;

    setModel(lr);
    setScaler({ means, stds });
    setMetrics({ 
      accuracy, precision, recall, f1, 
      matrix: [[tn, fp], [fn, tp]],
      trainRecords: X_train.length,
      testRecords: X_test.length
    });
  }, [processedDataset, mappedCols]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: Number(e.target.value) }));
  };

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!model || !scaler) return;

    const inputFeatures = [
      formData.ssc, formData.hsc, formData.degree, formData.cgpa, formData.entranceExam,
      formData.technicalSkill, formData.softSkill, formData.internships, formData.liveProjects,
      formData.workExperience, formData.certifications, formData.attendance, formData.backlogs,
      formData.extracurricular
    ];

    const scaledFeatures = transformWithScaler(inputFeatures, scaler.means, scaler.stds);
    const prob = model.predictProb(scaledFeatures);
    const status = prob >= 0.5 ? 1 : 0;
    
    setPrediction({ prob, status });
  };

  if (!processedDataset.length) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        {isLoadingDefault ? 'Loading dataset...' : 'Please upload a dataset to enable predictions.'}
      </div>
    );
  }

  if (!model) {
    return (
      <div className="flex items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="text-center space-y-4">
          <BrainCircuit className="w-12 h-12 text-indigo-500 mx-auto animate-pulse" />
          <h3 className="text-lg font-bold">Training Prediction Model...</h3>
          <p className="text-sm text-slate-500 max-w-md">The system is currently extracting features and training a logistic regression classifier on the uploaded dataset.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <h2 className="text-2xl font-bold">Placement Prediction Engine</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Student Profile</h3>
          
          <form onSubmit={handlePredict} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <InputField label="SSC Percentage" name="ssc" value={formData.ssc} onChange={handleChange} min={0} max={100} />
              <InputField label="HSC Percentage" name="hsc" value={formData.hsc} onChange={handleChange} min={0} max={100} />
              <InputField label="Degree Percentage" name="degree" value={formData.degree} onChange={handleChange} min={0} max={100} />
              <InputField label="CGPA" name="cgpa" value={formData.cgpa} onChange={handleChange} min={0} max={10} step="0.1" />
              <InputField label="Entrance Exam Score" name="entranceExam" value={formData.entranceExam} onChange={handleChange} min={0} max={100} />
              <InputField label="Technical Skill Score" name="technicalSkill" value={formData.technicalSkill} onChange={handleChange} min={0} max={100} />
              <InputField label="Soft Skill Score" name="softSkill" value={formData.softSkill} onChange={handleChange} min={0} max={100} />
              <InputField label="Internships" name="internships" value={formData.internships} onChange={handleChange} min={0} max={10} />
              <InputField label="Live Projects" name="liveProjects" value={formData.liveProjects} onChange={handleChange} min={0} max={10} />
              <InputField label="Work Experience (Months)" name="workExperience" value={formData.workExperience} onChange={handleChange} min={0} max={60} />
              <InputField label="Certifications" name="certifications" value={formData.certifications} onChange={handleChange} min={0} max={20} />
              <InputField label="Attendance %" name="attendance" value={formData.attendance} onChange={handleChange} min={0} max={100} />
              <InputField label="Backlogs" name="backlogs" value={formData.backlogs} onChange={handleChange} min={0} max={10} />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Extracurricular Activities</label>
                <select 
                  name="extracurricular" 
                  value={formData.extracurricular} 
                  onChange={(e) => setFormData(prev => ({ ...prev, extracurricular: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value={1}>Yes</option>
                  <option value={0}>No</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <BrainCircuit className="w-5 h-5" /> Predict Placement
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">Prediction Result</h3>
            
            {prediction ? (
              <div className="text-center space-y-4 py-4">
                <div className="relative inline-flex items-center justify-center w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" className="text-slate-100 dark:text-slate-800" strokeWidth="12" fill="none" stroke="currentColor" />
                    <circle 
                      cx="64" cy="64" r="56" 
                      className={prediction.status === 1 ? 'text-emerald-500' : 'text-red-500'} 
                      strokeWidth="12" fill="none" stroke="currentColor" 
                      strokeDasharray={351.86} strokeDashoffset={351.86 - (351.86 * prediction.prob)} 
                      strokeLinecap="round" 
                      style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{(prediction.prob * 100).toFixed(1)}%</span>
                  </div>
                </div>

                <div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${
                    prediction.status === 1 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'
                  }`}>
                    {prediction.status === 1 ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    {prediction.status === 1 ? 'LIKELY TO BE PLACED' : 'UNLIKELY TO BE PLACED'}
                  </div>
                </div>
                
                <div className="text-left mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="mb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase">Model Used:</span>
                    <span className="ml-2 text-sm font-medium">Logistic Regression (R-based equivalent)</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1 mb-1"><CheckCircle2 className="w-3 h-3"/> Positive Factors</span>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                        {parseFloat(formData.cgpa) >= 7.5 && <li>Strong CGPA ({formData.cgpa})</li>}
                        {parseInt(formData.internships) >= 2 && <li>Multiple Internships ({formData.internships})</li>}
                        {parseInt(formData.technicalSkill) >= 75 && <li>High Technical Skill ({formData.technicalSkill}%)</li>}
                        {parseInt(formData.softSkill) >= 80 && <li>Excellent Soft Skills ({formData.softSkill}%)</li>}
                        {parseInt(formData.backlogs) === 0 && <li>No Academic Backlogs</li>}
                        {parseFloat(formData.cgpa) < 7.5 && parseInt(formData.internships) < 2 && parseInt(formData.technicalSkill) < 75 && parseInt(formData.backlogs) > 0 && <li>None detected in current profile.</li>}
                      </ul>
                    </div>
                    
                    <div>
                      <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase flex items-center gap-1 mb-1"><XCircle className="w-3 h-3"/> Risk Factors</span>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                        {parseFloat(formData.cgpa) < 7.0 && <li>Low CGPA ({formData.cgpa})</li>}
                        {parseInt(formData.backlogs) > 0 && <li>Active Backlogs ({formData.backlogs})</li>}
                        {parseInt(formData.technicalSkill) < 60 && <li>Low Technical Skill ({formData.technicalSkill}%)</li>}
                        {parseInt(formData.internships) === 0 && <li>No Internship Experience</li>}
                        {parseInt(formData.attendance) < 75 && <li>Low Attendance ({formData.attendance}%)</li>}
                        {parseFloat(formData.cgpa) >= 7.0 && parseInt(formData.backlogs) === 0 && parseInt(formData.technicalSkill) >= 60 && parseInt(formData.internships) > 0 && parseInt(formData.attendance) >= 75 && <li>No major risk factors detected.</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-slate-400 space-y-2">
                <BrainCircuit className="w-10 h-10 opacity-50" />
                <p className="text-sm">Submit the form to predict placement status.</p>
              </div>
            )}
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Model Performance (Test Set)
            </h3>
            
            {metrics && (
              <div className="space-y-4">
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 bg-white dark:bg-slate-800 rounded-lg p-2 border border-slate-200 dark:border-slate-700 text-center">
                    <div className="text-[10px] text-slate-500 uppercase">Training Records</div>
                    <div className="font-bold">{metrics.trainRecords.toLocaleString()}</div>
                  </div>
                  <div className="flex-1 bg-white dark:bg-slate-800 rounded-lg p-2 border border-slate-200 dark:border-slate-700 text-center">
                    <div className="text-[10px] text-slate-500 uppercase">Testing Records</div>
                    <div className="font-bold">{metrics.testRecords.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="text-xs text-slate-500 font-medium">Accuracy</div>
                    <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{(metrics.accuracy * 100).toFixed(1)}%</div>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="text-xs text-slate-500 font-medium">Precision</div>
                    <div className="text-lg font-bold">{(metrics.precision * 100).toFixed(1)}%</div>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="text-xs text-slate-500 font-medium">Recall</div>
                    <div className="text-lg font-bold">{(metrics.recall * 100).toFixed(1)}%</div>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="text-xs text-slate-500 font-medium">F1 Score</div>
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
        type="number" 
        name={name} 
        value={value} 
        onChange={onChange} 
        min={min} 
        max={max} 
        step={step}
        required
        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
      />
    </div>
  );
}
