import React, { useMemo } from 'react';
import { useDataset } from '../context/DatasetContext';
import { getMappedColumns, parseNumber, isPlaced } from '../utils/dataProcessing';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

export default function PlacementInsights() {
  const { processedDataset, columns, isLoadingDefault } = useDataset();

  if (!processedDataset.length) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        {isLoadingDefault ? 'Loading dataset...' : 'Please upload a dataset first.'}
      </div>
    );
  }

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

    processedDataset.forEach(r => {
      const placed = isPlaced(r[mappedCols.placementStatus!]);
      const target = placed ? 'placed' : 'notPlaced';

      const cgpa = parseNumber(r[mappedCols.cgpa || '']);
      if (!isNaN(cgpa)) { data.cgpa[target].sum += cgpa; data.cgpa[target].count++; }

      const tech = parseNumber(r[mappedCols.technicalSkill || '']);
      if (!isNaN(tech)) { data.tech[target].sum += tech; data.tech[target].count++; }

      const soft = parseNumber(r[mappedCols.softSkill || '']);
      if (!isNaN(soft)) { data.soft[target].sum += soft; data.soft[target].count++; }

      const intern = parseNumber(r[mappedCols.internships || '']);
      if (!isNaN(intern)) { data.interns[target].sum += intern; data.interns[target].count++; }

      const backlog = parseNumber(r[mappedCols.backlogs || '']);
      if (!isNaN(backlog)) { data.backlogs[target].sum += backlog; data.backlogs[target].count++; }
    });

    return {
      cgpa: [
        { name: 'Placed', value: data.cgpa.placed.sum / (data.cgpa.placed.count || 1) },
        { name: 'Not Placed', value: data.cgpa.notPlaced.sum / (data.cgpa.notPlaced.count || 1) }
      ],
      tech: [
        { name: 'Placed', value: data.tech.placed.sum / (data.tech.placed.count || 1) },
        { name: 'Not Placed', value: data.tech.notPlaced.sum / (data.tech.notPlaced.count || 1) }
      ],
      soft: [
        { name: 'Placed', value: data.soft.placed.sum / (data.soft.placed.count || 1) },
        { name: 'Not Placed', value: data.soft.notPlaced.sum / (data.soft.notPlaced.count || 1) }
      ],
      interns: [
        { name: 'Placed', value: data.interns.placed.sum / (data.interns.placed.count || 1) },
        { name: 'Not Placed', value: data.interns.notPlaced.sum / (data.interns.notPlaced.count || 1) }
      ],
      backlogs: [
        { name: 'Placed', value: data.backlogs.placed.sum / (data.backlogs.placed.count || 1) },
        { name: 'Not Placed', value: data.backlogs.notPlaced.sum / (data.backlogs.notPlaced.count || 1) }
      ]
    };
  }, [processedDataset, mappedCols]);

  if (!insights) return <div>Placement status column not found.</div>;

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
        <p className="text-slate-700 dark:text-slate-300 mb-4 text-sm leading-relaxed">
          The statistical analysis presented in the charts above is calculated directly from the {processedDataset.length.toLocaleString()} records in the complete dataset. It reveals the varying magnitudes of difference between Placed and Not Placed cohorts across academic, skill, and experience metrics.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-4 text-sm font-medium">
          <em>* Note: Statistical association does not necessarily imply causation. These insights should be evaluated alongside the predictive modeling results for comprehensive interpretation.</em>
        </p>
      </div>
    </div>
  );
}

function InsightChart({ title, data }: { title: string, data: any[] }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-slate-100">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip cursor={{fill: 'transparent'}} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
