import React, { useEffect, useMemo, useState } from 'react';
import { IndianRupee, TrendingUp, AlertCircle, BarChart2, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDataset } from '../context/DatasetContext';
import { getMappedColumns, parseNumber, isPlaced } from '../utils/dataProcessing';
import { LinearRegression } from '../utils/regression';
import { standardize, transformWithScaler } from '../utils/prediction';

const FEATURE_KEYS = [
  'cgpa', 'technicalSkill', 'softSkill', 'internships', 'liveProjects',
  'workExperience', 'certifications', 'attendance', 'degree', 'hsc', 'ssc'
] as const;
type FeatureKey = typeof FEATURE_KEYS[number];

export default function SalaryAnalysis() {
  const { processedDataset, columns, isLoadingDefault } = useDataset();
  const mappedCols = useMemo(() => getMappedColumns(columns), [columns]);
  const [model, setModel] = useState<LinearRegression | null>(null);
  const [scaler, setScaler] = useState<{ means: number[]; stds: number[] } | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [training, setTraining] = useState(true);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Record<FeatureKey, number>>({
    cgpa: 8.5, technicalSkill: 85, softSkill: 80, internships: 2, liveProjects: 2,
    workExperience: 6, certifications: 2, attendance: 85, degree: 80, hsc: 75, ssc: 80
  });

  useEffect(() => {
    if (!processedDataset.length || !mappedCols.salary) {
      setTraining(false);
      return;
    }
    setTraining(true);
    const timer = window.setTimeout(() => {
      try {
        const X: number[][] = [];
        const y: number[] = [];
        processedDataset.forEach(row => {
          const salary = parseNumber(row[mappedCols.salary!]);
          const features = FEATURE_KEYS.map(key => {
            const col = mappedCols[key as keyof typeof mappedCols];
            return col ? parseNumber(row[col]) : NaN;
          });
          if (isPlaced(mappedCols.placementStatus ? row[mappedCols.placementStatus] : 'Not Placed') && salary > 0 && features.every(Number.isFinite)) {
            X.push(features);
            y.push(salary);
          }
        });
        if (X.length < 30) throw new Error('Not enough complete placed-student salary records for estimation.');

        // Deterministic 80/20 split, matching the R analysis design. The
        // browser model is an interactive validation/estimation layer; the
        // R lm() model in R/05_salary_regression.R is authoritative for the
        // submitted statistical analysis.
        const order = X.map((_, i) => i).sort((a, b) => a - b);
        const split = Math.floor(order.length * 0.8);
        const trainIdx = order.slice(0, split);
        const testIdx = order.slice(split);
        const XTrainRaw = trainIdx.map(i => X[i]);
        const yTrain = trainIdx.map(i => y[i]);
        const XTestRaw = testIdx.map(i => X[i]);
        const yTest = testIdx.map(i => y[i]);
        const { X_scaled: XTrain, means, stds } = standardize(XTrainRaw);
        const XTest = XTestRaw.map(row => transformWithScaler(row, means, stds));
        const lr = new LinearRegression(0.01, 2500);
        lr.train(XTrain, yTrain);

        let mae = 0, mse = 0, ssr = 0;
        const mean = yTest.reduce((a, b) => a + b, 0) / yTest.length;
        let sst = 0;
        XTest.forEach((row, i) => {
          const err = lr.predict(row) - yTest[i];
          mae += Math.abs(err);
          mse += err * err;
          ssr += err * err;
          sst += (yTest[i] - mean) ** 2;
        });
        mae /= yTest.length;
        mse /= yTest.length;
        const r2 = sst > 0 ? 1 - ssr / sst : 0;
        const p = FEATURE_KEYS.length;
        const n = yTest.length;
        const adjustedR2 = n > p + 1 ? 1 - (1 - r2) * (n - 1) / (n - p - 1) : r2;
        setModel(lr);
        setScaler({ means, stds });
        setMetrics({ mae, mse, rmse: Math.sqrt(mse), r2, adjustedR2, trainRecords: XTrain.length, testRecords: XTest.length });
        setError('');
      } catch (e: any) {
        setModel(null);
        setScaler(null);
        setMetrics(null);
        setError(e?.message || 'Unable to train the salary model.');
      } finally {
        setTraining(false);
      }
    }, 50);
    return () => window.clearTimeout(timer);
  }, [processedDataset, mappedCols]);

  const stats = useMemo(() => {
    if (!mappedCols.salary) return null;
    const salaries = processedDataset.map(r => parseNumber(r[mappedCols.salary!])).filter(s => Number.isFinite(s) && s > 0).sort((a, b) => a - b);
    if (!salaries.length) return null;
    return {
      min: salaries[0], max: salaries[salaries.length - 1],
      avg: salaries.reduce((a, b) => a + b, 0) / salaries.length,
      median: salaries.length % 2 ? salaries[Math.floor(salaries.length / 2)] : (salaries[salaries.length / 2 - 1] + salaries[salaries.length / 2]) / 2
    };
  }, [processedDataset, mappedCols]);

  const salaryDistribution = useMemo(() => {
    if (!mappedCols.salary) return [];
    const ranges = [{ label: '< 3', min: 0, max: 3 }, { label: '3-5', min: 3, max: 5 }, { label: '5-7', min: 5, max: 7 }, { label: '7-10', min: 7, max: 10 }, { label: '10-15', min: 10, max: 15 }, { label: '> 15', min: 15, max: Infinity }];
    return ranges.map(({ label, min, max }) => ({ range: label, count: processedDataset.filter(r => { const s = parseNumber(r[mappedCols.salary!]); return s > 0 && s >= min && s < max; }).length }));
  }, [processedDataset, mappedCols]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: Number(e.target.value) }));
    setPrediction(null);
  };

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!model || !scaler) return;
    try {
      const values = FEATURE_KEYS.map(k => formData[k]);
      if (!values.every(Number.isFinite)) throw new Error('Please enter valid numeric values.');
      const pred = Math.max(0, model.predict(transformWithScaler(values, scaler.means, scaler.stds)));
      setPrediction(pred);
      setError('');
    } catch (e: any) {
      setPrediction(null);
      setError(e?.message || 'Salary estimation failed.');
    }
  };

  if (!processedDataset.length) return <div className="flex items-center justify-center h-96 text-slate-500">{isLoadingDefault ? 'Loading dataset...' : 'Please upload a dataset to enable salary analysis.'}</div>;

  return (
    <div className="space-y-6 pb-12">
      <h2 className="text-2xl font-bold">Salary Analysis & Estimation</h2>
      {error && <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-800 px-4 py-3 text-sm">{error}</div>}
      {stats && <div className="grid grid-cols-1 md:grid-cols-4 gap-4"><StatCard title="Average Salary" value={`${stats.avg.toFixed(2)} LPA`} /><StatCard title="Median Salary" value={`${stats.median.toFixed(2)} LPA`} /><StatCard title="Highest Salary" value={`${stats.max.toFixed(2)} LPA`} /><StatCard title="Lowest Salary" value={`${stats.min.toFixed(2)} LPA`} /></div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4"><TrendingUp className="w-5 h-5 text-indigo-500" /><h3 className="text-lg font-bold">Salary Predictor</h3></div>
          <form onSubmit={handlePredict} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <InputField label="CGPA" name="cgpa" value={formData.cgpa} onChange={handleChange} min={0} max={10} step="0.1" />
              <InputField label="Technical Skill Score" name="technicalSkill" value={formData.technicalSkill} onChange={handleChange} min={0} max={100} />
              <InputField label="Soft Skill Score" name="softSkill" value={formData.softSkill} onChange={handleChange} min={0} max={100} />
              <InputField label="Internships" name="internships" value={formData.internships} onChange={handleChange} min={0} max={10} />
              <InputField label="Live Projects" name="liveProjects" value={formData.liveProjects} onChange={handleChange} min={0} max={10} />
              <InputField label="Work Experience (Months)" name="workExperience" value={formData.workExperience} onChange={handleChange} min={0} max={60} />
              <InputField label="Certifications" name="certifications" value={formData.certifications} onChange={handleChange} min={0} max={20} />
              <InputField label="Attendance %" name="attendance" value={formData.attendance} onChange={handleChange} min={0} max={100} />
              <InputField label="Degree Percentage" name="degree" value={formData.degree} onChange={handleChange} min={0} max={100} />
              <InputField label="HSC Percentage" name="hsc" value={formData.hsc} onChange={handleChange} min={0} max={100} />
              <InputField label="SSC Percentage" name="ssc" value={formData.ssc} onChange={handleChange} min={0} max={100} />
            </div>
            <button type="submit" disabled={!model || training} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">{training ? <Loader2 className="w-5 h-5 animate-spin" /> : <IndianRupee className="w-5 h-5" />}{training ? 'Training salary estimator...' : 'Estimate Salary Package'}</button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-sm text-white text-center"><h3 className="text-sm font-bold text-emerald-100 uppercase tracking-wider mb-2">Estimated Package</h3>{prediction !== null ? <div><div className="text-4xl font-extrabold my-2">{prediction.toFixed(2)}</div><div className="text-emerald-100 font-medium">Lakhs Per Annum (LPA)</div><p className="text-xs text-emerald-200 mt-4 opacity-80">Estimated statistical prediction — not a guaranteed salary.</p></div> : <div className="py-6 flex flex-col items-center opacity-70"><IndianRupee className="w-12 h-12 mb-2" /><p className="text-sm">Submit details to see estimate</p></div>}</div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm"><h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><BarChart2 className="w-4 h-4" /> Salary Distribution</h3><ResponsiveContainer width="100%" height={150}><BarChart data={salaryDistribution}><CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} /><XAxis dataKey="range" tick={{fontSize: 10}} interval={0} /><YAxis tick={{fontSize: 10}} /><Tooltip /><Bar dataKey="count" fill="#10b981" radius={[2, 2, 0, 0]} /></BarChart></ResponsiveContainer></div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm"><h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Interactive Regression Validation</h3>{metrics ? <div className="space-y-4"><div className="flex gap-4"><Metric label="Train" value={metrics.trainRecords.toLocaleString()} /><Metric label="Test" value={metrics.testRecords.toLocaleString()} /></div><div className="grid grid-cols-2 gap-4"><Metric label="R²" value={metrics.r2.toFixed(3)} /><Metric label="Adjusted R²" value={metrics.adjustedR2.toFixed(3)} /><Metric label="RMSE" value={metrics.rmse.toFixed(2)} /><Metric label="MAE" value={metrics.mae.toFixed(2)} /></div><div className="text-xs text-slate-500">Uses the same 11 predictors and 80/20 modelling design documented in the R salary regression. The R lm() output remains the authoritative statistical result.</div></div> : <div className="text-sm text-slate-400">{training ? 'Training model...' : 'Metrics unavailable.'}</div>}</div>}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="flex-1 bg-white dark:bg-slate-800 rounded-lg p-2 border border-slate-200 dark:border-slate-700 text-center"><div className="text-[10px] text-slate-500 uppercase">{label}</div><div className="font-bold">{value}</div></div>; }
function StatCard({ title, value }: { title: string; value: string }) { return <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center"><div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</div><div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{value}</div></div>; }
function InputField({ label, name, value, onChange, min, max, step = '1' }: any) { return <div className="space-y-1.5"><label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label><input type="number" name={name} value={value} onChange={onChange} min={min} max={max} step={step} required className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" /></div>; }
