# 01_data_preprocessing.R

# Load required libraries
library(readr)
library(dplyr)
library(tidyr)

# 1. Load the CSV dataset
cat("Loading dataset...\n")
data <- read_csv("../public/student_academic_placement_performance_dataset(1).csv")

# 2. Inspect dimensions
cat("\nDataset Dimensions:\n")
dim(data)

# 3. Inspect structure
cat("\nDataset Structure:\n")
str(data)

# 4. Check missing values
cat("\nMissing Values per Column:\n")
colSums(is.na(data))

# 5. Check duplicate rows
cat("\nDuplicate Rows:\n")
sum(duplicated(data))

# 6. Check data types and 7. Validate numerical ranges
cat("\nSummary Statistics:\n")
summary(data)

# 8. Convert categorical variables to factors
data <- data %>%
  mutate(
    gender = as.factor(gender),
    extracurricular_activities = as.factor(extracurricular_activities)
  )

# 9. Prepare placement_status as a binary classification target
data <- data %>%
  mutate(
    placement_status = as.factor(ifelse(placement_status == 1 | placement_status == "Placed", "Placed", "Not Placed"))
  )

# 10. Prepare salary_package_lpa as a regression target
data <- data %>%
  mutate(
    salary_package_lpa = ifelse(is.na(salary_package_lpa), 0, salary_package_lpa)
  )

# 11. Create a cleaned dataset
cleaned_data <- data

# 12. Save the cleaned dataset
write_csv(cleaned_data, "../results/tables/cleaned_dataset.csv")
cat("\nData preprocessing complete. Cleaned dataset saved to results/tables/cleaned_dataset.csv\n")
