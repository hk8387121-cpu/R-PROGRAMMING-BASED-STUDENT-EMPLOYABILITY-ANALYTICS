import React, { useMemo } from 'react';
import { useDataset } from '../context/DatasetContext';
import { getMappedColumns, parseNumber } from '../utils/dataProcessing';
import { calculateCorrelationMatrix } from '../utils/statistics';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function EDA() {
  const { processedDataset, columns, stats, isLoadingDefault } = useDataset();

  if (!processedDataset.length) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        {isLoadingDefault ? 'Loading dataset...' : 'Please upload a dataset first.'}
      </div>
    );
  }

  const mappedCols = useMemo(() => getMappedColumns(columns), [columns]);

  const { correlationMatrix, importantCols } = useMemo(() => {
    if (!stats) return { correlationMatrix: null, importantCols: [] };
    const important = [
      mappedCols.ssc, mappedCols.hsc, mappedCols.degree, mappedCols.cgpa,
      mappedCols.technicalSkill, mappedCols.softSkill, mappedCols.internships,
      mappedCols.liveProjects, mappedCols.workExperience, mappedCols.certifications,
      mappedCols.attendance, mappedCols.backlogs, mappedCols.salary
    ].filter(Boolean) as string[];

    // Ensure we only use numeric columns
    const numImportant = important.filter(col => stats.numericalFeatures.includes(col));
    
    return {
      correlationMatrix: calculateCorrelationMatrix(processedDataset, numImportant),
      importantCols: numImportant
    };
  }, [processedDataset, mappedCols, stats]);

  const getDistribution = (colName: string | undefined, bins: number = 10, separator: string = '-') => {
    if (!colName) return [];
    let min = Infinity, max = -Infinity;
    const values: number[] = [];
    
    processedDataset.forEach(r => {
      const v = parseNumber(r[colName]);
      if (!isNaN(v)) {
        values.push(v);
        if (v < min) min = v;
        if (v > max) max = v;
      }
    });

    if (values.length === 0) return [];
    if (min === max) return [{ range: String(min), count: values.length }];

    const step = (max - min) / bins;
    const data = Array(bins).fill(0).map((_, i) => ({
      range: `${(min + i * step).toFixed(1)}${separator}${(min + (i + 1) * step).toFixed(1)}`,
      count: 0,
      minVal: min + i * step,
      maxVal: min + (i + 1) * step
    }));

    values.forEach(v => {
      let idx = Math.floor((v - min) / step);
      if (idx >= bins) idx = bins - 1;
      data[idx].count++;
    });

    return data;
  };

  const getColorForCorrelation = (val: number) => {
    // Return a color from red (-1) to white (0) to blue (1)
    if (isNaN(val)) return 'transparent';
    const intensity = Math.abs(val);
    if (val > 0) {
      return `rgba(79, 70, 229, ${intensity})`; // Indigo
    } else {
      return `rgba(239, 68, 68, ${intensity})`; // Red
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <h2 className="text-2xl font-bold">Exploratory Data Analysis</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="CGPA Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getDistribution(mappedCols.cgpa, 15)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="range" tick={{fontSize: 12}} />
              <YAxis />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Technical Skill Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getDistribution(mappedCols.technicalSkill, 15)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="range" tick={{fontSize: 12}} />
              <YAxis />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Internships Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getDistribution(mappedCols.internships, 5, '–')}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="range" tick={{fontSize: 12}} />
              <YAxis />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard title="Attendance Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getDistribution(mappedCols.attendance, 10)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="range" tick={{fontSize: 12}} />
              <YAxis />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-x-auto">
        <h3 className="text-lg font-bold mb-6">Correlation Matrix (Numerical Features)</h3>
        {correlationMatrix && importantCols.length > 0 && (
          <div className="min-w-max">
            <div className="flex">
              <div className="w-32 flex-shrink-0"></div>
              {importantCols.map(col => (
                <div key={col} className="w-16 flex-shrink-0 text-xs font-medium truncate px-1 rotate-[-45deg] origin-bottom-left h-24 flex items-end">
                  {col}
                </div>
              ))}
            </div>
            {importantCols.map(col1 => (
              <div key={col1} className="flex items-center">
                <div className="w-32 flex-shrink-0 text-xs font-medium truncate pr-2 text-right">
                  {col1}
                </div>
                {importantCols.map(col2 => {
                  const val = correlationMatrix[col1][col2];
                  return (
                    <div 
                      key={`${col1}-${col2}`}
                      className="w-16 h-12 flex-shrink-0 border border-slate-200/50 dark:border-slate-800 flex items-center justify-center text-xs font-semibold group relative"
                      style={{ backgroundColor: getColorForCorrelation(val) }}
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md text-white mix-blend-difference">
                        {val.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-slate-100">{title}</h3>
      {children}
    </div>
  );
}
