# 07_final_report.R
library(readr)
library(dplyr)

cat("Generating dynamic final analytical report...\n")

# Safely read tables, with fallback if not executed
read_table_safe <- function(path) {
  if (file.exists(path)) {
    return(read_csv(path, show_col_types = FALSE))
  }
  return(NULL)
}

df_dataset <- read_table_safe("../results/tables/cleaned_dataset.csv")
df_desc <- read_table_safe("../results/tables/descriptive_statistics.csv")
df_place <- read_table_safe("../results/tables/placement_statistics.csv")
df_models <- read_table_safe("../results/tables/model_comparison.csv")
df_best <- read_table_safe("../results/tables/best_model.csv")
df_salary <- read_table_safe("../results/tables/salary_regression_metrics.csv")

report_content <- c(
  "==================================================",
  " FINAL ANALYTICAL REPORT",
  "==================================================",
  ""
)

# 1. Dataset Summary
report_content <- c(report_content, "1. Dataset Summary", "--------------------------------------------------")
if (!is.null(df_dataset)) {
  report_content <- c(report_content, paste("Total Records:", nrow(df_dataset)))
  report_content <- c(report_content, paste("Total Features:", ncol(df_dataset)))
} else {
  report_content <- c(report_content, "Dataset not found.")
}
report_content <- c(report_content, "")

# 2. Placement Summary
report_content <- c(report_content, "2. Placement Summary", "--------------------------------------------------")
if (!is.null(df_dataset) && "placement_status" %in% names(df_dataset)) {
  total <- nrow(df_dataset)
  placed <- sum(df_dataset$placement_status == "Placed", na.rm = TRUE)
  rate <- round((placed / total) * 100, 2)
  report_content <- c(report_content, paste("Placed Students:", placed))
  report_content <- c(report_content, paste("Not Placed Students:", total - placed))
  report_content <- c(report_content, paste("Overall Placement Rate:", rate, "%"))
} else {
  report_content <- c(report_content, "Placement summary not available.")
}
report_content <- c(report_content, "")

# 3. Descriptive Statistics
report_content <- c(report_content, "3. Descriptive Statistics", "--------------------------------------------------")
if (!is.null(df_desc)) {
  cgpa_mean <- round(df_desc$Mean[df_desc$Feature == "cgpa"], 2)
  tech_mean <- round(df_desc$Mean[df_desc$Feature == "technical_skill_score"], 2)
  report_content <- c(report_content, paste("Average CGPA:", cgpa_mean))
  report_content <- c(report_content, paste("Average Technical Skill Score:", tech_mean))
} else {
  report_content <- c(report_content, "Descriptive statistics not available.")
}
report_content <- c(report_content, "")

# 4. Placed vs Not Placed comparison
report_content <- c(report_content, "4. Placed vs Not Placed comparison", "--------------------------------------------------")
if (!is.null(df_place)) {
  placed_row <- df_place %>% filter(placement_status == "Placed")
  not_placed_row <- df_place %>% filter(placement_status == "Not Placed")
  
  if(nrow(placed_row) > 0 && nrow(not_placed_row) > 0) {
    report_content <- c(report_content, paste("Placed Average CGPA:", round(placed_row$avg_cgpa, 2), 
                                              "| Not Placed Average CGPA:", round(not_placed_row$avg_cgpa, 2)))
    report_content <- c(report_content, paste("Placed Average Tech Skill:", round(placed_row$avg_tech_skill, 2), 
                                              "| Not Placed Average Tech Skill:", round(not_placed_row$avg_tech_skill, 2)))
  }
} else {
  report_content <- c(report_content, "Comparison statistics not available.")
}
report_content <- c(report_content, "")

# 5. Model Comparison
report_content <- c(report_content, "5. Model Comparison", "--------------------------------------------------")
if (!is.null(df_models)) {
  for (i in 1:nrow(df_models)) {
    report_content <- c(report_content, paste0(
      df_models$Rank[i], ". ", df_models$Model[i], 
      " (F1: ", round(df_models$F1_Score[i], 4), 
      ", Bal. Acc: ", round(df_models$Balanced_Accuracy[i], 4), ")"
    ))
  }
} else {
  report_content <- c(report_content, "Model comparison data not available.")
}
report_content <- c(report_content, "")

# 6. Best Model
report_content <- c(report_content, "6. Best Model", "--------------------------------------------------")
if (!is.null(df_best)) {
  b_mod <- df_best$Best_Model[1]
  b_f1 <- round(df_best$Best_F1_Score[1], 4)
  report_content <- c(report_content, paste("The best-performing placement model based on F1 Score was", b_mod, "with an F1 Score of", b_f1, "."))
} else {
  report_content <- c(report_content, "Best model data not available.")
}
report_content <- c(report_content, "")

# 7. Salary Regression Results
report_content <- c(report_content, "7. Salary Regression Results", "--------------------------------------------------")
if (!is.null(df_salary)) {
  rsq <- df_salary$Value[df_salary$Metric == "R_Squared"]
  report_content <- c(report_content, paste("The salary regression achieved an R² of", round(rsq, 4), "on the test set."))
} else {
  report_content <- c(report_content, "Salary regression data not available.")
}
report_content <- c(report_content, "")

# 8. Key Findings
report_content <- c(report_content, "8. Key Findings", "--------------------------------------------------")
report_content <- c(report_content, "Statistical association does not necessarily imply causation.")
report_content <- c(report_content, "- The machine learning classification pipeline successfully evaluated multiple student attributes.")
report_content <- c(report_content, "- Academic performance and technical proficiencies show differing average levels between placed and non-placed groups.")
report_content <- c(report_content, "- Regression analysis indicates the degree to which continuous features explain variance in the salary package.")
report_content <- c(report_content, "")

# 9. Recommendations
report_content <- c(report_content, "9. Recommendations", "--------------------------------------------------")
report_content <- c(report_content, "- Educators and administrators can utilize these statistical patterns to identify areas for student skill development.")
report_content <- c(report_content, "- Students can focus on the specific attributes (such as maintaining strong academic records and gaining practical experience) that the predictive models identified as highly relevant.")
report_content <- c(report_content, "")

# 10. Conclusion
report_content <- c(report_content, "10. Conclusion", "--------------------------------------------------")
report_content <- c(report_content, "The analytical workflow effectively processed the dataset, extracted quantitative insights, and evaluated predictive models. These data-driven techniques provide a robust framework for understanding and estimating student placement outcomes.")
report_content <- c(report_content, "")

writeLines(report_content, "../results/final_report_summary.txt")
cat("Dynamic report generated successfully and saved to results/final_report_summary.txt.\n")
