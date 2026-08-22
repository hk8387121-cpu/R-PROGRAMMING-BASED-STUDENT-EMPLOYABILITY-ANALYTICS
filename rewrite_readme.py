with open("README.md", "r") as f:
    text = f.read()

import re

# Rewrite Dataset Attributes
new_attributes = """- `student_id`: Unique identifier for each student
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
- `salary_package_lpa`: Target Variable for regression (Lakhs Per Annum)"""
text = re.sub(r'## 5\. Dataset Attributes.*?## 6\.', '## 5. Dataset Attributes\n\n' + new_attributes + '\n\n## 6.', text, flags=re.DOTALL)

# Rewrite Results
new_results = """## 19. Results

- **Dynamic Evaluation**: Results are generated dynamically by scripts `01` through `07`.
- **Note**: Statistical association does not necessarily imply causation."""
text = re.sub(r'## 19\. Results.*?## 20\.', new_results + '\n\n## 20.', text, flags=re.DOTALL)

# Rewrite Project Structure
new_structure = """## 16. Project Structure

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
```"""
text = re.sub(r'## 16\. Project Structure.*?## 17\.', new_structure + '\n\n## 17.', text, flags=re.DOTALL)

with open("README.md", "w") as f:
    f.write(text)
