import React, { useEffect, useMemo, useState } from 'react';
import { BrainCircuit, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import { getMappedColumns, isPlaced, parseNumber } from '../utils/dataProcessing';
import { LogisticRegression, standardize, transformWithScaler } from '../utils/prediction';

const MODEL_FEATURES = ['ssc', 'hsc', 'degree', 'cgpa', 'entranceExam', 'technicalSkill', 'softSkill', 'internships', 'liveProjects', 'workExperience', 'certifications', 'attendance', 'backlogs'] as const;
type FeatureKey = typeof MODEL_FEATURES[number];

export default function Prediction() {
  const { processedDataset, columns, isLoadingDefault } = useDataset();
  const mappedCols = useMemo(() => getMappedColumns(columns), [columns]);
  const [model, setModel] = useState<LogisticRegression | null>(null);
  const [scaler, setScaler] = useState<{ means: number[]; stds: number[] } | null>(null);
  const [metrics, setMetrics] = useState<{ train: number; test: number; accuracy: number; precision: number; recall: number; f1: number } | null>(null);
  const [training, setTraining] = useState(true);
  const [prediction, setPrediction] = useState<{ prob: number; status: number } | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Record<FeatureKey, string>>({ ssc: '75', hsc: '70', degree: '72', cgpa: '7.8', entranceExam: '65', technicalSkill: '80', softSkill: '75', internships: '1', liveProjects: '2', workExperience: '0', certifications: '1', attendance: '85', backlogs: '0' });

  useEffect(() => {
    if (!processedDataset.length || !mappedCols.placementStatus) { setTraining(false); return; }
    setTraining(true); setError('');
    const timer = window.setTimeout(() => {
      try {
        const X: number[][] = [], y: number[] = [];
        processedDataset.forEach(row => {
          const values = MODEL_FEATURES.map(key => { const col = mappedCols[key as keyof typeof mappedCols]; return col ? parseNumber(row[col]) : NaN; });
          if (values.every(Number.isFinite)) { X.push(values); y.push(isPlaced(row[mappedCols.placementStatus!]) ? 1 : 0); }
        });
        if (X.length < 20 || new Set(y).size < 2) throw new Error('Not enough complete records with both placement classes for an interactive model.');

        // Deterministic stratified 80/20 split. This browser model is only an
        // interactive validation/estimation layer; R/04_placement_prediction.R
        // remains the authoritative classification pipeline.
        const byClass: Record<number, number[]> = { 0: [], 1: [] };
        y.forEach((value, index) => byClass[value].push(index));
        const testIdx = new Set<number>();
        Object.values(byClass).forEach(indices => indices.forEach((index, position) => { if (position % 5 === 0) testIdx.add(index); }));
        const trainIdx = X.map((_, i) => i).filter(i => !testIdx.has(i));
        const finalTestIdx = X.map((_, i) => i).filter(i => testIdx.has(i));
        if (!finalTestIdx.length || !trainIdx.length) throw new Error('Unable to create a valid train/test split.');

        const XTrainRaw = trainIdx.map(i => X[i]), yTrain = trainIdx.map(i => y[i]);
        const XTestRaw = finalTestIdx.map(i => X[i]), yTest = finalTestIdx.map(i => y[i]);
        const { X_scaled: XTrain, means, stds } = standardize(XTrainRaw);
        const XTest = XTestRaw.map(row => transformWithScaler(row, means, stds));
        const lr = new LogisticRegression(0.05, 1200); lr.train(XTrain, yTrain);

        let correct = 0, tp = 0, fp = 0, fn = 0;
        XTest.forEach((row, i) => { const pred = lr.predict(row), actual = yTest[i]; if (pred === actual) correct++; if (pred === 1 && actual === 1) tp++; if (pred === 1 && actual === 0) fp++; if (pred === 0 && actual === 1) fn++; });
        const precision = tp + fp ? tp / (tp + fp) : 0;
        const recall = tp + fn ? tp / (tp + fn) : 0;
        const f1 = precision + recall ? 2 * precision * recall / (precision + recall) : 0;
        setModel(lr); setScaler({ means, stds }); setMetrics({ train: XTrain.length, test: XTest.length, accuracy: correct / XTest.length, precision, recall, f1 });
      } catch (e: any) { setModel(null); setScaler(null); setMetrics(null); setError(e?.message || 'Unable to train the interactive model.'); }
      finally { setTraining(false); }
    }, 50);
    return () => window.clearTimeout(timer);
  }, [processedDataset, mappedCols]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); setPrediction(null); };
  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault(); if (!model || !scaler) return;
    try { const values = MODEL_FEATURES.map(key => Number(formData[key])); if (!values.every(Number.isFinite)) throw new Error('Please enter valid numeric values.'); const prob = model.predictProb(transformWithScaler(values, scaler.means, scaler.stds)); setPrediction({ prob, status: prob >= 0.5 ? 1 : 0 }); setError(''); }
    catch (e: any) { setPrediction(null); setError(e?.message || 'Prediction failed.'); }
  };

  if (!processedDataset.length) return <div className="flex items-center justify-center h-96 text-slate-500">{isLoadingDefault ? 'Loading dataset...' : 'Please upload a dataset first.'}</div>;
  return (
    <div className="space-y-6"><div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-2">Placement Prediction Engine</h2><p className="text-slate-500 mb-6">Enter student profile metrics to estimate placement likelihood from the loaded dataset.</p>
      {error && <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 px-4 py-3 text-sm">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-2"><form onSubmit={handlePredict} className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <InputField label="SSC Percentage" name="ssc" value={formData.ssc} onChange={handleChange} min="0" max="100" /><InputField label="HSC Percentage" name="hsc" value={formData.hsc} onChange={handleChange} min="0" max="100" /><InputField label="Degree Percentage" name="degree" value={formData.degree} onChange={handleChange} min="0" max="100" /><InputField label="CGPA" name="cgpa" value={formData.cgpa} onChange={handleChange} min="0" max="10" step="0.1" /><InputField label="Entrance Exam Score" name="entranceExam" value={formData.entranceExam} onChange={handleChange} min="0" max="100" /><InputField label="Technical Skill Score" name="technicalSkill" value={formData.technicalSkill} onChange={handleChange} min="0" max="100" /><InputField label="Soft Skill Score" name="softSkill" value={formData.softSkill} onChange={handleChange} min="0" max="100" /><InputField label="Internships" name="internships" value={formData.internships} onChange={handleChange} min="0" max="10" /><InputField label="Live Projects" name="liveProjects" value={formData.liveProjects} onChange={handleChange} min="0" max="10" /><InputField label="Work Experience (Months)" name="workExperience" value={formData.workExperience} onChange={handleChange} min="0" max="60" /><InputField label="Certifications" name="certifications" value={formData.certifications} onChange={handleChange} min="0" max="20" /><InputField label="Attendance %" name="attendance" value={formData.attendance} onChange={handleChange} min="0" max="100" /><InputField label="Backlogs" name="backlogs" value={formData.backlogs} onChange={handleChange} min="0" max="10" />
      </div><button type="submit" disabled={!model || training} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2">{training ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}{training ? 'Training interactive model...' : 'Predict Placement'}</button></form></div>
      <div className="space-y-6"><div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm"><h3 className="text-lg font-bold mb-4">Prediction Result</h3>{prediction ? <div className="text-center space-y-4"><div className="text-4xl font-bold">{(prediction.prob * 100).toFixed(1)}%</div><div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${prediction.status === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{prediction.status === 1 ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}{prediction.status === 1 ? 'LIKELY TO BE PLACED' : 'UNLIKELY TO BE PLACED'}</div><p className="text-xs text-slate-500">Model-based estimate from the currently loaded dataset; not a guarantee.</p></div> : <div className="h-48 flex flex-col items-center justify-center text-slate-400"><BrainCircuit className="w-10 h-10 opacity-50 mb-2" /><p className="text-sm">Submit form to predict</p></div>}</div>
      {metrics && <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm"><h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2 mb-4"><AlertCircle className="w-4 h-4" /> Interactive Validation Metrics</h3><div className="grid grid-cols-2 gap-4"><Metric label="Accuracy" value={metrics.accuracy} /><Metric label="F1 Score" value={metrics.f1} /><Metric label="Precision" value={metrics.precision} /><Metric label="Recall" value={metrics.recall} /></div><p className="text-[11px] text-slate-500 mt-4">Train: {metrics.train.toLocaleString()} · Test: {metrics.test.toLocaleString()}. These values are calculated from the loaded data, not hard-coded.</p></div>}</div></div>
    </div></div>
  );
}
function Metric({ label, value }: { label: string; value: number }) { return <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200"><div className="text-xs text-slate-500">{label}</div><div className="text-lg font-bold">{(value * 100).toFixed(1)}%</div></div>; }
function InputField({ label, name, value, onChange, min, max, step = '1' }: any) { return <div className="space-y-1.5"><label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label><input type="number" name={name} value={value} onChange={onChange} min={min} max={max} step={step} required className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>; }
