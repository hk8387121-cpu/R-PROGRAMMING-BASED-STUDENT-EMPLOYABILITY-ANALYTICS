# 06_model_comparison.R
library(readr)
library(dplyr)

metrics_file <- "../results/tables/classification_metrics.csv"

if (file.exists(metrics_file)) {
  metrics <- read_csv(metrics_file, show_col_types = FALSE)
  
  # 1. Validate that all three models exist
  required_models <- c("Logistic Regression", "Decision Tree", "Random Forest")
  missing_models <- setdiff(required_models, metrics$Model)
  
  if (length(missing_models) > 0) {
    cat("Warning: The following required models are missing:", paste(missing_models, collapse = ", "), "\n")
  }
  
  # 2. Sort models by F1 Score descending, then Balanced Accuracy descending
  metrics_sorted <- metrics %>%
    arrange(desc(F1_Score), desc(Balanced_Accuracy)) %>%
    mutate(Rank = row_number())
  
  # 3 & 4. Identify the best model
  best_model_row <- metrics_sorted[1, ]
  
  best_model_name <- best_model_row$Model
  best_f1 <- best_model_row$F1_Score
  best_bal_acc <- best_model_row$Balanced_Accuracy
  
  # 5. Create results/tables/model_comparison.csv
  write_csv(metrics_sorted, "../results/tables/model_comparison.csv")
  
  # 6. Create results/tables/best_model.csv
  best_model_df <- data.frame(
    Best_Model = best_model_name,
    Selection_Metric = "F1_Score (Secondary: Balanced_Accuracy)",
    Best_F1_Score = best_f1,
    Best_Balanced_Accuracy = best_bal_acc,
    stringsAsFactors = FALSE
  )
  write_csv(best_model_df, "../results/tables/best_model.csv")
  
  # 7. Print the best model to the console
  cat("--- Model Comparison ---\n")
  print(metrics_sorted)
  cat("\nBest Model Selected:", best_model_name, "with F1 Score =", best_f1, "\n")
  cat("Model comparison table saved to results/tables/model_comparison.csv\n")
  cat("Best model details saved to results/tables/best_model.csv\n")
  
} else {
  cat("Error: classification_metrics.csv not found. Run 04_placement_prediction.R first.\n")
}
