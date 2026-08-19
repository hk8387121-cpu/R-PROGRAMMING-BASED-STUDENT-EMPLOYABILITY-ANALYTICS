# Student Employability Analytics and Placement Prediction using R Programming

## Abstract
This project presents an end-to-end analytical pipeline using R Programming to evaluate student employability, predict placement outcomes, and estimate salary packages. By leveraging exploratory data analysis (EDA), statistical methods, and machine learning models (Logistic Regression, Decision Tree, Random Forest, Linear Regression), the system identifies the most influential factors bridging academic performance and industry requirements. An interactive React-based dashboard is provided as a presentation layer to visualize the findings.

## Problem Statement
Students possess varying levels of academic performance, technical skills, soft skills, internships, projects, and work experience. It is difficult to manually determine which factors contribute most to successful placement. This project uses R Programming and statistical/machine-learning techniques to analyze these factors and provide data-driven placement insights.

## Objectives
- To preprocess and clean student academic and employability data using R.
- To conduct Exploratory Data Analysis (EDA) to uncover trends and patterns.
- To build classification models predicting whether a student will be placed.
- To build regression models estimating the salary package for placed students.
- To present the R-based analytical results via an interactive web dashboard.

## Dataset
- **Name:** Student Academic Placement Performance Dataset
- **Format:** CSV
- **Size:** ~5,000 records
- **Context:** The dataset is used as the single source of truth for all analyses.

## Dataset Attributes
- `student_id`: Unique identifier
- `gender`: Student's gender
- `ssc_percentage`: Secondary School Certificate percentage
- `hsc_percentage`: Higher Secondary Certificate percentage
- `degree_percentage`: Undergraduate degree percentage
- `cgpa`: Cumulative Grade Point Average
- `entrance_exam_score`: Score in entrance examinations
- `technical_skill_score`: Quantified technical proficiency
- `soft_skill_score`: Quantified soft skills proficiency
- `internship_count`: Number of internships completed
- `live_projects`: Number of live projects completed
- `work_experience_months`: Prior work experience in months
- `certifications`: Number of certifications earned
- `attendance_percentage`: Academic attendance record
- `backlogs`: Number of academic backlogs
- `extracurricular_activities`: Participation in extracurriculars
- `placement_status`: Target Variable (Placed / Not Placed)
- `salary_package_lpa`: Target Variable for regression (Lakhs Per Annum)

## Modules
1. **Student Data Management and Preprocessing** (R)
2. **Exploratory Data Analysis** (R)
3. **Visualization and Placement Insights** (R)
4. **Placement Prediction and Salary Analysis** (R)
5. **Placement Insights and Reporting** (Dashboard)

## Methodology
The core methodology is structured as follows:
CSV Dataset → R Programming → Data Preprocessing → EDA → Statistical Analysis → Visualization → Feature Analysis → Machine Learning (Classification/Regression) → Model Evaluation → Output Results (Tables/Figures) → Interactive Dashboard Presentation.

## R Programming Techniques
- Data manipulation using `dplyr` and `tidyr`
- CSV parsing using `readr`
- Statistical summaries using `stats`
- Visualizations using `ggplot2` and `corrplot`

## Algorithms
- **Logistic Regression**: For baseline placement prediction (`glm` with `family = binomial`).
- **Decision Tree**: For interpretable placement rules (`rpart`).
- **Random Forest**: For high-accuracy placement prediction (`randomForest`).
- **Linear Regression**: For continuous salary estimation (`lm`).

## Model Evaluation
Models are evaluated on an 80/20 train/test split.
- **Classification metrics**: Accuracy, Precision, Recall, F1 Score, Confusion Matrix.
- **Regression metrics**: R², Adjusted R², MAE, MSE, RMSE.
*Note: Due to class imbalance, Recall and F1 Score are prioritized over raw Accuracy.*

## Salary Regression
The Linear Regression model (`lm()`) is trained exclusively on the subset of students who were successfully placed, predicting `salary_package_lpa` based on academic and skill features.

## Technology Used
### Analytical Layer
- **Programming Language:** R
- **Environment:** RStudio
- **Packages:** `readr`, `dplyr`, `tidyr`, `ggplot2`, `corrplot`, `caret`, `rpart`, `randomForest`

### Presentation Layer
- **Framework:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS
- **Visuals:** Recharts, Lucide Icons

## Hardware Requirements
- **Processor:** AMD Ryzen 5 7520U or equivalent
- **RAM:** 16 GB
- **Graphics:** AMD Radeon Graphics
- **Storage:** 477 GB
- **OS:** Windows 11

## Software Requirements
- R (v4.0+)
- RStudio
- Node.js (v18+) for Dashboard
- Web Browser (Chrome/Firefox/Edge)

## Project Architecture
```text
R Analysis Pipeline 
  → /R scripts 
  → /results (figures, models, tables) 
  → React Dashboard (reads/displays concepts and presentations)
```

## Installation
### R Environment
1. Install R and RStudio.
2. Open RStudio and run: `install.packages(c("readr", "dplyr", "tidyr", "ggplot2", "corrplot", "caret", "rpart", "randomForest"))`

### Dashboard Environment
1. Install Node.js.
2. Run `npm install` in the project root.

## How to Run R Analysis
1. Navigate to the `R/` directory.
2. Execute the scripts in numerical order:
   - `source("01_data_preprocessing.R")`
   - `source("02_eda.R")`
   - `...`
3. Check the `results/` folder for generated artifacts.

## How to Run Dashboard
1. Run `npm run dev` to start the local development server.
2. Open `http://localhost:3000` in your browser.

## Results
- Identification of key drivers for placement (e.g., CGPA, Internships, Technical Skills).
- Predictive models capable of evaluating new student profiles.
- Salary estimations providing realistic expectations for qualified candidates.

## Future Scope
- Integration of Deep Learning models.
- Direct API integration between R (e.g., Plumber API) and the React frontend.
- Expansion of the dataset to include multi-institutional records.

## Conclusion
This project successfully demonstrates the application of R Programming for comprehensive educational data mining. By cleanly separating the robust statistical backend (R) from the interactive presentation frontend (React), it provides a scalable architecture for analyzing student employability factors.
