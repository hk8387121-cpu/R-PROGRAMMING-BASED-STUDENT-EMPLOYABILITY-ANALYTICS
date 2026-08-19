# 05_salary_regression.R

library(readr)
library(dplyr)
library(caret)

data <- read_csv("../results/tables/cleaned_dataset.csv")

# Filter only placed students with salary > 0
salary_data <- data %>% filter(placement_status == "Placed", salary_package_lpa > 0)

# Select features
features <- salary_data %>% select(
  cgpa, technical_skill_score, soft_skill_score, internship_count,
  live_projects, work_experience_months, certifications, attendance_percentage,
  degree_percentage, hsc_percentage, ssc_percentage, salary_package_lpa
)

# Train-Test Split (80/20)
set.seed(42)
trainIndex <- createDataPartition(features$salary_package_lpa, p = .8, list = FALSE, times = 1)
dataTrain <- features[ trainIndex,]
dataTest  <- features[-trainIndex,]

# Train Linear Regression Model
lm_model <- lm(salary_package_lpa ~ ., data = dataTrain)

# Predictions
predictions <- predict(lm_model, newdata = dataTest)

# Calculate Metrics
actuals <- dataTest$salary_package_lpa
rss <- sum((predictions - actuals) ^ 2)
tss <- sum((actuals - mean(actuals)) ^ 2)
rsq <- 1 - rss/tss
mae <- mean(abs(predictions - actuals))
mse <- mean((predictions - actuals)^2)
rmse <- sqrt(mse)

cat("--- Salary Regression Evaluation ---\n")
cat("R-squared:", rsq, "\n")
cat("MAE:", mae, "\n")
cat("MSE:", mse, "\n")
cat("RMSE:", rmse, "\n")

saveRDS(lm_model, "../results/models/linear_regression_salary.rds")
