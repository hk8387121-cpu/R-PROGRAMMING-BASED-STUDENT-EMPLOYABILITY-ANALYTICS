import React, { useMemo } from 'react';
import { FileText, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import { getMappedColumns, isPlaced, parseNumber } from '../utils/dataProcessing';

export default function Reports() {
  const { processedDataset, columns, stats, isLoadingDefault } = useDataset();
  const mapped = useMemo(() => getMappedColumns(columns), [columns]);

  const summary = useMemo(() => {
    let placed = 0, notPlaced = 0, salaryCount = 0, salarySum = 0;
    let ssc = 0, hsc = 0, degree = 0, cgpa = 0, tech = 0, soft = 0, intern = 0, projects = 0, cert = 0, attendance = 0, backlogs = 0;
    const counts = { ssc: 0, hsc: 0, degree: 0, cgpa: 0, tech: 0, soft: 0, intern: 0, projects: 0, cert: 0, attendance: 0, backlogs: 0 };
    processedDataset.forEach(r => {
      if (mapped.placementStatus) isPlaced(r[mapped.placementStatus]) ? placed++ : notPlaced++;
      const add = (key: keyof typeof mapped, target: keyof typeof counts) => {
        const col = mapped[key];
        const v = col ? parseNumber(r[col]) : NaN;
        if (Number.isFinite(v)) { (counts as any)[target]++; return v; }
        return 0;
      };
      ssc += add('ssc', 'ssc'); hsc += add('hsc', 'hsc'); degree += add('degree', 'degree'); cgpa += add('cgpa', 'cgpa'); tech += add('technicalSkill', 'tech'); soft += add('softSkill', 'soft'); intern += add('internships', 'intern'); projects += add('liveProjects', 'projects'); cert += add('certifications', 'cert'); attendance += add('attendance', 'attendance'); backlogs += add('backlogs', 'backlogs');
      const salary = mapped.salary ? parseNumber(r[mapped.salary]) : NaN;
      if (Number.isFinite(salary) && salary > 0) { salaryCount++; salarySum += salary; }
    });
    const avg = (v: number, n: number) => n ? v / n : 0;
    return {
      placed, notPlaced,
      rate: placed + notPlaced ? placed / (placed + notPlaced) * 100 : 0,
      salaryCount, avgSalary: salaryCount ? salarySum / salaryCount : 0,
      averages: { ssc: avg(ssc, counts.ssc), hsc: avg(hsc, counts.hsc), degree: avg(degree, counts.degree), cgpa: avg(cgpa, counts.cgpa), tech: avg(tech, counts.tech), soft: avg(soft, counts.soft), intern: avg(intern, counts.intern), projects: avg(projects, counts.projects), cert: avg(cert, counts.cert), attendance: avg(attendance, counts.attendance), backlogs: avg(backlogs, counts.backlogs) }
    };
  }, [processedDataset, mapped]);

  const handleDownloadCSV = () => {
    if (!columns.length) return;
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = [columns.map(escape).join(','), ...processedDataset.map(row => columns.map(c => escape(row[c])).join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'student_employability_dataset.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  if (!processedDataset.length) return <div className="flex items-center justify-center h-96 text-slate-500">{isLoadingDefault ? 'Loading dataset...' : 'Please upload a dataset first.'}</div>;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap justify-between items-center gap-3"><div><h2 className="text-2xl font-bold">Project Reports</h2><p className="text-sm text-slate-500 mt-1">Reproducible summary of the currently loaded student dataset.</p></div><button onClick={handleDownloadCSV} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"><Download className="w-4 h-4" /> Download Dataset CSV</button></div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-6"><h1 className="text-3xl font-bold text-center mb-2">Student Employability Analytics Report</h1><p className="text-center text-slate-500">Values below are calculated from the loaded CSV; no analytical result is hard-coded.</p></div>

        <section className="mb-8"><h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-500" /> Dataset Summary</h3><div className="grid grid-cols-2 md:grid-cols-5 gap-4"><Card label="Total Students" value={processedDataset.length.toLocaleString()} /><Card label="Features" value={columns.length.toLocaleString()} /><Card label="Placed" value={summary.placed.toLocaleString()} /><Card label="Not Placed" value={summary.notPlaced.toLocaleString()} /><Card label="Placement Rate" value={`${summary.rate.toFixed(1)}%`} /></div></section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section><h3 className="text-xl font-bold mb-4">Academic Averages</h3><Table rows={[["SSC", `${summary.averages.ssc.toFixed(2)}%`], ["HSC", `${summary.averages.hsc.toFixed(2)}%`], ["Degree", `${summary.averages.degree.toFixed(2)}%`], ["CGPA", summary.averages.cgpa.toFixed(2)], ["Attendance", `${summary.averages.attendance.toFixed(2)}%`], ["Backlogs", summary.averages.backlogs.toFixed(2)]]} /></section>
          <section><h3 className="text-xl font-bold mb-4">Employability & Salary</h3><Table rows={[["Technical Skill", summary.averages.tech.toFixed(2)], ["Soft Skill", summary.averages.soft.toFixed(2)], ["Internships", summary.averages.intern.toFixed(2)], ["Live Projects", summary.averages.projects.toFixed(2)], ["Certifications", summary.averages.cert.toFixed(2)], ["Average Valid Salary", `${summary.avgSalary.toFixed(2)} LPA`]]} /></section>
        </div>

        <section className="mt-8"><h3 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> R Analytical Pipeline</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Pipeline title="Data preprocessing" text="R/01_data_preprocessing.R validates columns, standardizes values and creates the cleaned dataset." /><Pipeline title="EDA and visualization" text="R/02_eda.R and R/03_visualization.R perform exploratory analysis and generate the project's visualizations." /><Pipeline title="Placement prediction" text="R/04_placement_prediction.R trains Logistic Regression, Decision Tree and Random Forest using a seeded 80/20 split and evaluates Accuracy, Precision, Recall, F1, Balanced Accuracy and ROC-AUC." /><Pipeline title="Salary regression" text="R/05_salary_regression.R filters placed students with salary > 0 and fits linear regression using the documented 11 predictors." /><Pipeline title="Model comparison" text="R/06_model_comparison.R ranks classification models using the generated metrics rather than a predetermined winner." /><Pipeline title="Final report" text="R/07_final_report.R combines the generated outputs for the reproducible project report." /></div></section>

        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 p-4 text-sm text-amber-900 dark:text-amber-200 flex gap-3"><AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /><div><strong>Interpretation note:</strong> dashboard and browser estimates are calculated from the loaded data for interactivity. The R scripts and their generated outputs are the authoritative statistical analysis. Observed associations should not be interpreted as causal effects.</div></div>
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) { return <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg"><div className="text-sm text-slate-500">{label}</div><div className="text-lg font-bold mt-1">{value}</div></div>; }
function Table({ rows }: { rows: string[][] }) { return <div className="bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">{rows.map(([a, b]) => <div key={a} className="flex justify-between p-3"><span className="text-slate-500">{a}</span><span className="font-bold">{b}</span></div>)}</div>; }
function Pipeline({ title, text }: { title: string; text: string }) { return <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700"><div className="font-semibold mb-1">{title}</div><div className="text-sm text-slate-500">{text}</div></div>; }
