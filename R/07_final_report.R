# 07_final_report.R
library(readr)
library(dplyr)

cat("Generating dynamic final report...\n")

safe_read <- function(path) {
  if (file.exists(path)) return(read_csv(path, show_col_types = FALSE))
  return(NULL)
}

df_dataset <- safe_read("../results/tables/cleaned_dataset.csv")
df_desc <- safe_read("../results/tables/descriptive_statistics.csv")
df_place <- safe_read("../results/tables/placement_statistics.csv")
df_cor <- safe_read("../results/tables/correlation_matrix.csv")
df_metrics <- safe_read("../results/tables/classification_metrics.csv")
df_comp <- safe_read("../results/tables/model_comparison.csv")
df_best <- safe_read("../results/tables/best_model.csv")
df_salary <- safe_read("../results/tables/salary_regression_metrics.csv")

out <- c()
out <- c(out, "==================================================",
              " FINAL ANALYTICAL REPORT",
              "==================================================")

# 1. Project Overview
out <- c(out, "", "1. Project Overview", "-------------------", "This project evaluates student placement probabilities and salary regression using a machine learning pipeline.")

# 2. Dataset Summary
out <- c(out, "", "2. Dataset Summary", "------------------")
if (!is.null(df_dataset)) {
  out <- c(out, paste("Total Records:", nrow(df_dataset)))
  out <- c(out, paste("Total Features:", ncol(df_dataset)))
} else { out <- c(out, "Data not available.") }

# 3. Placement Summary
out <- c(out, "", "3. Placement Summary", "--------------------")
if (!is.null(df_dataset) && "placement_status" %in% names(df_dataset)) {
  total <- nrow(df_dataset)
  placed <- sum(df_dataset$placement_status == "Placed", na.rm = TRUE)
  rate <- round((placed/total)*100, 2)
  out <- c(out, paste("Overall Placement Rate:", rate, "%"))
} else { out <- c(out, "Data not available.") }

# 4. Descriptive Statistics
out <- c(out, "", "4. Descriptive Statistics", "-------------------------")
if (!is.null(df_desc)) {
  cgpa_mean <- round(df_desc$Mean[df_desc$Feature == "cgpa"], 2)
  tech_mean <- round(df_desc$Mean[df_desc$Feature == "technical_skill_score"], 2)
  out <- c(out, paste("Average CGPA across all students:", cgpa_mean))
  out <- c(out, paste("Average Technical Skill Score:", tech_mean))
} else { out <- c(out, "Data not available.") }

# 5. Placement Model Comparison
out <- c(out, "", "5. Placement Model Comparison", "-----------------------------")
if (!is.null(df_comp)) {
  for (i in 1:nrow(df_comp)) {
    out <- c(out, sprintf("%d. %s (F1: %.4f, Bal. Acc: %.4f)", df_comp$Rank[i], df_comp$Model[i], df_comp$F1_Score[i], df_comp$Balanced_Accuracy[i]))
  }
} else { out <- c(out, "Data not available.") }

# 6. Best Placement Model
out <- c(out, "", "6. Best Placement Model", "-----------------------")
if (!is.null(df_best)) {
  out <- c(out, sprintf("The best-performing placement model based on F1 Score was %s, with an F1 Score of %.4f.", df_best$Best_Model[1], df_best$Best_F1_Score[1]))
} else { out <- c(out, "Data not available.") }

# 7. Salary Regression Results
out <- c(out, "", "7. Salary Regression Results", "----------------------------")
if (!is.null(df_salary)) {
  rsq <- df_salary$Value[df_salary$Metric == "R_Squared"]
  rmse <- df_salary$Value[df_salary$Metric == "RMSE"]
  out <- c(out, sprintf("The salary regression model achieved an R-squared value of %.4f and an RMSE of %.4f.", rsq, rmse))
} else { out <- c(out, "Data not available.") }

# 8. Key Findings
out <- c(out, "", "8. Key Findings", "---------------")
out <- c(out, "Statistical association does not necessarily imply causation.")
if (!is.null(df_place)) {
  placed_cgpa <- round(df_place$avg_cgpa[df_place$placement_status == "Placed"], 2)
  not_placed_cgpa <- round(df_place$avg_cgpa[df_place$placement_status == "Not Placed"], 2)
  out <- c(out, sprintf("Placed students had an average CGPA of %.2f compared to %.2f for non-placed students.", placed_cgpa, not_placed_cgpa))
}

# 9. Recommendations
out <- c(out, "", "9. Recommendations", "------------------")
out <- c(out, "Focus on improving attributes that statistical associations and predictive models identify as highly relevant to successful placements.")

# 10. Conclusion
out <- c(out, "", "10. Conclusion", "--------------")
out <- c(out, "The analytical workflow effectively processed the dataset, dynamically ranked predictive models based on pure metrics, and generated a statistical overview of placement factors.")

writeLines(out, "../results/final_report_summary.txt")
cat("Dynamic report saved to results/final_report_summary.txt\n")
