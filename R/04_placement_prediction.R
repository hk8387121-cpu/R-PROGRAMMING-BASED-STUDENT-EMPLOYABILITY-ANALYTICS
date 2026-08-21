# 04_placement_prediction.R

library(readr)
library(caret)
library(rpart)
library(randomForest)
library(dplyr)
library(pROC)

data <- read_csv("../results/tables/cleaned_dataset.csv")

# Ensure target is a factor
data$placement_status <- as.factor(data$placement_status)
data$extracurricular_activities <- as.factor(data$extracurricular_activities)

# Select features
features <- data %>% select(
  ssc_percentage, hsc_percentage, degree_percentage, cgpa,
  entrance_exam_score, technical_skill_score, soft_skill_score,
  internship_count, live_projects, work_experience_months,
  certifications, attendance_percentage, backlogs, extracurricular_activities, placement_status
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

# Store metrics
metrics_list <- data.frame(
  Model = character(),
  Accuracy = numeric(),
  Precision = numeric(),
  Recall = numeric(),
  F1_Score = numeric(),
  Balanced_Accuracy = numeric(),
  ROC_AUC = numeric(),
  stringsAsFactors = FALSE
)

# Function to calculate and store metrics
add_metrics <- function(model_name, cm, actual, probs) {
  accuracy <- cm$overall["Accuracy"]
  precision <- cm$byClass["Pos Pred Value"]
  recall <- cm$byClass["Sensitivity"]
  f1 <- cm$byClass["F1"]
  bal_acc <- cm$byClass["Balanced Accuracy"]
  
  roc_obj <- roc(as.numeric(actual), probs)
  auc_val <- as.numeric(auc(roc_obj))
  
  metrics_list <<- rbind(metrics_list, data.frame(
    Model = model_name,
    Accuracy = accuracy,
    Precision = precision,
    Recall = recall,
    F1_Score = f1,
    Balanced_Accuracy = bal_acc,
    ROC_AUC = auc_val
  ))
}

# --- 1. Logistic Regression ---
log_model <- glm(placement_status ~ ., data = dataTrain, family = binomial)
log_probs <- predict(log_model, newdata = dataTest, type = "response")
log_preds <- as.factor(ifelse(log_probs > 0.5, "Placed", "Not Placed"))
levels(log_preds) <- levels(dataTest$placement_status)
log_cm <- confusionMatrix(log_preds, dataTest$placement_status, positive = "Placed")
add_metrics("Logistic Regression", log_cm, dataTest$placement_status, log_probs)

# --- 2. Decision Tree ---
dt_model <- rpart(placement_status ~ ., data = dataTrain, method = "class")
dt_probs <- predict(dt_model, newdata = dataTest, type = "prob")[, "Placed"]
dt_preds <- predict(dt_model, newdata = dataTest, type = "class")
dt_cm <- confusionMatrix(dt_preds, dataTest$placement_status, positive = "Placed")
add_metrics("Decision Tree", dt_cm, dataTest$placement_status, dt_probs)

# --- 3. Random Forest ---
rf_model <- randomForest(placement_status ~ ., data = dataTrain, ntree = 100)
rf_probs <- predict(rf_model, newdata = dataTest, type = "prob")[, "Placed"]
rf_preds <- predict(rf_model, newdata = dataTest)
rf_cm <- confusionMatrix(rf_preds, dataTest$placement_status, positive = "Placed")
add_metrics("Random Forest", rf_cm, dataTest$placement_status, rf_probs)

saveRDS(rf_model, "../results/models/random_forest_model.rds")
saveRDS(log_model, "../results/models/logistic_regression_model.rds")
saveRDS(dt_model, "../results/models/decision_tree_model.rds")

# Save classification metrics
write_csv(metrics_list, "../results/tables/classification_metrics.csv")
cat("\nMetrics saved to results/tables/classification_metrics.csv\n")
