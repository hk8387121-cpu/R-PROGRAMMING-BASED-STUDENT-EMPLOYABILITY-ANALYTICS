# 02_eda.R

library(readr)
library(dplyr)

# Load cleaned dataset
data <- read_csv("../results/tables/cleaned_dataset.csv")

# Ensure placement_status is a factor
data$placement_status <- as.factor(data$placement_status)

# Basic Statistical Summary Function
print_summary <- function(feature_name, feature_data) {
  cat(sprintf("\n--- %s ---\n", feature_name))
  cat(sprintf("Mean:   %f\n", mean(feature_data, na.rm = TRUE)))
  cat(sprintf("Median: %f\n", median(feature_data, na.rm = TRUE)))
  cat(sprintf("SD:     %f\n", sd(feature_data, na.rm = TRUE)))
  cat(sprintf("Min:    %f\n", min(feature_data, na.rm = TRUE)))
  cat(sprintf("Max:    %f\n", max(feature_data, na.rm = TRUE)))
  cat("Quartiles:\n")
  print(quantile(feature_data, na.rm = TRUE))
}

# Analyze features
features_to_analyze <- c(
  "ssc_percentage", "hsc_percentage", "degree_percentage", "cgpa", 
  "entrance_exam_score", "technical_skill_score", "soft_skill_score", 
  "internship_count", "live_projects", "work_experience_months", 
  "certifications", "attendance_percentage", "backlogs", "salary_package_lpa"
)

for (feature in features_to_analyze) {
  if (feature %in% colnames(data)) {
    print_summary(feature, data[[feature]])
  }
}

# Compare PLACED vs NOT PLACED
cat("\n=== PLACED VS NOT PLACED COMPARISON ===\n")
comparison <- data %>%
  group_by(placement_status) %>%
  summarise(
    avg_cgpa = mean(cgpa, na.rm = TRUE),
    avg_tech_skill = mean(technical_skill_score, na.rm = TRUE),
    avg_soft_skill = mean(soft_skill_score, na.rm = TRUE),
    avg_internships = mean(internship_count, na.rm = TRUE),
    avg_attendance = mean(attendance_percentage, na.rm = TRUE),
    avg_backlogs = mean(backlogs, na.rm = TRUE)
  )

print(comparison)
