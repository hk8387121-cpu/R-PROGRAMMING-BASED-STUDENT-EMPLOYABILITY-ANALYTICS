export interface StudentRecord {
  [key: string]: any;
}

export interface DatasetStats {
  totalRecords: number;
  totalFeatures: number;
  numericalFeatures: string[];
  categoricalFeatures: string[];
  missingValues: Record<string, number>;
  duplicateCount: number;
}

export interface ProcessedDatasetInfo {
  data: StudentRecord[];
  columns: string[];
  stats: DatasetStats | null;
}
