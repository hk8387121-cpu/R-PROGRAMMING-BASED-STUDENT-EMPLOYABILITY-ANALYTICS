import React, { useState } from 'react';
import Papa from 'papaparse';
import { UploadCloud, Search, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import { StudentRecord } from '../types/student';
import StudentAnalysis from './StudentAnalysis';

export default function Dataset() {
  const { rawDataset, processedDataset, columns, stats, setDataset } = useDataset();
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [page, setPage] = useState(1);
  const rowsPerPage = 50;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      parseFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      parseFile(file);
    } else {
      setError('Please upload a valid CSV file.');
    }
  };

  const parseFile = (file: File) => {
    setError(null);
    Papa.parse<StudentRecord>(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('Error parsing CSV file. Please check the console for details.');
          console.error(results.errors);
        } else if (results.data && results.data.length > 0) {
          setDataset(results.data, Object.keys(results.data[0]));
          setPage(1);
        } else {
          setError('The uploaded CSV file is empty.');
        }
      },
      error: (err) => {
        setError(err.message);
      }
    });
  };

  const filteredData = processedDataset.filter(row => 
    columns.some(col => 
      String(row[col]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dataset</h2>
        {rawDataset.length > 0 && (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="text-sm px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Reset to Default Dataset
            </button>
            <label className="text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer transition-colors shadow-sm">
              Replace Dataset
              <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        )}
      </div>

      {!rawDataset.length ? (
        <div 
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            isDragging 
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' 
              : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadCloud className="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload Dataset</h3>
          <p className="text-slate-500 mb-6 text-sm">Drag and drop your CSV file here, or click to browse</p>
          <label className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg cursor-pointer font-medium transition-colors">
            Browse Files
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </label>
          {error && (
            <div className="mt-4 text-red-500 flex items-center justify-center gap-2 text-sm bg-red-50 dark:bg-red-500/10 py-2 px-4 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Records</span>
              <div className="flex items-end justify-between mt-2">
                <div className="text-2xl font-bold">{stats?.totalRecords.toLocaleString()}</div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Features</span>
              <div className="flex items-end justify-between mt-2">
                <div className="text-2xl font-bold">{stats?.totalFeatures}</div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Numerical</span>
              <div className="flex items-end justify-between mt-2">
                <div className="text-2xl font-bold">{stats?.numericalFeatures.length}</div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Categorical</span>
              <div className="flex items-end justify-between mt-2">
                <div className="text-2xl font-bold">{stats?.categoricalFeatures.length}</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col h-[600px]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-indigo-500" />
                <h3 className="font-semibold text-lg">Data Preview</h3>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
                />
              </div>
            </div>
            
            <div className="overflow-auto flex-1">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800/50 sticky top-0 shadow-sm">
                  <tr>
                    {columns.map((col, idx) => (
                      <th key={idx} className="px-4 py-3 font-medium text-slate-500 dark:text-slate-400">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {paginatedData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      {columns.map((col, cIdx) => (
                        <td key={cIdx} className="px-4 py-2">
                          {row[col] !== null && row[col] !== undefined ? String(row[col]) : <span className="text-slate-400 italic">null</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap justify-between items-center gap-2">
              <span>
                {filteredData.length === 0
                  ? 'No matching records'
                  : `Showing ${(page - 1) * rowsPerPage + 1} to ${Math.min(page * rowsPerPage, filteredData.length)} of ${filteredData.length} records`}
              </span>
              
              <div className="flex gap-2 items-center">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 disabled:opacity-50"
                >Prev</button>
                <span className="font-medium">Page {totalPages === 0 ? 0 : page} of {totalPages}</span>
                <button 
                  disabled={page === totalPages || totalPages === 0}
                  onClick={() => setPage(p => p + 1)}
                  className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 disabled:opacity-50"
                >Next</button>
              </div>

              <label className="text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline font-medium">
                Upload different file
                <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </div>

          <section className="pt-2">
            <div className="mb-4">
              <h3 className="text-xl font-bold">Student Search</h3>
              <p className="text-sm text-slate-500 mt-1">Search and analyze a student directly from the loaded dataset.</p>
            </div>
            <StudentAnalysis />
          </section>
        </div>
      )}
    </div>
  );
}
