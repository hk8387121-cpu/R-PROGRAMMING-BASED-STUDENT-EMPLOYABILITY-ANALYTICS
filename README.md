# Student Employability Analytics and Placement Prediction using R Programming

## 1. Abstract

This project presents an end-to-end **Student Employability Analytics and Placement Prediction system using R Programming**. The system analyzes academic performance and employability-related attributes to study their association with student placement outcomes and salary packages.

The analytical pipeline includes data preprocessing, Exploratory Data Analysis (EDA), statistical analysis, data visualization, machine learning-based placement classification, and salary regression. Three classification algorithms—**Logistic Regression, Decision Tree, and Random Forest**—are evaluated using multiple performance metrics. **Linear Regression** is used to estimate salary packages for placed students.

A **React + TypeScript web dashboard** is provided as the presentation layer for displaying analytical results and student-level insights.

The complete available dataset is treated as the **single source of truth**. No synthetic student attributes, artificial records, or hard-coded analytical results are used.

> **Note:** Statistical association does not necessarily imply causation.

---

## 2. Problem Statement

Students possess different levels of academic performance, technical skills, soft skills, internships, projects, certifications, attendance, and work experience. It can be difficult to determine which factors are associated with successful placement outcomes and how these characteristics relate to salary packages.

This project uses **R Programming, statistical analysis, visualization techniques, and machine learning algorithms** to analyze student employability data, predict placement status, estimate salary packages, compare predictive models, and provide data-driven placement insights.

---

## 3. Objectives

- To preprocess and clean student academic and employability data using R Programming.
- To analyze the complete available student dataset without arbitrary truncation or sampling.
- To perform Exploratory Data Analysis (EDA) and identify important statistical patterns.
- To visualize academic, employability, placement, and salary-related characteristics.
- To calculate placement rates across different academic and employability ranges.
- To develop classification models for predicting student placement status.
- To compare Logistic Regression, Decision Tree, and Random Forest using multiple evaluation metrics.
- To develop a Linear Regression model for salary estimation among placed students.
- To generate dynamic analytical tables, figures, model files, and reports.
- To present the R-based analytical results through an interactive React dashboard.
- To provide data-driven insights that can support students and placement administrators.

---

## 4. Dataset Description

- **Dataset Name:** Student Academic Placement Performance Dataset
- **Format:** CSV
- **Records:** Approximately 5,000 student records
- **Dataset Role:** The complete available dataset is the single source of truth for the analytical pipeline.
- **Classification Target:** `placement_status`
- **Salary Regression Target:** `salary_package_lpa`
- **Data Processing:** The original dataset columns are standardized into a consistent `snake_case` format before analysis.

The project does not add synthetic student attributes or artificial records.

---

## 5. Dataset Attributes

The project uses the following actual dataset attributes:

| No. | Attribute | Description |
|---:|---|---|
| 1 | `student_id` | Unique identifier for each student |
| 2 | `ssc_percentage` | Secondary School Certificate (10th) percentage |
| 3 | `hsc_percentage` | Higher Secondary Certificate (12th) percentage |
| 4 | `degree_percentage` | Undergraduate degree percentage |
| 5 | `entrance_exam_score` | Entrance examination score |
| 6 | `cgpa` | Cumulative Grade Point Average |
| 7 | `technical_skill_score` | Technical skill proficiency score |
| 8 | `soft_skill_score` | Soft skill proficiency score |
| 9 | `internship_count` | Number of internships completed |
| 10 | `live_projects` | Number of live projects completed |
| 11 | `work_experience_months` | Previous work experience in months |
| 12 | `certifications` | Number of certifications earned |
| 13 | `attendance_percentage` | Academic attendance percentage |
| 14 | `backlogs` | Number of academic backlogs |
| 15 | `placement_status` | Placement outcome: Placed / Not Placed |
| 16 | `salary_package_lpa` | Salary package in Lakhs Per Annum (LPA) |

---

## 6. Project Modules

### Module 1 – Student Data Management and Preprocessing

- Import the original CSV dataset.
- Validate the dataset structure and required columns.
- Standardize column names into `snake_case`.
- Handle missing and invalid values where required.
- Convert categorical variables into appropriate formats.
- Preserve the complete available dataset.
- Generate `cleaned_dataset.csv`.

### Module 2 – Exploratory Data Analysis

- Calculate descriptive statistics.
- Analyze academic performance.
- Analyze employability-related characteristics.
- Compare placed and non-placed students.
- Calculate placement statistics.
- Generate correlation analysis.

### Module 3 – Visualization and Placement Insights

- Generate 25 analytical visualizations.
- Visualize academic performance distributions.
- Visualize employability-related distributions.
- Visualize placement and salary distributions.
- Calculate placement rates across different feature ranges.
- Generate a correlation heatmap.

### Module 4 – Placement Prediction and Salary Analysis

- Split the dataset into training and testing sets using an 80/20 stratified split for classification.
- Train Logistic Regression.
- Train Decision Tree.
- Train Random Forest.
- Evaluate all classification models using multiple metrics.
- Train Linear Regression for salary estimation among placed students.
- Evaluate salary predictions using regression metrics.

### Module 5 – Placement Insights and Reporting

- Compare classification models dynamically.
- Rank models using actual evaluation metrics.
- Identify the best-performing model based on the defined ranking criteria.
- Generate analytical findings.
- Generate recommendations.
- Produce a dynamic final analytical report.
- Present results through the React dashboard.

---

## 7. Project Task

**Task:**

Analyze student academic and employability data to identify factors associated with placement outcomes, predict placement status, estimate salary packages, compare machine learning models, and generate data-driven placement insights.

---

## 8. Specific Parameters

The project analyzes:

- SSC percentage
- HSC percentage
- Degree percentage
- Entrance examination score
- CGPA
- Technical skill score
- Soft skill score
- Internship count
- Live projects
- Work experience
- Certifications
- Attendance percentage
- Backlogs
- Placement status
- Salary package

The project also performs:

- Statistical analysis
- Exploratory data analysis
- Data visualization
- Correlation analysis
- Classification
- Regression analysis
- Model comparison
- Placement-rate analysis
- Dynamic report generation

---

## 9. Methodology

The overall analytical workflow is:

```text
Student CSV Dataset
        |
        v
R Data Import
        |
        v
Data Validation
        |
        v
Data Preprocessing
        |
        v
Exploratory Data Analysis
        |
        +----------------------+
        |                      |
        v                      v
Statistical Analysis     Visualization
        |                      |
        +----------+-----------+
                   |
                   v
             Feature Analysis
                   |
          +--------+--------+
          |                 |
          v                 v
Placement Prediction   Salary Regression
          |                 |
    +-----+-----+           |
    |     |     |           |
    v     v     v           v
 Logistic Decision Random  Linear
Regression Tree    Forest Regression
    |     |     |           |
    +-----+-----+           |
          |                 |
          v                 v
   Model Comparison    Regression Metrics
          |                 |
          +--------+--------+
                   |
                   v
          Placement Insights
                   |
                   v
          Dynamic Final Report
                   |
                   v
          React Web Dashboard