# ============================================================
# 04_placement_prediction.R
# Student Employability Analytics
# ============================================================

library(readr)
library(caret)
library(rpart)
library(randomForest)
library(dplyr)
library(pROC)

cat("============================================================\n")
cat("04 - PLACEMENT PREDICTION\n")
cat("============================================================\n")

# ============================================================
# 1. LOAD CLEANED DATASET
# ============================================================

data_file <- "../results/tables/cleaned_dataset.csv"

if (!file.exists(data_file)) {
  stop(
    "ERROR: cleaned_dataset.csv was not found.\n",
    "Expected location: ../results/tables/cleaned_dataset.csv\n",
    "Run 01_data_preprocessing.R first."
  )
}

data <- read_csv(
  data_file,
  show_col_types = FALSE
)

cat("Dataset loaded successfully.\n")
cat("Total records:", nrow(data), "\n")
cat("Total columns:", ncol(data), "\n\n")


# ============================================================
# 2. REQUIRED COLUMN VALIDATION
# ============================================================

required_columns <- c(
  "ssc_percentage",
  "hsc_percentage",
  "degree_percentage",
  "cgpa",
  "entrance_exam_score",
  "technical_skill_score",
  "soft_skill_score",
  "internship_count",
  "live_projects",
  "work_experience_months",
  "certifications",
  "attendance_percentage",
  "backlogs",
  "placement_status"
)

missing_columns <- setdiff(
  required_columns,
  names(data)
)

if (length(missing_columns) > 0) {
  stop(
    "ERROR: The following required columns are missing:\n",
    paste(missing_columns, collapse = ", ")
  )
}

cat("Required columns validated successfully.\n\n")


# ============================================================
# 3. VALIDATE PLACEMENT TARGET
# ============================================================

# Convert target to character first
data$placement_status <- trimws(
  as.character(data$placement_status)
)

# Standardize possible capitalization
data$placement_status <- case_when(
  tolower(data$placement_status) == "placed" ~ "Placed",
  tolower(data$placement_status) == "not placed" ~ "Not Placed",
  TRUE ~ data$placement_status
)

# Convert to factor with explicit class order
data$placement_status <- factor(
  data$placement_status,
  levels = c("Not Placed", "Placed")
)

# Check target values
invalid_target <- sum(
  is.na(data$placement_status)
)

if (invalid_target > 0) {
  stop(
    "ERROR: ",
    invalid_target,
    " records contain invalid or missing placement_status values."
  )
}

if (length(unique(data$placement_status)) != 2) {
  stop(
    "ERROR: placement_status must contain both 'Not Placed' and 'Placed' classes."
  )
}

cat("Placement target validated.\n")
cat("Not Placed:",
    sum(data$placement_status == "Not Placed"),
    "\n")

cat("Placed:",
    sum(data$placement_status == "Placed"),
    "\n\n")


# ============================================================
# 4. SELECT MODEL FEATURES
# ============================================================

features <- data %>%
  select(
    ssc_percentage,
    hsc_percentage,
    degree_percentage,
    cgpa,
    entrance_exam_score,
    technical_skill_score,
    soft_skill_score,
    internship_count,
    live_projects,
    work_experience_months,
    certifications,
    attendance_percentage,
    backlogs,
    placement_status
  )

# Remove incomplete records only if required variables contain NA
complete_records <- complete.cases(features)

if (any(!complete_records)) {

  removed_records <- sum(!complete_records)

  cat(
    "Removing",
    removed_records,
    "records containing missing model values.\n"
  )

  features <- features[complete_records, ]
}

cat(
  "Valid records available for modelling:",
  nrow(features),
  "\n\n"
)


# ============================================================
# 5. RECHECK TARGET AFTER CLEANING
# ============================================================

features$placement_status <- factor(
  features$placement_status,
  levels = c("Not Placed", "Placed")
)

if (any(is.na(features$placement_status))) {
  stop("ERROR: Invalid placement_status values remain after preprocessing.")
}

if (length(unique(features$placement_status)) != 2) {
  stop("ERROR: Both placement classes are required for model training.")
}


# ============================================================
# 6. TRAIN / TEST SPLIT
# ============================================================

set.seed(42)

trainIndex <- createDataPartition(
  features$placement_status,
  p = 0.80,
  list = FALSE,
  times = 1
)

dataTrain <- features[trainIndex, ]
dataTest  <- features[-trainIndex, ]

cat("============================================================\n")
cat("TRAIN / TEST SPLIT\n")
cat("============================================================\n")

cat("Total valid records:", nrow(features), "\n")
cat("Training records:", nrow(dataTrain), "\n")
cat("Testing records:", nrow(dataTest), "\n")

cat(
  "Training percentage:",
  round(nrow(dataTrain) / nrow(features) * 100, 2),
  "%\n"
)

cat(
  "Testing percentage:",
  round(nrow(dataTest) / nrow(features) * 100, 2),
  "%\n\n"
)


# ============================================================
# 7. VERIFY TEST SET CONTAINS BOTH CLASSES
# ============================================================

test_classes <- unique(dataTest$placement_status)

if (length(test_classes) != 2) {
  stop(
    "ERROR: Test dataset does not contain both placement classes."
  )
}


# ============================================================
# 8. METRICS STORAGE
# ============================================================

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


# ============================================================
# 9. METRIC CALCULATION FUNCTION
# ============================================================

add_metrics <- function(
    model_name,
    predictions,
    actual,
    probabilities
) {

  # Ensure identical factor levels
  predictions <- factor(
    predictions,
    levels = c("Not Placed", "Placed")
  )

  actual <- factor(
    actual,
    levels = c("Not Placed", "Placed")
  )

  # Confusion Matrix
  cm <- confusionMatrix(
    data = predictions,
    reference = actual,
    positive = "Placed"
  )

  # Extract classification metrics
  accuracy <- as.numeric(
    cm$overall[["Accuracy"]]
  )

  precision <- as.numeric(
    cm$byClass[["Pos Pred Value"]]
  )

  recall <- as.numeric(
    cm$byClass[["Sensitivity"]]
  )

  f1 <- as.numeric(
    cm$byClass[["F1"]]
  )

  balanced_accuracy <- as.numeric(
    cm$byClass[["Balanced Accuracy"]]
  )

  # ----------------------------------------------------------
  # ROC-AUC
  # ----------------------------------------------------------

  roc_obj <- pROC::roc(
    response = actual,
    predictor = probabilities,
    levels = c("Not Placed", "Placed"),
    direction = "<",
    quiet = TRUE
  )

  auc_value <- as.numeric(
    pROC::auc(roc_obj)
  )

  # ----------------------------------------------------------
  # Store metrics
  # ----------------------------------------------------------

  metrics_list <<- rbind(
    metrics_list,
    data.frame(
      Model = model_name,
      Accuracy = accuracy,
      Precision = precision,
      Recall = recall,
      F1_Score = f1,
      Balanced_Accuracy = balanced_accuracy,
      ROC_AUC = auc_value,
      stringsAsFactors = FALSE
    )
  )

  # Print results
  cat("\n------------------------------------------------------------\n")
  cat("Model:", model_name, "\n")
  cat("------------------------------------------------------------\n")

  cat("Accuracy:",
      round(accuracy, 4), "\n")

  cat("Precision:",
      round(precision, 4), "\n")

  cat("Recall:",
      round(recall, 4), "\n")

  cat("F1 Score:",
      round(f1, 4), "\n")

  cat("Balanced Accuracy:",
      round(balanced_accuracy, 4), "\n")

  cat("ROC-AUC:",
      round(auc_value, 4), "\n")
}


# ============================================================
# 10. LOGISTIC REGRESSION
# ============================================================

cat("\n============================================================\n")
cat("MODEL 1: LOGISTIC REGRESSION\n")
cat("============================================================\n")

log_model <- glm(
  placement_status ~ .,
  data = dataTrain,
  family = binomial
)

log_probs <- predict(
  log_model,
  newdata = dataTest,
  type = "response"
)

log_preds <- factor(
  ifelse(
    log_probs >= 0.50,
    "Placed",
    "Not Placed"
  ),
  levels = c("Not Placed", "Placed")
)

add_metrics(
  model_name = "Logistic Regression",
  predictions = log_preds,
  actual = dataTest$placement_status,
  probabilities = log_probs
)


# ============================================================
# 11. DECISION TREE
# ============================================================

cat("\n============================================================\n")
cat("MODEL 2: DECISION TREE\n")
cat("============================================================\n")

dt_model <- rpart(
  placement_status ~ .,
  data = dataTrain,
  method = "class"
)

dt_prob_matrix <- predict(
  dt_model,
  newdata = dataTest,
  type = "prob"
)

dt_probs <- dt_prob_matrix[, "Placed"]

dt_preds <- factor(
  predict(
    dt_model,
    newdata = dataTest,
    type = "class"
  ),
  levels = c("Not Placed", "Placed")
)

add_metrics(
  model_name = "Decision Tree",
  predictions = dt_preds,
  actual = dataTest$placement_status,
  probabilities = dt_probs
)


# ============================================================
# 12. RANDOM FOREST
# ============================================================

cat("\n============================================================\n")
cat("MODEL 3: RANDOM FOREST\n")
cat("============================================================\n")

set.seed(42)

rf_model <- randomForest(
  placement_status ~ .,
  data = dataTrain,
  ntree = 100
)

rf_prob_matrix <- predict(
  rf_model,
  newdata = dataTest,
  type = "prob"
)

rf_probs <- rf_prob_matrix[, "Placed"]

rf_preds <- factor(
  predict(
    rf_model,
    newdata = dataTest,
    type = "response"
  ),
  levels = c("Not Placed", "Placed")
)

add_metrics(
  model_name = "Random Forest",
  predictions = rf_preds,
  actual = dataTest$placement_status,
  probabilities = rf_probs
)


# ============================================================
# 13. CREATE OUTPUT DIRECTORIES
# ============================================================

dir.create(
  "../results/models",
  showWarnings = FALSE,
  recursive = TRUE
)

dir.create(
  "../results/tables",
  showWarnings = FALSE,
  recursive = TRUE
)


# ============================================================
# 14. SAVE TRAINED MODELS
# ============================================================

saveRDS(
  log_model,
  "../results/models/logistic_regression_model.rds"
)

saveRDS(
  dt_model,
  "../results/models/decision_tree_model.rds"
)

saveRDS(
  rf_model,
  "../results/models/random_forest_model.rds"
)


# ============================================================
# 15. SAVE CLASSIFICATION METRICS
# ============================================================

metrics_list <- metrics_list %>%
  mutate(
    Accuracy = round(Accuracy, 6),
    Precision = round(Precision, 6),
    Recall = round(Recall, 6),
    F1_Score = round(F1_Score, 6),
    Balanced_Accuracy = round(Balanced_Accuracy, 6),
    ROC_AUC = round(ROC_AUC, 6)
  )

metrics_file <- "../results/tables/classification_metrics.csv"

write_csv(
  metrics_list,
  metrics_file
)


# ============================================================
# 16. FINAL OUTPUT
# ============================================================

cat("\n============================================================\n")
cat("PLACEMENT PREDICTION COMPLETED\n")
cat("============================================================\n")

cat("Models trained:\n")
cat("1. Logistic Regression\n")
cat("2. Decision Tree\n")
cat("3. Random Forest\n\n")

cat("Classification metrics saved to:\n")
cat(metrics_file, "\n\n")

cat("Saved models:\n")
cat("../results/models/logistic_regression_model.rds\n")
cat("../results/models/decision_tree_model.rds\n")
cat("../results/models/random_forest_model.rds\n")

cat("\n============================================================\n")
cat("IMPORTANT: Model winner is NOT predetermined.\n")
cat("R/06_model_comparison.R will rank models using actual metrics.\n")
cat("============================================================\n")