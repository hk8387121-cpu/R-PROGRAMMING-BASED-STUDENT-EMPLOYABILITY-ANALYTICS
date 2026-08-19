export class LinearRegression {
  private weights: number[];
  private bias: number;
  private learningRate: number;
  private iterations: number;

  constructor(learningRate = 0.001, iterations = 1000) {
    this.learningRate = learningRate;
    this.iterations = iterations;
    this.weights = [];
    this.bias = 0;
  }

  train(X: number[][], y: number[]) {
    const m = X.length;
    const n = X[0].length;
    this.weights = new Array(n).fill(0);
    this.bias = 0;

    for (let iter = 0; iter < this.iterations; iter++) {
      let dW = new Array(n).fill(0);
      let db = 0;

      for (let i = 0; i < m; i++) {
        let y_pred = this.bias;
        for (let j = 0; j < n; j++) {
          y_pred += this.weights[j] * X[i][j];
        }
        const error = y_pred - y[i];
        
        for (let j = 0; j < n; j++) {
          dW[j] += (2 / m) * error * X[i][j];
        }
        db += (2 / m) * error;
      }

      for (let j = 0; j < n; j++) {
        this.weights[j] -= this.learningRate * dW[j];
      }
      this.bias -= this.learningRate * db;
    }
  }

  predict(X: number[]): number {
    let y_pred = this.bias;
    for (let i = 0; i < X.length; i++) {
      y_pred += this.weights[i] * X[i];
    }
    return y_pred;
  }
}
