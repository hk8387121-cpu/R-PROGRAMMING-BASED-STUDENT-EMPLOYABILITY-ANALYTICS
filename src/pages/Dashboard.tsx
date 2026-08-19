import React, { useMemo } from 'react';
import { useDataset } from '../context/DatasetContext';
import { getMappedColumns, parseNumber, isPlaced } from '../utils/dataProcessing';
import { 
  Users, CheckCircle2, XCircle, TrendingUp, 
  GraduationCap, Code2, MessagesSquare, IndianRupee 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter
} from 'recharts';

const COLORS = ['#4f46e5', '#ef4444', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

export default function Dashboard() {
  const { processedDataset, columns, rawDataset, isLoadingDefault, loadError } = useDataset();

  const mappedCols = useMemo(() => getMappedColumns(columns), [columns]);

  const kpis = useMemo(() => {
    let placed = 0;
    let notPlaced = 0;
    let cgpaSum = 0;
    let cgpaCount = 0;
    let techSum = 0;
    let techCount = 0;
    let techMin = Infinity, techMax = -Infinity;
    let softSum = 0;
    let softCount = 0;
    let softMin = Infinity, softMax = -Infinity;
    let salarySum = 0;
    let salaryCount = 0;
    let internSum = 0;
    let internCount = 0;
    let backlogs = 0;

    processedDataset.forEach(row => {
      if (mappedCols.placementStatus) {
        if (isPlaced(row[mappedCols.placementStatus])) placed++;
        else notPlaced++;
      }
      
      if (mappedCols.cgpa) {
        const v = parseNumber(row[mappedCols.cgpa]);
        if (!isNaN(v)) { cgpaSum += v; cgpaCount++; }
      }
      
      if (mappedCols.technicalSkill) {
        const v = parseNumber(row[mappedCols.technicalSkill]);
        if (!isNaN(v)) { 
          techSum += v; techCount++; 
          if (v < techMin) techMin = v;
          if (v > techMax) techMax = v;
        }
      }
      
      if (mappedCols.softSkill) {
        const v = parseNumber(row[mappedCols.softSkill]);
        if (!isNaN(v)) { 
          softSum += v; softCount++; 
          if (v < softMin) softMin = v;
          if (v > softMax) softMax = v;
        }
      }
      
      if (mappedCols.salary) {
        const v = parseNumber(row[mappedCols.salary]);
        if (!isNaN(v) && v > 0) { salarySum += v; salaryCount++; }
      }
      
      if (mappedCols.internships) {
        const v = parseNumber(row[mappedCols.internships]);
        if (!isNaN(v)) { internSum += v; internCount++; }
      }
      
      if (mappedCols.backlogs) {
        const v = parseNumber(row[mappedCols.backlogs]);
        if (!isNaN(v) && v > 0) { backlogs += v; }
      }
    });

    return {
      total: processedDataset.length,
      placed,
      notPlaced,
      placementRate: placed / (placed + notPlaced) * 100 || 0,
      avgCgpa: cgpaCount ? cgpaSum / cgpaCount : 0,
      avgTech: techCount ? techSum / techCount : 0,
      techMin: techMin === Infinity ? 0 : techMin,
      techMax: techMax === -Infinity ? 0 : techMax,
      avgSoft: softCount ? softSum / softCount : 0,
      softMin: softMin === Infinity ? 0 : softMin,
      softMax: softMax === -Infinity ? 0 : softMax,
      avgSalary: salaryCount ? salarySum / salaryCount : 0,
      avgInterns: internCount ? internSum / internCount : 0,
      backlogs
    };
  }, [processedDataset, mappedCols]);

  const placementData = [
    { name: 'Placed', value: kpis.placed },
    { name: 'Not Placed', value: kpis.notPlaced }
  ];

  const academicData = useMemo(() => {
    let sscSum = 0, hscSum = 0, degSum = 0;
    let count = processedDataset.length;
    
    processedDataset.forEach(r => {
      if (mappedCols.ssc) sscSum += parseNumber(r[mappedCols.ssc]) || 0;
      if (mappedCols.hsc) hscSum += parseNumber(r[mappedCols.hsc]) || 0;
      if (mappedCols.degree) degSum += parseNumber(r[mappedCols.degree]) || 0;
    });

    return [
      { name: 'SSC %', value: count ? sscSum / count : 0 },
      { name: 'HSC %', value: count ? hscSum / count : 0 },
      { name: 'Degree %', value: count ? degSum / count : 0 },
    ];
  }, [processedDataset, mappedCols]);

  const skillData = [
    { name: 'Technical Skills', value: kpis.avgTech },
    { name: 'Soft Skills', value: kpis.avgSoft }
  ];

  const cgpaScatter = useMemo(() => {
    if (!mappedCols.cgpa || !mappedCols.placementStatus) return [];
    return processedDataset.map(r => ({
      cgpa: parseNumber(r[mappedCols.cgpa!]),
      placed: isPlaced(r[mappedCols.placementStatus!]) ? 1 : 0,
      status: isPlaced(r[mappedCols.placementStatus!]) ? 'Placed' : 'Not Placed'
    })).filter(d => !isNaN(d.cgpa));
  }, [processedDataset, mappedCols]);

  if (isLoadingDefault && !rawDataset.length) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500 flex-col gap-4">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p>Loading default dataset...</p>
      </div>
    );
  }

  if (!rawDataset.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500 space-y-4">
        <p>Please upload a dataset to view the dashboard.</p>
        {loadError && (
          <p className="text-red-500 text-sm">Failed to load default dataset: {loadError}</p>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col min-h-0 space-y-4 pb-12 overflow-y-auto">
      {/* Dataset Status Panel */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Dataset Integrity Status</h3>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Source: Student Academic Placement Performance Dataset</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500">CSV Records Loaded:</span> <span className="font-bold text-indigo-600 dark:text-indigo-400">{rawDataset.length.toLocaleString()}</span>
          </div>
          <div className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500">Records in Application State:</span> <span className="font-bold text-indigo-600 dark:text-indigo-400">{processedDataset.length.toLocaleString()}</span>
          </div>
          <div className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500">Columns:</span> <span className="font-bold text-indigo-600 dark:text-indigo-400">{columns.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-none md:grid-rows-[repeat(12,minmax(0,1fr))] gap-4 flex-1 min-h-[800px] auto-rows-min">
        {/* Bento Grid Top Row KPIs */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3 row-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Students</span>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{kpis.total.toLocaleString()}</div>
            <div className="text-[10px] text-green-600 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded">Dataset Loaded</div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3 row-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Placement Rate</span>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{kpis.placementRate.toFixed(1)}%</div>
            <div className="text-[10px] text-slate-400">N = {kpis.placed.toLocaleString()}</div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3 row-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Avg Package</span>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{kpis.avgSalary.toFixed(2)} <span className="text-xs font-normal text-slate-400">LPA</span></div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3 row-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Backlogs</span>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-red-600">{kpis.backlogs.toLocaleString()}</div>
            <div className="text-[10px] text-red-400">Needs Review</div>
          </div>
        </div>

        {/* Bento Grid Middle Section */}
        <div className="col-span-12 lg:col-span-8 row-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">Placement Probabilities vs CGPA Score</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-[10px] text-slate-500"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Placed</span>
              <span className="flex items-center gap-1 text-[10px] text-slate-500"><span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700"></span> Unplaced</span>
            </div>
          </div>
          <div className="flex-1 relative w-full h-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" dataKey="cgpa" name="CGPA" domain={['auto', 'auto']} tick={{fontSize: 10}} />
                <YAxis type="number" dataKey="placed" name="Placed" ticks={[0, 1]} tickFormatter={v => v===1 ? 'Yes' : 'No'} tick={{fontSize: 10}} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Students" data={cgpaScatter} fill={COLORS[0]} opacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 row-span-4 bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-2xl p-5 text-white shadow-sm flex flex-col">
          <h3 className="text-xs font-bold uppercase mb-4 text-indigo-400">Predictive Insights</h3>
          <ul className="space-y-4 flex-1 overflow-y-auto">
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-[11px] leading-snug text-slate-300">Students with <span className="text-white font-bold">CGPA &gt; 7.5</span> have significantly higher placement rates.</div>
            </li>
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded bg-yellow-500/20 text-yellow-400 flex items-center justify-center shrink-0">
                <XCircle className="w-4 h-4" />
              </div>
              <div className="text-[11px] leading-snug text-slate-300"><span className="text-white font-bold">Backlogs</span> significantly drop placement probability.</div>
            </li>
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-[11px] leading-snug text-slate-300">Each <span className="text-white font-bold">Internship</span> increases predicted salary average.</div>
            </li>
          </ul>
        </div>

        {/* Bento Grid Bottom Section */}
        <div className="col-span-12 lg:col-span-4 row-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase mb-3">Live Skill Matrix</h3>
          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400"><span>Technical Proficiency</span><span>{kpis.avgTech.toFixed(0)}%</span></div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{width: `${kpis.avgTech}%`}}></div></div>
              <div className="flex justify-between text-[9px] text-slate-400 mt-0.5"><span>Min: {kpis.techMin.toFixed(0)}</span><span>Max: {kpis.techMax.toFixed(0)}</span></div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400"><span>Soft Skills Score</span><span>{kpis.avgSoft.toFixed(0)}%</span></div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-sky-400" style={{width: `${kpis.avgSoft}%`}}></div></div>
              <div className="flex justify-between text-[9px] text-slate-400 mt-0.5"><span>Min: {kpis.softMin.toFixed(0)}</span><span>Max: {kpis.softMax.toFixed(0)}</span></div>
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
              <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Averages</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{kpis.avgCgpa.toFixed(2)}</div>
                  <div className="text-[8px] text-slate-400 uppercase">CGPA Mean</div>
                </div>
                <div className="text-center p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{kpis.avgInterns.toFixed(1)}</div>
                  <div className="text-[8px] text-slate-400 uppercase">Internships</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 row-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase mb-4">Placement Overview</h3>
          <div className="flex-1 w-full min-h-[150px]">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={placementData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                   {placementData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={index === 0 ? COLORS[0] : COLORS[1]} />
                   ))}
                 </Pie>
                 <Tooltip />
                 <Legend wrapperStyle={{fontSize: '10px'}} />
               </PieChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 row-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase mb-4">Academic Averages</h3>
          <div className="flex-1 w-full min-h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={academicData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="name" tick={{fontSize: 10}} />
                <YAxis domain={[0, 100]} tick={{fontSize: 10}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" fill={COLORS[4]} radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
