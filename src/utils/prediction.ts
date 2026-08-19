export function standardize(X: number[][]): { X_scaled: number[][], means: number[], stds: number[] } {
  const m = X.length;
  if (m === 0) return { X_scaled: [], means: [], stds: [] };
  const n = X[0].length;
  
  const means = new Array(n).fill(0);
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      means[j] += X[i][j];
    }
  }
  for (let j = 0; j < n; j++) {
    means[j] /= m;
  }

  const stds = new Array(n).fill(0);
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      stds[j] += Math.pow(X[i][j] - means[j], 2);
    }
  }
  for (let j = 0; j < n; j++) {
    stds[j] = Math.sqrt(stds[j] / m);
    if (stds[j] === 0) stds[j] = 1; // Prevent division by zero
  }

  const X_scaled = X.map(row => 
    row.map((val, j) => (val - means[j]) / stds[j])
  );

  return { X_scaled, means, stds };
}

export function transformWithScaler(X: number[], means: number[], stds: number[]): number[] {
  return X.map((val, j) => (val - means[j]) / stds[j]);
}

export class LogisticRegression {
  private weights: number[];
  private bias: number;
  private learningRate: number;
  private iterations: number;

  constructor(learningRate = 0.01, iterations = 1000) {
    this.learningRate = learningRate;
    this.iterations = iterations;
    this.weights = [];
    this.bias = 0;
  }

  private sigmoid(z: number): number {
    return 1 / (1 + Math.exp(-z));
  }

  train(X: number[][], y: number[]) {
    const m = X.length;
    const n = X[0].length;
    this.weights = new Array(n).fill(0);
    this.bias = 0;

    for (let i = 0; i < this.iterations; i++) {
      let dZ = new Array(m).fill(0);
      let dW = new Array(n).fill(0);
      let db = 0;

      for (let j = 0; j < m; j++) {
        let z = this.bias;
        for (let k = 0; k < n; k++) {
          z += this.weights[k] * X[j][k];
        }
        const a = this.sigmoid(z);
        dZ[j] = a - y[j];

        for (let k = 0; k < n; k++) {
          dW[k] += (1 / m) * dZ[j] * X[j][k];
        }
        db += (1 / m) * dZ[j];
      }

      for (let k = 0; k < n; k++) {
        this.weights[k] -= this.learningRate * dW[k];
      }
      this.bias -= this.learningRate * db;
    }
  }

  predictProb(X: number[]): number {
    let z = this.bias;
    for (let i = 0; i < X.length; i++) {
      z += this.weights[i] * X[i];
    }
    return this.sigmoid(z);
  }

  predict(X: number[]): number {
    return this.predictProb(X) >= 0.5 ? 1 : 0;
  }
}
