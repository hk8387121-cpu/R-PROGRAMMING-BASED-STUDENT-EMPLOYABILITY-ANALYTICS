import React, { useState, useMemo, useEffect } from 'react';
import { useDataset } from '../context/DatasetContext';
import { getMappedColumns, parseNumber } from '../utils/dataProcessing';
import { LinearRegression } from '../utils/regression';
import { standardize, transformWithScaler } from '../utils/prediction';
import { IndianRupee, TrendingUp, AlertCircle, BarChart2 } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function SalaryAnalysis() {
  const { processedDataset, columns, isLoadingDefault } = useDataset();
  const [model, setModel] = useState<LinearRegression | null>(null);
  const [scaler, setScaler] = useState<{means: number[], stds: number[]} | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  
  const mappedCols = useMemo(() => getMappedColumns(columns), [columns]);

  const [formData, setFormData] = useState({
    cgpa: 8.5,
    technicalSkill: 85,
    softSkill: 80,
    internships: 2,
    liveProjects: 2,
    workExperience: 6,
    certifications: 2
  });

  const [prediction, setPrediction] = useState<number | null>(null);

  useEffect(() => {
    if (!processedDataset.length || !mappedCols.salary) return;

    const X: number[][] = [];
    const y: number[] = [];

    // Only train on placed students with salary > 0
    processedDataset.forEach(row => {
      const salary = parseNumber(row[mappedCols.salary!]);
      
      if (salary > 0) {
        const features = [
          parseNumber(row[mappedCols.cgpa || '']),
          parseNumber(row[mappedCols.technicalSkill || '']),
          parseNumber(row[mappedCols.softSkill || '']),
          parseNumber(row[mappedCols.internships || '']),
          parseNumber(row[mappedCols.liveProjects || '']),
          parseNumber(row[mappedCols.workExperience || '']),
          parseNumber(row[mappedCols.certifications || ''])
        ];

        if (features.every(f => !isNaN(f))) {
          X.push(features);
          y.push(salary);
        }
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

    const lr = new LinearRegression(0.01, 1000);
    lr.train(X_train, y_train);

    // Evaluate
    let mae = 0, mse = 0;
    let y_mean = y_test.reduce((a, b) => a + b, 0) / y_test.length;
    let sst = 0, ssr = 0;

    for (let i = 0; i < X_test.length; i++) {
      const pred = lr.predict(X_test[i]);
      const actual = y_test[i];
      
      const err = pred - actual;
      mae += Math.abs(err);
      mse += err * err;
      
      ssr += err * err;
      sst += Math.pow(actual - y_mean, 2);
    }

    mae /= X_test.length;
    mse /= X_test.length;
    const rmse = Math.sqrt(mse);
    const r2 = sst === 0 ? 0 : 1 - (ssr / sst);

    setModel(lr);
    setScaler({ means, stds });
    setMetrics({ 
      mae, mse, rmse, r2: Math.max(0, r2),
      trainRecords: X_train.length,
      testRecords: X_test.length
    }); // R2 can be negative if model is very bad, cap at 0 for display
  }, [processedDataset, mappedCols]);

  const stats = useMemo(() => {
    if (!mappedCols.salary) return null;
    
    const salaries = processedDataset
      .map(r => parseNumber(r[mappedCols.salary!]))
      .filter(s => !isNaN(s) && s > 0)
      .sort((a, b) => a - b);
      
    if (!salaries.length) return null;

    const sum = salaries.reduce((a, b) => a + b, 0);
    return {
      min: salaries[0],
      max: salaries[salaries.length - 1],
      avg: sum / salaries.length,
      median: salaries[Math.floor(salaries.length / 2)]
    };
  }, [processedDataset, mappedCols]);

  const salaryDistribution = useMemo(() => {
    if (!mappedCols.salary) return [];
    
    const bins = [0, 3, 5, 7, 10, 15, Infinity];
    const labels = ['< 3', '3-5', '5-7', '7-10', '10-15', '> 15'];
    const counts = new Array(labels.length).fill(0);
    
    processedDataset.forEach(r => {
      const s = parseNumber(r[mappedCols.salary!]);
      if (!isNaN(s) && s > 0) {
        for (let i = 0; i < bins.length - 1; i++) {
          if (s >= bins[i] && s < bins[i+1]) {
            counts[i]++;
            break;
          }
        }
      }
    });
    
    return labels.map((l, i) => ({ range: l, count: counts[i] }));
  }, [processedDataset, mappedCols]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: Number(e.target.value) }));
  };

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!model || !scaler) return;

    const inputFeatures = [
      formData.cgpa, formData.technicalSkill, formData.softSkill,
      formData.internships, formData.liveProjects, formData.workExperience, formData.certifications
    ];

    const scaledFeatures = transformWithScaler(inputFeatures, scaler.means, scaler.stds);
    const pred = Math.max(0, model.predict(scaledFeatures)); // Can't have negative salary
    setPrediction(pred);
  };

  if (!processedDataset.length) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        {isLoadingDefault ? 'Loading dataset...' : 'Please upload a dataset to enable predictions.'}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <h2 className="text-2xl font-bold">Salary Analysis & Estimation</h2>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Average Salary" value={`${stats.avg.toFixed(2)} LPA`} />
          <StatCard title="Median Salary" value={`${stats.median.toFixed(2)} LPA`} />
          <StatCard title="Highest Salary" value={`${stats.max.toFixed(2)} LPA`} />
          <StatCard title="Lowest Salary" value={`${stats.min.toFixed(2)} LPA`} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-bold">Salary Predictor</h3>
          </div>
          
          <form onSubmit={handlePredict} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <InputField label="CGPA" name="cgpa" value={formData.cgpa} onChange={handleChange} min={0} max={10} step="0.1" />
              <InputField label="Technical Skill Score" name="technicalSkill" value={formData.technicalSkill} onChange={handleChange} min={0} max={100} />
              <InputField label="Soft Skill Score" name="softSkill" value={formData.softSkill} onChange={handleChange} min={0} max={100} />
              <InputField label="Internships" name="internships" value={formData.internships} onChange={handleChange} min={0} max={10} />
              <InputField label="Live Projects" name="liveProjects" value={formData.liveProjects} onChange={handleChange} min={0} max={10} />
              <InputField label="Work Exp (Months)" name="workExperience" value={formData.workExperience} onChange={handleChange} min={0} max={60} />
              <InputField label="Certifications" name="certifications" value={formData.certifications} onChange={handleChange} min={0} max={20} />
            </div>

            <button 
              type="submit" 
              disabled={!model}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <IndianRupee className="w-5 h-5" /> Estimate Salary Package
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-sm text-white text-center">
            <h3 className="text-sm font-bold text-emerald-100 uppercase tracking-wider mb-2">Estimated Package</h3>
            {prediction !== null ? (
              <div>
                <div className="text-4xl font-extrabold my-2">{prediction.toFixed(2)}</div>
                <div className="text-emerald-100 font-medium">Lakhs Per Annum (LPA)</div>
                <p className="text-xs text-emerald-200 mt-4 opacity-80">This is a statistical estimate based on historical placement data.</p>
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center opacity-70">
                <IndianRupee className="w-12 h-12 mb-2" />
                <p className="text-sm">Submit details to see estimate</p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4" /> Distribution
            </h3>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={salaryDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="range" tick={{fontSize: 10}} interval={0} />
                <YAxis tick={{fontSize: 10}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="count" fill="#10b981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Regression Metrics
            </h3>
            
            {metrics ? (
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
                    <div className="text-xs text-slate-500 font-medium">R² Score</div>
                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{metrics.r2.toFixed(3)}</div>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="text-xs text-slate-500 font-medium">RMSE</div>
                    <div className="text-lg font-bold">{metrics.rmse.toFixed(2)}</div>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="text-xs text-slate-500 font-medium">MAE</div>
                    <div className="text-lg font-bold">{metrics.mae.toFixed(2)}</div>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="text-xs text-slate-500 font-medium">MSE</div>
                    <div className="text-lg font-bold">{metrics.mse.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-400">Training model...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string, value: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
      <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</div>
      <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{value}</div>
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
