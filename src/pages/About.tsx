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
            <Monitor className="w-5 h-5" /> Project Technology
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 font-medium">
            R Programming is used for data preprocessing, exploratory data analysis, statistical analysis, visualization, regression analysis and placement prediction. The web dashboard is used to present the results interactively.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-lg border border-slate-100 dark:border-slate-700">
              <h4 className="font-bold mb-3 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">Core Platform</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><strong className="text-slate-700 dark:text-slate-300">Primary Programming Language:</strong> R Programming</li>
                <li><strong className="text-slate-700 dark:text-slate-300">Development Environment:</strong> RStudio</li>
                <li><strong className="text-slate-700 dark:text-slate-300">Dataset:</strong> Student Academic Placement Performance Dataset (CSV)</li>
                <li><strong className="text-slate-700 dark:text-slate-300">Dashboard:</strong> Google AI Studio / React-based interface</li>
              </ul>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-lg border border-slate-100 dark:border-slate-700">
              <h4 className="font-bold mb-3 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">R Packages & Libraries</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><strong className="text-slate-700 dark:text-slate-300">Data Processing:</strong> dplyr, tidyr, readr</li>
                <li><strong className="text-slate-700 dark:text-slate-300">Data Visualization:</strong> ggplot2, corrplot</li>
                <li><strong className="text-slate-700 dark:text-slate-300">Statistical Analysis:</strong> R stats</li>
                <li><strong className="text-slate-700 dark:text-slate-300">Machine Learning:</strong> caret, randomForest, rpart</li>
              </ul>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-lg border border-slate-100 dark:border-slate-700">
              <h4 className="font-bold mb-3 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">Analytical Models</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><strong className="text-slate-700 dark:text-slate-300">Placement Prediction:</strong> Logistic Regression, Decision Tree, Random Forest</li>
                <li><strong className="text-slate-700 dark:text-slate-300">Salary Analysis:</strong> Linear Regression</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-4 text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
            <Database className="w-5 h-5" /> R Programming Modules
          </h3>
          <div className="space-y-6">
            <div className="border-l-4 border-indigo-500 pl-4 py-1">
              <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">Module 1 – Student Data Management and Preprocessing</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Uses R concepts for CSV import, data inspection, missing-value detection, duplicate detection, data cleaning, data transformation, data type conversion, and feature preparation. Utilizes R functions and packages such as <code>read.csv()</code>, <code>readr</code>, <code>dplyr</code>, and <code>tidyr</code>.
              </p>
            </div>
            <div className="border-l-4 border-emerald-500 pl-4 py-1">
              <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">Module 2 – Exploratory Data Analysis</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Performs EDA using R. Includes statistical operations like <code>summary()</code>, <code>mean()</code>, <code>median()</code>, <code>sd()</code>, <code>min()</code>, <code>max()</code>, <code>quantile()</code>, and <code>table()</code>. Analyzes all dataset features including academic percentages, skill scores, internships, attendance, backlogs, placement status, and salary package.
              </p>
            </div>
            <div className="border-l-4 border-sky-500 pl-4 py-1">
              <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">Module 3 – Visualization and Placement Insights</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Uses R visualization techniques primarily via the <code>ggplot2</code> package. Creates bar charts, pie/donut charts, histograms, scatter plots, box plots, and correlation heatmaps to display relationships (e.g., CGPA vs Placement, Technical Skill vs Placement, Salary vs CGPA). The dashboard displays the results of these R-based analyses.
              </p>
            </div>
            <div className="border-l-4 border-amber-500 pl-4 py-1">
              <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">Module 4 – Placement Prediction and Salary Analysis</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Uses R-based statistical and machine-learning methods (<code>stats</code>, <code>caret</code>, <code>rpart</code>, <code>randomForest</code>). Evaluates placement classification (Logistic Regression, Decision Tree, Random Forest) using Accuracy, Precision, Recall, F1 Score, and Confusion Matrix. Predicts Salary Package using Linear Regression evaluated via R², MAE, MSE, and RMSE.
              </p>
            </div>
            <div className="border-l-4 border-rose-500 pl-4 py-1">
              <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">Module 5 – Placement Insights and Reporting</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Uses the results generated through R analysis to generate placement trends, important placement factors, academic/skill/internship/salary insights, model performance, and recommendations. The dashboard presents these results in a visually understandable form.
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
              <div className="bg-slate-950 px-4 py-2 text-xs text-slate-400 border-b border-slate-800 font-mono">1_data_preprocessing.R</div>
              <pre className="p-4 text-sm overflow-x-auto"><code className="language-r">{`# Load dataset
data <- read.csv("student_academic_placement_performance_dataset.csv")

# Dataset information
dim(data)
str(data)
summary(data)

# Placement distribution
table(data$Placement_Status)

# Average CGPA
mean(data$CGPA, na.rm = TRUE)

# Average technical skill
mean(data$Technical_Skill_Score, na.rm = TRUE)

# Placement rate
placement_rate <- mean(data$Placement_Status == "Placed",
                       na.rm = TRUE) * 100`}</code></pre>
            </div>

            <div className="bg-slate-900 text-slate-200 rounded-xl overflow-hidden border border-slate-800">
              <div className="bg-slate-950 px-4 py-2 text-xs text-slate-400 border-b border-slate-800 font-mono">2_visualization.R</div>
              <pre className="p-4 text-sm overflow-x-auto"><code className="language-r">{`library(ggplot2)

ggplot(data, aes(x = CGPA, fill = Placement_Status)) +
  geom_histogram(bins = 20) +
  labs(
    title = "CGPA Distribution by Placement Status",
    x = "CGPA",
    y = "Number of Students"
  )`}</code></pre>
            </div>

            <div className="bg-slate-900 text-slate-200 rounded-xl overflow-hidden border border-slate-800">
              <div className="bg-slate-950 px-4 py-2 text-xs text-slate-400 border-b border-slate-800 font-mono">3_regression_analysis.R</div>
              <pre className="p-4 text-sm overflow-x-auto"><code className="language-r">{`model <- lm(
  Salary_Package ~ CGPA +
  Technical_Skill_Score +
  Soft_Skill_Score +
  Internship_Count +
  Work_Experience,
  data = data
)

summary(model)`}</code></pre>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}