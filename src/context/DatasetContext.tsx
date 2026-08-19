import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ProcessedDatasetInfo, StudentRecord, DatasetStats } from '../types/student';
import Papa from 'papaparse';

interface DatasetContextType {
  rawDataset: StudentRecord[];
  processedDataset: StudentRecord[];
  columns: string[];
  stats: DatasetStats | null;
  setDataset: (data: StudentRecord[], cols: string[]) => void;
  updateProcessedDataset: (data: StudentRecord[]) => void;
  resetProcessedDataset: () => void;
  calculateStats: (data: StudentRecord[], cols: string[]) => DatasetStats;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isLoadingDefault: boolean;
  loadError: string | null;
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined);

export function DatasetProvider({ children }: { children: ReactNode }) {
  const [rawDataset, setRawDataset] = useState<StudentRecord[]>([]);
  const [processedDataset, setProcessedDataset] = useState<StudentRecord[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [stats, setStats] = useState<DatasetStats | null>(null);
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoadingDefault, setIsLoadingDefault] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // Automatically load the default dataset
    const loadDefaultDataset = async () => {
      try {
        setIsLoadingDefault(true);
        const response = await fetch('/student_academic_placement_performance_dataset(1).csv');
        if (!response.ok) {
          throw new Error('Failed to fetch the default dataset.');
        }
        const text = await response.text();
        
        Papa.parse<StudentRecord>(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              setLoadError('Error parsing default CSV file.');
              console.error(results.errors);
            } else if (results.data && results.data.length > 0) {
              const cols = Object.keys(results.data[0]);
              setRawDataset(results.data);
              setProcessedDataset(results.data);
              setColumns(cols);
              setStats(calculateStats(results.data, cols));
              setLoadError(null);
            } else {
              setLoadError('The default CSV file is empty.');
            }
            setIsLoadingDefault(false);
          },
          error: (err) => {
            setLoadError(err.message);
            setIsLoadingDefault(false);
          }
        });
      } catch (err: any) {
        setLoadError(err.message || 'An unknown error occurred while loading default data.');
        setIsLoadingDefault(false);
      }
    };

    loadDefaultDataset();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const calculateStats = (data: StudentRecord[], cols: string[]): DatasetStats => {
    const numerical: string[] = [];
    const categorical: string[] = [];
    const missing: Record<string, number> = {};

    cols.forEach(col => {
      missing[col] = 0;
      let isNum = true;
      let hasVal = false;
      
      data.forEach(row => {
        const val = row[col];
        if (val === null || val === undefined || val === '') {
          missing[col]++;
        } else if (isNaN(Number(val))) {
          isNum = false;
        } else {
          hasVal = true;
        }
      });

      if (isNum && hasVal) {
        numerical.push(col);
      } else {
        categorical.push(col);
      }
    });

    const duplicateCount = data.length - new Set(data.map(d => JSON.stringify(d))).size;

    return {
      totalRecords: data.length,
      totalFeatures: cols.length,
      numericalFeatures: numerical,
      categoricalFeatures: categorical,
      missingValues: missing,
      duplicateCount
    };
  };

  const setDataset = (data: StudentRecord[], cols: string[]) => {
    setRawDataset(data);
    setProcessedDataset(data);
    setColumns(cols);
    setStats(calculateStats(data, cols));
  };

  const updateProcessedDataset = (data: StudentRecord[]) => {
    setProcessedDataset(data);
    setStats(calculateStats(data, columns));
  };

  const resetProcessedDataset = () => {
    setProcessedDataset(rawDataset);
    setStats(calculateStats(rawDataset, columns));
  };

  return (
    <DatasetContext.Provider value={{
      rawDataset,
      processedDataset,
      columns,
      stats,
      setDataset,
      updateProcessedDataset,
      resetProcessedDataset,
      calculateStats,
      isDarkMode,
      toggleDarkMode,
      isLoadingDefault,
      loadError
    }}>
      {children}
    </DatasetContext.Provider>
  );
}

export function useDataset() {
  const context = useContext(DatasetContext);
  if (context === undefined) {
    throw new Error('useDataset must be used within a DatasetProvider');
  }
  return context;
}
