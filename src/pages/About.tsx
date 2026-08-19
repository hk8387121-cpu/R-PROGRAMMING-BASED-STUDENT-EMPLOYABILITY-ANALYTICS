import React from 'react';
import { Info, Code2, Database, Monitor, FileCode2, BarChart3, LineChart, BookOpen } from 'lucide-react';
import { useDataset } from '../context/DatasetContext';

export default function About() {
  const { stats } = useDataset();
  
  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
          <Info className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">About Project</h2>
          <p className="text-slate-500">Student Employability Analytics Dashboard</p>
        </div>
      </div>
      
      {stats && stats.totalRecords > 0 && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl text-center">
          <span className="font-bold text-emerald-800 dark:text-emerald-400 text-lg">
            {stats.totalRecords.toLocaleString()} Students Analyzed using R-Based Analytics
          </span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-12">
        
        <section>
          <h3 className="text-xl font-bold mb-4 text-indigo-900 dark:text-indigo-300">Project Title</h3>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            Student Employability Analytics and Placement Prediction using R Programming
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-4 text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> Project Overview
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
            Student Employability Analytics and Placement Prediction using R Programming is a data analytics and machine-learning project that uses R Programming to preprocess and analyze student academic and employability data. The project applies exploratory data analysis, statistical techniques, visualization, classification and regression to identify factors influencing placement, predict placement outcomes and analyze salary packages. An interactive web dashboard is provided to visualize and present the results generated from the R-based analytical methodology.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Objective</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">To analyze student academic and employability data using R Programming to identify important placement factors, predict placement outcomes and analyze salary packages.</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Problem Statement</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Students possess different levels of academic performance, technical skills, soft skills, internships, projects and work experience. It is difficult to manually determine which factors contribute most to successful placement. This project uses R Programming and statistical/machine-learning techniques to analyze these factors and provide data-driven placement insights.</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Expected Outcome</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">The system analyzes student employability factors, identifies placement trends, predicts placement status, estimates salary packages and generates data-driven recommendations.</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-4 text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
            <Monitor className="w-5 h-5" /> Technology Used
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 font-medium">
            R Programming is used for data preprocessing, exploratory data analysis, statistical analysis, visualization, regression analysis and placement prediction. The web dashboard is used to present the results interactively.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">HARDWARE</h4>
              <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-100 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Component</th>
                    <th className="px-4 py-3 font-semibold">Specification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  <tr><td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">Processor</td><td className="px-4 py-2">AMD Ryzen 5 7520U</td></tr>
                  <tr><td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">RAM</td><td className="px-4 py-2">16 GB</td></tr>
                  <tr><td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">Graphics</td><td className="px-4 py-2">AMD Radeon Graphics</td></tr>
                  <tr><td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">Storage</td><td className="px-4 py-2">477 GB</td></tr>
                  <tr><td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">OS</td><td className="px-4 py-2">Windows 11</td></tr>
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">SOFTWARE</h4>
              <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-100 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Software</th>
                    <th className="px-4 py-3 font-semibold">Technology</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  <tr><td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">Programming</td><td className="px-4 py-2">R Programming</td></tr>
                  <tr><td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">IDE</td><td className="px-4 py-2">RStudio</td></tr>
                  <tr><td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">Data Processing</td><td className="px-4 py-2">readr, dplyr, tidyr</td></tr>
                  <tr><td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">Visualization</td><td className="px-4 py-2">ggplot2, corrplot</td></tr>
                  <tr><td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">Statistics</td><td className="px-4 py-2">stats</td></tr>
                  <tr><td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">Machine Learning</td><td className="px-4 py-2">caret, rpart, randomForest</td></tr>
                  <tr><td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">Regression</td><td className="px-4 py-2">Linear Regression</td></tr>
                  <tr><td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">Dataset</td><td className="px-4 py-2">Student Academic Placement Performance Dataset</td></tr>
                  <tr><td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">Dashboard</td><td className="px-4 py-2">Google AI Studio / React / TypeScript</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-4 text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
            <Database className="w-5 h-5" /> R Programming Modules
          </h3>
          <div className="space-y-6">
            <div className="border-l-4 border-indigo-500 pl-4 py-1">
              <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">1. Student Data Management and Preprocessing</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Uses R concepts for CSV import, data inspection, missing-value detection, duplicate detection, data cleaning, data transformation, data type conversion, and feature preparation.
              </p>
            </div>
            <div className="border-l-4 border-emerald-500 pl-4 py-1">
              <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">2. Exploratory Data Analysis</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Performs EDA using R. Includes statistical operations and analyzes all dataset features including academic percentages, skill scores, internships, attendance, backlogs, placement status, and salary package.
              </p>
            </div>
            <div className="border-l-4 border-sky-500 pl-4 py-1">
              <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">3. Visualization and Placement Insights</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Uses R visualization techniques primarily via the <code>ggplot2</code> package. Creates bar charts, histograms, scatter plots, box plots, and correlation heatmaps to display relationships.
              </p>
            </div>
            <div className="border-l-4 border-amber-500 pl-4 py-1">
              <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">4. Placement Prediction and Salary Analysis</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Uses R-based statistical and machine-learning methods. Evaluates placement classification using Accuracy, Precision, Recall, F1 Score, and Confusion Matrix. Predicts Salary Package using Linear Regression evaluated via R², MAE, MSE, and RMSE.
              </p>
            </div>
            <div className="border-l-4 border-rose-500 pl-4 py-1">
              <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">5. Placement Insights and Reporting</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Uses the results generated through R analysis to generate placement trends, important placement factors, academic/skill/internship/salary insights, model performance, and recommendations.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-4 text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
            <FileCode2 className="w-5 h-5" /> R Analysis & Methodology
          </h3>
          <p className="text-slate-700 dark:text-slate-300 mb-6">
            The core methodology of this project follows an R-based pipeline. The analytical layer is powered by R Programming (dplyr, tidyr, stats, ggplot2, caret) and the results are presented through this interactive dashboard interface.
          </p>

          <div className="space-y-6">
            <div className="bg-slate-900 text-slate-200 rounded-xl overflow-hidden border border-slate-800">
              <div className="bg-slate-950 px-4 py-2 text-xs text-slate-400 border-b border-slate-800 font-mono">01_data_preprocessing.R & 02_eda.R</div>
              <pre className="p-4 text-sm overflow-x-auto"><code className="language-r">{`library(readr)
library(dplyr)

data <- read_csv(
  "student_academic_placement_performance_dataset(1).csv"
)

dim(data)

str(data)

summary(data)

colSums(is.na(data))

mean(data$cgpa, na.rm = TRUE)

mean(data$technical_skill_score, na.rm = TRUE)

mean(data$soft_skill_score, na.rm = TRUE)

placement_rate <- mean(
  data$placement_status == 1,
  na.rm = TRUE
) * 100

placement_rate`}</code></pre>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}