# Student Employability Analytics and Placement Prediction using R Programming

## 1. Abstract
This project presents an end-to-end analytical pipeline using R Programming to evaluate student employability, predict placement outcomes, and estimate salary packages. By leveraging exploratory data analysis (EDA), statistical methods, and machine learning models (Logistic Regression, Decision Tree, Random Forest, Linear Regression), the system identifies the most influential factors bridging academic performance and industry requirements. An interactive React-based dashboard is provided as a presentation layer to visualize the findings.

## 2. Problem Statement
Students possess varying levels of academic performance, technical skills, soft skills, internships, projects, and work experience. It is difficult to manually determine which factors contribute most to successful placement. This project uses R Programming and statistical/machine-learning techniques to analyze these factors and provide data-driven placement insights.

## 3. Objectives
- To preprocess and clean student academic and employability data using R.
- To conduct Exploratory Data Analysis (EDA) to uncover trends and patterns.
- To build classification models predicting whether a student will be placed.
- To build regression models estimating the salary package for placed students.
- To present the R-based analytical results via an interactive web dashboard.

## 4. Dataset Description
- **Name:** Student Academic Placement Performance Dataset
- **Format:** CSV
- **Size:** ~5,000 records
- **Context:** The dataset is used as the single source of truth for all analyses.

## 5. Dataset Attributes

- `student_id`: Unique identifier for each student
- `ssc_percentage`: Secondary School Certificate (10th) percentage
- `hsc_percentage`: Higher Secondary Certificate (12th) percentage
- `degree_percentage`: Undergraduate degree percentage
- `entrance_exam_score`: Score in entrance examinations
- `cgpa`: Cumulative Grade Point Average
- `technical_skill_score`: Quantified technical proficiency
- `soft_skill_score`: Quantified soft skills proficiency
- `internship_count`: Number of internships completed
- `live_projects`: Number of live projects completed
- `work_experience_months`: Prior work experience in months
- `certifications`: Number of certifications earned
- `attendance_percentage`: Academic attendance record
- `backlogs`: Number of academic backlogs
- `placement_status`: Target Variable (Placed / Not Placed)
- `salary_package_lpa`: Target Variable for regression (Lakhs Per Annum)

## 6. Project Modules
1. **Student Data Management and Preprocessing** (R)
2. **Exploratory Data Analysis** (R)
3. **Visualization and Placement Insights** (R)
4. **Placement Prediction and Salary Analysis** (R)
5. **Placement Insights and Reporting** (Dashboard)

## 7. Methodology
The core methodology is structured as follows:
CSV Dataset → R Programming → Data Preprocessing → EDA → Statistical Analysis → Visualization → Feature Analysis → Machine Learning (Classification/Regression) → Model Evaluation → Output Results (Tables/Figures) → Interactive Dashboard Presentation.

## 8. R Programming Techniques
- Data manipulation using `dplyr` and `tidyr`
- CSV parsing using `readr`
- Statistical summaries using `stats`
- Visualizations using `ggplot2` and `corrplot`

## 9. Algorithms
- **Logistic Regression**: For baseline placement prediction (`glm` with `family = binomial`).
- **Decision Tree**: For interpretable placement rules (`rpart`).
- **Random Forest**: For high-accuracy placement prediction (`randomForest`).
- **Linear Regression**: For continuous salary estimation (`lm`).

## 10. Model Evaluation
Models are evaluated on an 80/20 train/test split.
- **Classification metrics**: Accuracy, Precision, Recall, F1 Score, Confusion Matrix, Balanced Accuracy, ROC-AUC.
- **Regression metrics**: R², Adjusted R², MAE, MSE, RMSE.
*Note: Due to class imbalance, Recall and F1 Score are prioritized over raw Accuracy.*

## 11. Salary Regression
The Linear Regression model (`lm()`) is trained exclusively on the subset of students who were successfully placed, predicting `salary_package_lpa` based on academic and skill features.

## 12. Technology Used
### Analytical Layer
- **Programming Language:** R
- **Environment:** RStudio
- **Packages:** `readr`, `dplyr`, `tidyr`, `ggplot2`, `corrplot`, `caret`, `rpart`, `randomForest`, `pROC`

### Presentation Layer
- **Framework:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS
- **Visuals:** Recharts, Lucide Icons

## 13. Hardware Requirements
- **Processor:** AMD Ryzen 5 7520U or equivalent
- **RAM:** 16 GB
- **Graphics:** AMD Radeon Graphics
- **Storage:** 477 GB
- **OS:** Windows 11

## 14. Software Requirements
- R (v4.0+)
- RStudio
- Node.js (v18+) for Dashboard
- Web Browser (Chrome/Firefox/Edge)

## 15. Project Architecture
```text
                    STUDENT CSV DATASET
                            │
                            ▼
                  R DATA IMPORT
                            │
                            ▼
                  DATA PREPROCESSING
                            │
                            ▼
                  EXPLORATORY DATA ANALYSIS
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
      STATISTICAL ANALYSIS          VISUALIZATION
              │                           │
              └─────────────┬─────────────┘
                            ▼
                   FEATURE ANALYSIS
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
      PLACEMENT PREDICTION          SALARY REGRESSION
              │                           │
       ┌──────┼──────┐                    │
       ▼      ▼      ▼                    ▼
    Logistic Tree Random Forest      Linear Regression
       │      │      │                    │
       └──────┴──────┘                    │
              │                           │
              ▼                           ▼
        MODEL COMPARISON          REGRESSION METRICS
              │                           │
              └─────────────┬─────────────┘
                            ▼
                    PLACEMENT INSIGHTS
                            │
                            ▼
                 REACT WEB DASHBOARD
                            │
                            ▼
                STUDENT / ADMIN USER
```

## 16. Project Structure

```text
R-PROGRAMMING-BASED-STUDENT-EMPLOYABILITY-ANALYTICS/
│
├── public/
│   │
│   └── student_academic_placement_performance_dataset(1).csv
│
├── R/
│   │
│   ├── 01_data_preprocessing.R
│   ├── 02_eda.R
│   ├── 03_visualization.R
│   ├── 04_placement_prediction.R
│   ├── 05_salary_regression.R
│   ├── 06_model_comparison.R
│   └── 07_final_report.R
│
├── results/
│   │
│   ├── figures/
│   │   ├── ssc_distribution.png
│   │   ├── hsc_distribution.png
│   │   ├── degree_distribution.png
│   │   ├── cgpa_distribution.png
│   │   ├── entrance_exam_distribution.png
│   │   ├── technical_skill_distribution.png
│   │   ├── soft_skill_distribution.png
│   │   ├── internship_distribution.png
│   │   ├── live_projects_distribution.png
│   │   ├── work_experience_distribution.png
│   │   ├── certifications_distribution.png
│   │   ├── attendance_distribution.png
│   │   ├── backlog_distribution.png
│   │   ├── placement_distribution.png
│   │   ├── salary_distribution.png
│   │   ├── placement_rate_cgpa.png
│   │   ├── placement_rate_internships.png
│   │   ├── placement_rate_technical_skill.png
│   │   ├── placement_rate_soft_skill.png
│   │   ├── placement_rate_attendance.png
│   │   ├── placement_rate_backlogs.png
│   │   ├── placement_rate_projects.png
│   │   ├── placement_rate_experience.png
│   │   ├── placement_rate_certifications.png
│   │   └── correlation_heatmap.png
│   │
│   ├── tables/
│   │   ├── cleaned_dataset.csv
│   │   ├── descriptive_statistics.csv
│   │   ├── placement_statistics.csv
│   │   ├── correlation_matrix.csv
│   │   ├── classification_metrics.csv
│   │   └── salary_regression_metrics.csv
│   │
│   └── models/
│       ├── logistic_regression_model.rds
│       ├── decision_tree_model.rds
│       ├── random_forest_model.rds
│       └── salary_regression_model.rds
│
├── src/
│   │...
```

## 17. RStudio Setup
1. Open RStudio.
2. Set your working directory to the `R/` folder of this project.
3. Install required packages:
   ```R
   install.packages(c("readr", "dplyr", "tidyr", "ggplot2", "corrplot", "caret", "rpart", "randomForest", "pROC"))
   ```
4. Run scripts `01` through `07` in sequence to generate the dataset tables, figures, models, and reports.
5. All results will be saved in the `results/` directory.

## 18. Dashboard Setup
1. Ensure Node.js is installed.
2. Open a terminal in the root project directory.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to the local URL (usually `http://localhost:3000`).

## 19. Results

- **Dynamic Evaluation**: Results are generated dynamically by scripts `01` through `07`.
- **Note**: Statistical association does not necessarily imply causation.

## 20. Future Scope
- **Advanced Ensembles:** Implement XGBoost or Neural Networks for improved F1 scores on the minority class (Placed).
- **Time-Series Tracking:** Track student semester-over-semester growth.
- **API Integration:** Serve the generated `.rds` models via a Plumber API for real-time inference in production.

## 21. Conclusion
By separating the analytical foundation (R) from the interactive presentation layer (React), this project successfully provides a robust, scientifically rigorous, and highly accessible Employability Analytics Dashboard. The integration of statistical data modeling enables data-driven decision-making for educators and students.
