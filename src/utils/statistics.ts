import { sampleCorrelation } from 'simple-statistics';

export function calculateCorrelationMatrix(data: any[], numCols: string[]) {
  const matrix: Record<string, Record<string, number>> = {};
  
  // Initialize matrix
  for (const col1 of numCols) {
    matrix[col1] = {};
    for (const col2 of numCols) {
      matrix[col1][col2] = 0;
    }
  }

  // Calculate pairs
  for (let i = 0; i < numCols.length; i++) {
    for (let j = i; j < numCols.length; j++) {
      const col1 = numCols[i];
      const col2 = numCols[j];
      
      const arr1: number[] = [];
      const arr2: number[] = [];
      
      data.forEach(row => {
        const val1 = Number(row[col1]);
        const val2 = Number(row[col2]);
        if (!isNaN(val1) && !isNaN(val2)) {
          arr1.push(val1);
          arr2.push(val2);
        }
      });

      let corr = 0;
      if (arr1.length > 1) {
        try {
          corr = sampleCorrelation(arr1, arr2);
        } catch {
          corr = 0;
        }
      }
      
      matrix[col1][col2] = corr;
      matrix[col2][col1] = corr;
    }
  }
  
  return matrix;
}
