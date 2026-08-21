# 06_model_comparison.R
library(readr)
library(dplyr)

metrics_file <- "../results/tables/classification_metrics.csv"

if (file.exists(metrics_file)) {
  metrics <- read_csv(metrics_file, show_col_types = FALSE)
  
  # Validate required models
  req_models <- c("Logistic Regression", "Decision Tree", "Random Forest")
  missing <- setdiff(req_models, metrics$Model)
  if(length(missing) > 0) {
    cat("Warning: Missing models:", paste(missing, collapse=", "), "\n")
  }
  
  # Rank models dynamically based on real metrics
  metrics_sorted <- metrics %>%
    arrange(desc(F1_Score), desc(Balanced_Accuracy)) %>%
    mutate(Rank = row_number()) %>%
    select(Model, Accuracy, Precision, Recall, F1_Score, Balanced_Accuracy, ROC_AUC, Rank)
  
  # Write model_comparison
  write_csv(metrics_sorted, "../results/tables/model_comparison.csv")
  
  # Determine and extract the best model dynamically
  best <- metrics_sorted[1, ]
  best_df <- data.frame(
    Best_Model = best$Model,
    Selection_Metric = "F1_Score (Secondary: Balanced_Accuracy)",
    Best_F1_Score = best$F1_Score,
    Best_Balanced_Accuracy = best$Balanced_Accuracy,
    Best_ROC_AUC = best$ROC_AUC,
    stringsAsFactors = FALSE
  )
  write_csv(best_df, "../results/tables/best_model.csv")
  
  # Print the dynamic best model to the console
  cat(sprintf("Best Model based on F1 Score: %s\n", best$Model))
  cat("Model comparison generated and saved to results/tables/model_comparison.csv\n")
} else {
  cat("Error: classification_metrics.csv not found.\n")
}
