import React, { useState } from 'react';
import { useDataset } from '../context/DatasetContext';
import { AlertTriangle, CheckCircle, Eraser, RotateCcw, Save } from 'lucide-react';

export default function Preprocessing() {
  const { rawDataset, processedDataset, columns, stats, updateProcessedDataset, resetProcessedDataset, isLoadingDefault } = useDataset();
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!rawDataset.length) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        {isLoadingDefault ? 'Loading dataset...' : 'Please upload a dataset first.'}
      </div>
    );
  }

  const handleRemoveMissing = () => {
    setLoading(true);
    setTimeout(() => {
      const cleanData = processedDataset.filter(row => {
        return columns.every(col => row[col] !== null && row[col] !== undefined && row[col] !== '');
      });
      updateProcessedDataset(cleanData);
      setActiveStep(3);
      setLoading(false);
    }, 500);
  };

  const handleRemoveDuplicates = () => {
    setLoading(true);
    setTimeout(() => {
      const uniqueStrings = new Set();
      const cleanData = processedDataset.filter(row => {
        const str = JSON.stringify(row);
        if (uniqueStrings.has(str)) return false;
        uniqueStrings.add(str);
        return true;
      });
      updateProcessedDataset(cleanData);
      setActiveStep(4);
      setLoading(false);
    }, 500);
  };

  const missingValuesCount = stats ? (Object.values(stats.missingValues) as number[]).reduce((a: number, b: number) => a + b, 0) : 0;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Data Preprocessing</h2>
        <button 
          onClick={resetProcessedDataset}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Reset Dataset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StepCard step={1} title="Raw Dataset" active={activeStep >= 1} desc={`${rawDataset.length} rows loaded`} />
        <StepCard step={2} title="Missing Values" active={activeStep >= 2} desc={`${missingValuesCount} missing detected`} />
        <StepCard step={3} title="Duplicates" active={activeStep >= 3} desc={`${stats?.duplicateCount} duplicates detected`} />
        <StepCard step={4} title="Clean Dataset" active={activeStep >= 4} desc={`${processedDataset.length} rows final`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold border-b border-slate-100 dark:border-slate-800 pb-4">Missing Value Treatment</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 font-medium mb-1">
                <AlertTriangle className="w-5 h-5" />
                {missingValuesCount > 0 ? `${missingValuesCount} Missing Values Found` : 'No Missing Values'}
              </div>
              <p className="text-sm text-slate-500">Rows containing null or empty values.</p>
            </div>
            <button 
              onClick={handleRemoveMissing}
              disabled={missingValuesCount === 0 || loading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Eraser className="w-4 h-4" /> Drop Rows
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
            {stats && Object.entries(stats.missingValues).map(([col, count]) => (count as number) > 0 && (
              <div key={col} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-300">{col}</span>
                <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded-md font-semibold">{count as number} missing</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold border-b border-slate-100 dark:border-slate-800 pb-4">Duplicate Detection</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium mb-1">
                <CheckCircle className="w-5 h-5" />
                {stats?.duplicateCount ? `${stats.duplicateCount} Duplicates Found` : 'No Duplicates'}
              </div>
              <p className="text-sm text-slate-500">Identical rows across all columns.</p>
            </div>
            <button 
              onClick={handleRemoveDuplicates}
              disabled={!stats?.duplicateCount || loading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Eraser className="w-4 h-4" /> Remove Duplicates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepCard({ step, title, desc, active }: { step: number, title: string, desc: string, active: boolean }) {
  return (
    <div className={`p-5 rounded-2xl border transition-all shadow-sm ${
      active 
        ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/30' 
        : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 opacity-60'
    }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-3 text-sm ${
        active ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-800'
      }`}>
        {step}
      </div>
      <h4 className={`font-bold ${active ? 'text-indigo-900 dark:text-indigo-300' : ''}`}>{title}</h4>
      <p className={`text-sm mt-1 ${active ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-500'}`}>{desc}</p>
    </div>
  );
}
