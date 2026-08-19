# 04_placement_prediction.R

library(readr)
library(caret)
library(rpart)
library(randomForest)
library(dplyr)

data <- read_csv("../results/tables/cleaned_dataset.csv")

# Ensure target is a factor
data$placement_status <- as.factor(data$placement_status)

# Select features
features <- data %>% select(
  ssc_percentage, hsc_percentage, degree_percentage, cgpa,
  entrance_exam_score, technical_skill_score, soft_skill_score,
  internship_count, live_projects, work_experience_months,
  certifications, attendance_percentage, backlogs, placement_status
)

# Train-Test Split (80/20 Stratified)
set.seed(42)
trainIndex <- createDataPartition(features$placement_status, p = .8, 
                                  list = FALSE, 
                                  times = 1)
dataTrain <- features[ trainIndex,]
dataTest  <- features[-trainIndex,]

cat("Total Valid Records:", nrow(features), "\n")
cat("Training Records:", nrow(dataTrain), "\n")
cat("Testing Records:", nrow(dataTest), "\n")

# --- 1. Logistic Regression ---
log_model <- glm(placement_status ~ ., data = dataTrain, family = binomial)
log_probs <- predict(log_model, newdata = dataTest, type = "response")
log_preds <- as.factor(ifelse(log_probs > 0.5, "Placed", "Not Placed"))

# Ensure levels match
levels(log_preds) <- levels(dataTest$placement_status)

cat("\n--- Logistic Regression Evaluation ---\n")
log_cm <- confusionMatrix(log_preds, dataTest$placement_status, positive = "Placed")
print(log_cm)

# --- 2. Decision Tree ---
dt_model <- rpart(placement_status ~ ., data = dataTrain, method = "class")
dt_preds <- predict(dt_model, newdata = dataTest, type = "class")

cat("\n--- Decision Tree Evaluation ---\n")
dt_cm <- confusionMatrix(dt_preds, dataTest$placement_status, positive = "Placed")
print(dt_cm)

# --- 3. Random Forest ---
rf_model <- randomForest(placement_status ~ ., data = dataTrain, ntree = 100)
rf_preds <- predict(rf_model, newdata = dataTest)

cat("\n--- Random Forest Evaluation ---\n")
rf_cm <- confusionMatrix(rf_preds, dataTest$placement_status, positive = "Placed")
print(rf_cm)

saveRDS(rf_model, "../results/models/random_forest_placement.rds")
