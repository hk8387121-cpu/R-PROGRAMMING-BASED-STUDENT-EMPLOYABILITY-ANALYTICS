import React, { useMemo } from 'react';
import { useDataset } from '../context/DatasetContext';
import { getMappedColumns, parseNumber, isPlaced } from '../utils/dataProcessing';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function PlacementInsights() {
  const { processedDataset, columns, isLoadingDefault } = useDataset();
  const mappedCols = useMemo(() => getMappedColumns(columns), [columns]);

  const insights = useMemo(() => {
    if (!mappedCols.placementStatus) return null;
    const data = {
      cgpa: { placed: { sum: 0, count: 0 }, notPlaced: { sum: 0, count: 0 } },
      tech: { placed: { sum: 0, count: 0 }, notPlaced: { sum: 0, count: 0 } },
      soft: { placed: { sum: 0, count: 0 }, notPlaced: { sum: 0, count: 0 } },
      interns: { placed: { sum: 0, count: 0 }, notPlaced: { sum: 0, count: 0 } },
      backlogs: { placed: { sum: 0, count: 0 }, notPlaced: { sum: 0, count: 0 } }
    };

    processedDataset.forEach(row => {
      const group = isPlaced(row[mappedCols.placementStatus!]) ? 'placed' : 'notPlaced';
      const add = (key: keyof typeof data, column: string | undefined) => {
        const value = column ? parseNumber(row[column]) : NaN;
        if (Number.isFinite(value)) {
          data[key][group].sum += value;
          data[key][group].count++;
        }
      };
      add('cgpa', mappedCols.cgpa);
      add('tech', mappedCols.technicalSkill);
      add('soft', mappedCols.softSkill);
      add('interns', mappedCols.internships);
      add('backlogs', mappedCols.backlogs);
    });

    const average = (part: { sum: number; count: number }) => part.count ? part.sum / part.count : 0;
    return {
      cgpa: [{ name: 'Placed', value: average(data.cgpa.placed) }, { name: 'Not Placed', value: average(data.cgpa.notPlaced) }],
      tech: [{ name: 'Placed', value: average(data.tech.placed) }, { name: 'Not Placed', value: average(data.tech.notPlaced) }],
      soft: [{ name: 'Placed', value: average(data.soft.placed) }, { name: 'Not Placed', value: average(data.soft.notPlaced) }],
      interns: [{ name: 'Placed', value: average(data.interns.placed) }, { name: 'Not Placed', value: average(data.interns.notPlaced) }],
      backlogs: [{ name: 'Placed', value: average(data.backlogs.placed) }, { name: 'Not Placed', value: average(data.backlogs.notPlaced) }]
    };
  }, [processedDataset, mappedCols]);

  if (!processedDataset.length) {
    return <div className="flex items-center justify-center h-96 text-slate-500">{isLoadingDefault ? 'Loading dataset...' : 'Please upload a dataset first.'}</div>;
  }
  if (!insights) {
    return <div className="flex items-center justify-center h-96 text-slate-500">Placement status column not found in the loaded dataset.</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      <h2 className="text-2xl font-bold">Placement Insights</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InsightChart title="Average CGPA by Placement Status" data={insights.cgpa} />
        <InsightChart title="Average Technical Score by Placement Status" data={insights.tech} />
        <InsightChart title="Average Soft Skill Score by Placement Status" data={insights.soft} />
        <InsightChart title="Average Internships by Placement Status" data={insights.interns} />
        <InsightChart title="Average Backlogs by Placement Status" data={insights.backlogs} />
      </div>
      <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-4">Key Statistical Associations</h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4 text-sm leading-relaxed">The charts above are calculated directly from the {processedDataset.length.toLocaleString()} records in the currently loaded dataset and compare the Placed and Not Placed cohorts.</p>
        <p className="text-slate-700 dark:text-slate-300 text-sm font-medium"><em>* Statistical association does not necessarily imply causation.</em></p>
      </div>
    </div>
  );
}

function InsightChart({ title, data }: { title: string; data: { name: string; value: number }[] }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-slate-100">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip cursor={{ fill: 'transparent' }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => <Cell key={`${entry.name}-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
