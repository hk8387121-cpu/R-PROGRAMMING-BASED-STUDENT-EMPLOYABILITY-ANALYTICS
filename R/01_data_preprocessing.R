# ============================================================
# 01_data_preprocessing.R
# ============================================================

# Load required libraries
library(readr)
library(dplyr)
library(tidyr)

# 1. Load the CSV dataset
cat("Loading dataset...\n")
data <- read_csv("../public/student_academic_placement_performance_dataset(1).csv", show_col_types = FALSE)

# 2. Keep exactly the 16 real columns and rename to snake_case
data <- data %>%
  select(
    Student_ID,
    SSC_Percentage,
    HSC_Percentage,
    Degree_Percentage,
    Entrance_Exam_Score,
    CGPA,
    Technical_Skill_Score,
    Soft_Skill_Score,
    Internship_Count,
    Live_Projects,
    Work_Experience_Months,
    Certifications,
    Attendance_Percentage,
    History_of_Backlogs,
    Placement_Status,
    Salary_Package_LPA
  ) %>%
  rename(
    student_id = Student_ID,
    ssc_percentage = SSC_Percentage,
    hsc_percentage = HSC_Percentage,
    degree_percentage = Degree_Percentage,
    entrance_exam_score = Entrance_Exam_Score,
    cgpa = CGPA,
    technical_skill_score = Technical_Skill_Score,
    soft_skill_score = Soft_Skill_Score,
    internship_count = Internship_Count,
    live_projects = Live_Projects,
    work_experience_months = Work_Experience_Months,
    certifications = Certifications,
    attendance_percentage = Attendance_Percentage,
    backlogs = History_of_Backlogs,
    placement_status = Placement_Status,
    salary_package_lpa = Salary_Package_LPA
  )

# 3. Inspect dimensions
cat("\nDataset Dimensions:\n")
print(dim(data))

# 4. Inspect structure
cat("\nDataset Structure:\n")
str(data)

# 5. Check missing values
cat("\nMissing Values per Column:\n")
print(colSums(is.na(data)))

# 6. Check duplicate rows
cat("\nDuplicate Rows:\n")
print(sum(duplicated(data)))

# 7. Check data types and Validate numerical ranges
cat("\nSummary Statistics:\n")
print(summary(data))

# 8. Prepare placement_status as a binary classification target
data <- data %>%
  mutate(
    placement_status = as.factor(ifelse(placement_status == 1 | placement_status == "Placed", "Placed", "Not Placed"))
  )

# 9. Prepare salary_package_lpa as a regression target
data <- data %>%
  mutate(
    salary_package_lpa = ifelse(is.na(salary_package_lpa), 0, salary_package_lpa)
  )

# 10. Save the cleaned dataset
dir.create("../results/tables", showWarnings = FALSE, recursive = TRUE)
write_csv(data, "../results/tables/cleaned_dataset.csv")
cat("\nData preprocessing complete. Cleaned dataset saved to ../results/tables/cleaned_dataset.csv\n")
