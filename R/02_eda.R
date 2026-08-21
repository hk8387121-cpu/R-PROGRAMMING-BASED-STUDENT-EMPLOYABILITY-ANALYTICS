# 02_eda.R

library(readr)
library(dplyr)
library(tidyr)

# Load cleaned dataset
data <- read_csv("../results/tables/cleaned_dataset.csv")

# Ensure placement_status is a factor
data$placement_status <- as.factor(data$placement_status)

# Features to analyze
features_to_analyze <- c(
  "ssc_percentage", "hsc_percentage", "degree_percentage", "cgpa", 
  "entrance_exam_score", "technical_skill_score", "soft_skill_score", 
  "internship_count", "live_projects", "work_experience_months", 
  "certifications", "attendance_percentage", "backlogs", "salary_package_lpa"
)

# Calculate descriptive statistics
desc_stats <- data.frame(
  Feature = character(),
  Mean = numeric(),
  Median = numeric(),
  SD = numeric(),
  Min = numeric(),
  Max = numeric(),
  Q1 = numeric(),
  Q3 = numeric(),
  stringsAsFactors = FALSE
)

for (feature in features_to_analyze) {
  if (feature %in% colnames(data)) {
    feature_data <- data[[feature]]
    desc_stats <- rbind(desc_stats, data.frame(
      Feature = feature,
      Mean = mean(feature_data, na.rm = TRUE),
      Median = median(feature_data, na.rm = TRUE),
      SD = sd(feature_data, na.rm = TRUE),
      Min = min(feature_data, na.rm = TRUE),
      Max = max(feature_data, na.rm = TRUE),
      Q1 = quantile(feature_data, 0.25, na.rm = TRUE),
      Q3 = quantile(feature_data, 0.75, na.rm = TRUE)
    ))
  }
}

# Save descriptive statistics
write_csv(desc_stats, "../results/tables/descriptive_statistics.csv")
cat("\nDescriptive statistics saved to results/tables/descriptive_statistics.csv\n")

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
write_csv(comparison, "../results/tables/placement_statistics.csv")
cat("Placement statistics saved to results/tables/placement_statistics.csv\n")
