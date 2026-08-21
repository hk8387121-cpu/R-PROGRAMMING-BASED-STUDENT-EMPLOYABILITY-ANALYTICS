# ============================================================
# 06_model_comparison.R
# Student Employability Analytics and Placement Prediction
# ============================================================

# ------------------------------------------------------------
# 1. Load Required Libraries
# ------------------------------------------------------------

library(readr)
library(dplyr)

# ------------------------------------------------------------
# 2. Define File Paths
# ------------------------------------------------------------

metrics_file <- "../results/tables/classification_metrics.csv"

output_dir <- "../results/tables"

comparison_file <- file.path(
  output_dir,
  "model_comparison.csv"
)

best_model_file <- file.path(
  output_dir,
  "best_model.csv"
)

# ------------------------------------------------------------
# 3. Create Output Directory
# ------------------------------------------------------------

dir.create(
  output_dir,
  showWarnings = FALSE,
  recursive = TRUE
)

# ------------------------------------------------------------
# 4. Check Classification Metrics File
# ------------------------------------------------------------

if (!file.exists(metrics_file)) {
  
  stop(
    paste(
      "ERROR: classification_metrics.csv was not found at:",
      metrics_file
    )
  )
}

# ------------------------------------------------------------
# 5. Load Classification Metrics
# ------------------------------------------------------------

metrics <- read_csv(
  metrics_file,
  show_col_types = FALSE
)

# ------------------------------------------------------------
# 6. Required Models
# ------------------------------------------------------------

required_models <- c(
  "Logistic Regression",
  "Decision Tree",
  "Random Forest"
)

# ------------------------------------------------------------
# 7. Validate Required Columns
# ------------------------------------------------------------

required_columns <- c(
  "Model",
  "Accuracy",
  "Precision",
  "Recall",
  "F1_Score",
  "Balanced_Accuracy",
  "ROC_AUC"
)

missing_columns <- setdiff(
  required_columns,
  names(metrics)
)

if (length(missing_columns) > 0) {
  
  stop(
    paste(
      "ERROR: The following required columns are missing:",
      paste(
        missing_columns,
        collapse = ", "
      )
    )
  )
}

# ------------------------------------------------------------
# 8. Check Required Models
# ------------------------------------------------------------

missing_models <- setdiff(
  required_models,
  metrics$Model
)

if (length(missing_models) > 0) {
  
  stop(
    paste(
      "ERROR: The following required models are missing:",
      paste(
        missing_models,
        collapse = ", "
      )
    )
  )
}

# ------------------------------------------------------------
# 9. Keep Only Required Models
# ------------------------------------------------------------

model_metrics <- metrics %>%
  filter(
    Model %in% required_models
  ) %>%
  select(
    Model,
    Accuracy,
    Precision,
    Recall,
    F1_Score,
    Balanced_Accuracy,
    ROC_AUC
  )

# ------------------------------------------------------------
# 10. Check for Duplicate Models
# ------------------------------------------------------------

duplicate_models <- model_metrics %>%
  count(Model) %>%
  filter(n > 1)

if (nrow(duplicate_models) > 0) {
  
  stop(
    paste(
      "ERROR: Duplicate model entries found for:",
      paste(
        duplicate_models$Model,
        collapse = ", "
      )
    )
  )
}

# ------------------------------------------------------------
# 11. Check Number of Models
# ------------------------------------------------------------

if (nrow(model_metrics) != length(required_models)) {
  
  stop(
    paste(
      "ERROR: Expected",
      length(required_models),
      "models but found",
      nrow(model_metrics)
    )
  )
}

# ------------------------------------------------------------
# 12. Check Missing Metric Values
# ------------------------------------------------------------

metric_columns <- c(
  "Accuracy",
  "Precision",
  "Recall",
  "F1_Score",
  "Balanced_Accuracy",
  "ROC_AUC"
)

missing_metric_values <- model_metrics %>%
  filter(
    if_any(
      all_of(metric_columns),
      is.na
    )
  )

if (nrow(missing_metric_values) > 0) {
  
  stop(
    paste(
      "ERROR: Missing metric values found for model(s):",
      paste(
        missing_metric_values$Model,
        collapse = ", "
      )
    )
  )
}

# ------------------------------------------------------------
# 13. Validate Metric Ranges
# ------------------------------------------------------------

invalid_metrics <- model_metrics %>%
  filter(
    Accuracy < 0 | Accuracy > 1 |
    Precision < 0 | Precision > 1 |
    Recall < 0 | Recall > 1 |
    F1_Score < 0 | F1_Score > 1 |
    Balanced_Accuracy < 0 | Balanced_Accuracy > 1 |
    ROC_AUC < 0 | ROC_AUC > 1
  )

if (nrow(invalid_metrics) > 0) {
  
  stop(
    paste(
      "ERROR: Invalid metric values found for model(s):",
      paste(
        invalid_metrics$Model,
        collapse = ", "
      )
    )
  )
}

# ------------------------------------------------------------
# 14. Rank Models
#
# Primary criterion:
# F1 Score - descending
#
# Secondary criterion:
# Balanced Accuracy - descending
#
# Third criterion:
# ROC-AUC - descending
# ------------------------------------------------------------

metrics_sorted <- model_metrics %>%
  arrange(
    desc(F1_Score),
    desc(Balanced_Accuracy),
    desc(ROC_AUC),
    Model
  ) %>%
  mutate(
    Rank = row_number()
  ) %>%
  select(
    Model,
    Accuracy,
    Precision,
    Recall,
    F1_Score,
    Balanced_Accuracy,
    ROC_AUC,
    Rank
  )

# ------------------------------------------------------------
# 15. Save Model Comparison
# ------------------------------------------------------------

write_csv(
  metrics_sorted,
  comparison_file
)

# ------------------------------------------------------------
# 16. Identify Best Model
# ------------------------------------------------------------

best_model <- metrics_sorted %>%
  filter(
    Rank == 1
  )

# ------------------------------------------------------------
# 17. Create Best Model Summary
# ------------------------------------------------------------

best_model_summary <- data.frame(
  
  Best_Model = best_model$Model,
  
  Selection_Metric =
    "F1_Score (Secondary: Balanced_Accuracy, Third: ROC_AUC)",
  
  Best_F1_Score =
    best_model$F1_Score,
  
  Best_Balanced_Accuracy =
    best_model$Balanced_Accuracy,
  
  Best_ROC_AUC =
    best_model$ROC_AUC,
  
  Best_Accuracy =
    best_model$Accuracy,
  
  Best_Precision =
    best_model$Precision,
  
  Best_Recall =
    best_model$Recall,
  
  stringsAsFactors = FALSE
)

# ------------------------------------------------------------
# 18. Save Best Model
# ------------------------------------------------------------

write_csv(
  best_model_summary,
  best_model_file
)

# ------------------------------------------------------------
# 19. Display Model Comparison
# ------------------------------------------------------------

cat("\n")
cat("============================================================\n")
cat("MODEL COMPARISON RESULTS\n")
cat("============================================================\n")

print(
  metrics_sorted
)

cat("\n")

# ------------------------------------------------------------
# 20. Display Best Model
# ------------------------------------------------------------

cat("============================================================\n")
cat("BEST MODEL\n")
cat("============================================================\n")

cat(
  "Best Model: ",
  best_model$Model,
  "\n",
  sep = ""
)

cat(
  "F1 Score: ",
  sprintf(
    "%.4f",
    best_model$F1_Score
  ),
  "\n",
  sep = ""
)

cat(
  "Balanced Accuracy: ",
  sprintf(
    "%.4f",
    best_model$Balanced_Accuracy
  ),
  "\n",
  sep = ""
)

cat(
  "ROC-AUC: ",
  sprintf(
    "%.4f",
    best_model$ROC_AUC
  ),
  "\n",
  sep = ""
)

cat(
  "Accuracy: ",
  sprintf(
    "%.4f",
    best_model$Accuracy
  ),
  "\n",
  sep = ""
)

cat(
  "Precision: ",
  sprintf(
    "%.4f",
    best_model$Precision
  ),
  "\n",
  sep = ""
)

cat(
  "Recall: ",
  sprintf(
    "%.4f",
    best_model$Recall
  ),
  "\n",
  sep = ""
)

# ------------------------------------------------------------
# 21. Output File Confirmation
# ------------------------------------------------------------

cat("\n")
cat("============================================================\n")
cat("OUTPUT FILES\n")
cat("============================================================\n")

cat(
  "Model comparison saved to:\n",
  comparison_file,
  "\n\n",
  sep = ""
)

cat(
  "Best model saved to:\n",
  best_model_file,
  "\n",
  sep = ""
)

cat("\n")
cat("Model comparison completed successfully.\n")
cat("============================================================\n")