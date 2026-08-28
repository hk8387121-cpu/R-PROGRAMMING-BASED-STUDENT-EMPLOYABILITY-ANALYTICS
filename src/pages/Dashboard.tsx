import React, { useMemo } from 'react';
import { AlertCircle, BarChart3, CheckCircle2, Code2, GraduationCap, IndianRupee, Users, XCircle } from 'lucide-react';
import { BarChart, Bar, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useDataset } from '../context/DatasetContext';
import { getMappedColumns, isPlaced, parseNumber } from '../utils/dataProcessing';

const COLORS = ['#4f46e5', '#ef4444'];
const MODEL_KEYS = ['ssc', 'hsc', 'degree', 'cgpa', 'entranceExam', 'technicalSkill', 'softSkill', 'internships', 'liveProjects', 'workExperience', 'certifications', 'attendance', 'backlogs'] as const;

export default function Dashboard() {
  const { processedDataset, rawDataset, columns, stats, isLoadingDefault, loadError } = useDataset();
  const mapped = useMemo(() => getMappedColumns(columns), [columns]);

  const analysis = useMemo(() => {
    let placed = 0, notPlaced = 0, salaryCount = 0, salarySum = 0, backlogSum = 0;
    let cgpaSum = 0, cgpaCount = 0, techSum = 0, techCount = 0, softSum = 0, softCount = 0;
    let modelRecords = 0;
    processedDataset.forEach(row => {
      const p = mapped.placementStatus ? isPlaced(row[mapped.placementStatus]) : false;
      if (mapped.placementStatus) p ? placed++ : notPlaced++;
      const salary = mapped.salary ? parseNumber(row[mapped.salary]) : NaN;
      if (p && Number.isFinite(salary) && salary > 0) { salaryCount++; salarySum += salary; }
      const backlog = mapped.backlogs ? parseNumber(row[mapped.backlogs]) : NaN;
      if (Number.isFinite(backlog)) backlogSum += backlog;
      const cgpa = mapped.cgpa ? parseNumber(row[mapped.cgpa]) : NaN;
      if (Number.isFinite(cgpa)) { cgpaSum += cgpa; cgpaCount++; }
      const tech = mapped.technicalSkill ? parseNumber(row[mapped.technicalSkill]) : NaN;
      if (Number.isFinite(tech)) { techSum += tech; techCount++; }
      const soft = mapped.softSkill ? parseNumber(row[mapped.softSkill]) : NaN;
      if (Number.isFinite(soft)) { softSum += soft; softCount++; }
      const complete = mapped.placementStatus && MODEL_KEYS.every(k => {
        const col = mapped[k as keyof typeof mapped];
        return Boolean(col) && Number.isFinite(parseNumber(row[col as string]));
      });
      if (complete) modelRecords++;
    });
    const totalPlacement = placed + notPlaced;
    return {
      total: processedDataset.length,
      placed, notPlaced,
      placementRate: totalPlacement ? placed / totalPlacement * 100 : 0,
      avgSalary: salaryCount ? salarySum / salaryCount : 0,
      salaryCount,
      backlogSum,
      avgCgpa: cgpaCount ? cgpaSum / cgpaCount : 0,
      avgTech: techCount ? techSum / techCount : 0,
      avgSoft: softCount ? softSum / softCount : 0,
      modelRecords
    };
  }, [processedDataset, mapped]);

  const placementData = [{ name: 'Placed', value: analysis.placed }, { name: 'Not Placed', value: analysis.notPlaced }];

  const cgpaData = useMemo(() => {
    if (!mapped.cgpa || !mapped.placementStatus) return [];
    const bins = [
      { name: '<6.0', min: 0, max: 6, placed: 0, total: 0 },
      { name: '6.0–6.5', min: 6, max: 6.5, placed: 0, total: 0 },
      { name: '6.5–7.0', min: 6.5, max: 7, placed: 0, total: 0 },
      { name: '7.0–7.5', min: 7, max: 7.5, placed: 0, total: 0 },
      { name: '7.5–8.0', min: 7.5, max: 8, placed: 0, total: 0 },
      { name: '8.0–8.5', min: 8, max: 8.5, placed: 0, total: 0 },
      { name: '8.5–9.0', min: 8.5, max: 9, placed: 0, total: 0 },
      { name: '>9.0', min: 9, max: 11, placed: 0, total: 0 }
    ];
    processedDataset.forEach(row => {
      const value = parseNumber(row[mapped.cgpa!]);
      if (!Number.isFinite(value)) return;
      const bin = bins.find(b => value >= b.min && value < b.max);
      if (bin) { bin.total++; if (isPlaced(row[mapped.placementStatus!])) bin.placed++; }
    });
    return bins.map(b => ({ name: b.name, rate: b.total ? +(b.placed / b.total * 100).toFixed(2) : 0, total: b.total }));
  }, [processedDataset, mapped]);

  const missingTotal = useMemo(() => Object.values(stats?.missingValues || {}).reduce((a, b) => a + b, 0), [stats]);

  if (isLoadingDefault && !rawDataset.length) return <div className="flex items-center justify-center h-96 text-slate-500">Loading default dataset...</div>;
  if (!rawDataset.length) return <div className="flex flex-col items-center justify-center h-96 text-slate-500 gap-2"><p>Unable to load the default dataset.</p>{loadError && <p className="text-red-500 text-sm">{loadError}</p>}</div>;

  return (
    <div className="space-y-5 pb-12 overflow-y-auto h-full">
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-start justify-between gap-4 mb-4"><div><h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dataset Integrity Status</h3><p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">Source: Student Academic Placement Performance Dataset</p></div><div className="text-xs text-slate-500">Live values from loaded CSV</div></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
          <Integrity label="CSV Records Loaded" value={rawDataset.length} />
          <Integrity label="Application Records" value={processedDataset.length} />
          <Integrity label="Valid Model Records" value={analysis.modelRecords} />
          <Integrity label="Salary Records" value={analysis.salaryCount} />
          <Integrity label="Missing Values" value={missingTotal} />
          <Integrity label="Duplicate Records" value={stats?.duplicateCount ?? 0} />
          <Integrity label="Features" value={columns.length} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi icon={<Users className="w-5 h-5" />} label="Total Students" value={analysis.total.toLocaleString()} />
        <Kpi icon={<CheckCircle2 className="w-5 h-5" />} label="Placement Rate" value={`${analysis.placementRate.toFixed(1)}%`} note={`${analysis.placed.toLocaleString()} placed`} />
        <Kpi icon={<IndianRupee className="w-5 h-5" />} label="Average Salary" value={`${analysis.avgSalary.toFixed(2)} LPA`} note={`${analysis.salaryCount.toLocaleString()} valid salaries`} />
        <Kpi icon={<XCircle className="w-5 h-5" />} label="Total Backlogs" value={analysis.backlogSum.toLocaleString()} note="Sum of reported backlogs" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <section className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-4">Placement Distribution</h3>
          <ResponsiveContainer width="100%" height={270}><PieChart><Pie data={placementData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={3}>{placementData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer>
        </section>
        <section className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4"><h3 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">Placement Rate by CGPA Range</h3><span className="text-xs text-slate-500">Observed rate</span></div>
          <ResponsiveContainer width="100%" height={270}><BarChart data={cgpaData}><CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.25} /><XAxis dataKey="name" tick={{fontSize: 10}} interval={0} /><YAxis domain={[0, 100]} tick={{fontSize: 10}} /><Tooltip formatter={(v: number) => [`${v}%`, 'Placement rate']} /><Bar dataKey="rate" fill="#4f46e5" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm"><h3 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-5 flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Academic & Skill Snapshot</h3><div className="grid grid-cols-3 gap-4"><Snapshot label="Average CGPA" value={analysis.avgCgpa.toFixed(2)} /><Snapshot label="Technical Skill" value={analysis.avgTech.toFixed(1)} /><Snapshot label="Soft Skill" value={analysis.avgSoft.toFixed(1)} /></div></section>
        <section className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm"><h3 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Reviewer Notes</h3><div className="space-y-3 text-sm text-slate-600 dark:text-slate-300"><p className="flex gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" /> All dashboard counts are calculated from the loaded dataset.</p><p className="flex gap-2"><Code2 className="w-4 h-4 mt-0.5 text-indigo-500 shrink-0" /> R scripts in <code>R/</code> remain the authoritative analytical pipeline.</p><p className="flex gap-2"><AlertCircle className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" /> Observed associations are descriptive and should not be interpreted as causal effects.</p></div></section>
      </div>
    </div>
  );
}

function Integrity({ label, value }: { label: string; value: number }) { return <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col"><span className="text-xs text-slate-500 mb-1">{label}</span><span className="font-bold text-indigo-600 dark:text-indigo-400">{value.toLocaleString()}</span></div>; }
function Kpi({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note?: string }) { return <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm"><div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-semibold">{icon}{label}</div><div className="text-2xl font-bold mt-5 text-slate-900 dark:text-white">{value}</div>{note && <div className="text-xs text-slate-500 mt-1">{note}</div>}</div>; }
function Snapshot({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4 text-center"><div className="text-xs text-slate-500 mb-1">{label}</div><div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{value}</div></div>; }
