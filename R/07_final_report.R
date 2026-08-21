# ============================================================
# 07_final_report.R
# Student Employability Analytics and Placement Prediction
# Dynamic Final Analytical Report
# ============================================================

# ------------------------------------------------------------
# 1. Load Required Libraries
# ------------------------------------------------------------

library(readr)
library(dplyr)

cat("\n")
cat("============================================================\n")
cat("GENERATING DYNAMIC FINAL ANALYTICAL REPORT\n")
cat("============================================================\n")

# ------------------------------------------------------------
# 2. Create Output Directory
# ------------------------------------------------------------

dir.create(
  "../results",
  showWarnings = FALSE,
  recursive = TRUE
)

# ------------------------------------------------------------
# 3. Safe CSV Reader
# ------------------------------------------------------------

safe_read <- function(path) {
  
  if (file.exists(path)) {
    
    tryCatch(
      {
        read_csv(
          path,
          show_col_types = FALSE
        )
      },
      error = function(e) {
        cat(
          "Warning: Could not read file:",
          path,
          "\n"
        )
        return(NULL)
      }
    )
    
  } else {
    
    cat(
      "Warning: File not found:",
      path,
      "\n"
    )
    
    return(NULL)
  }
}

# ------------------------------------------------------------
# 4. Read Result Files
# ------------------------------------------------------------

df_dataset <- safe_read(
  "../results/tables/cleaned_dataset.csv"
)

df_desc <- safe_read(
  "../results/tables/descriptive_statistics.csv"
)

df_place <- safe_read(
  "../results/tables/placement_statistics.csv"
)

df_cor <- safe_read(
  "../results/tables/correlation_matrix.csv"
)

df_metrics <- safe_read(
  "../results/tables/classification_metrics.csv"
)

df_comp <- safe_read(
  "../results/tables/model_comparison.csv"
)

df_best <- safe_read(
  "../results/tables/best_model.csv"
)

df_salary <- safe_read(
  "../results/tables/salary_regression_metrics.csv"
)

# ------------------------------------------------------------
# 5. Helper Functions
# ------------------------------------------------------------

safe_number <- function(x, digits = 2) {
  
  if (length(x) == 0 || is.na(x[1])) {
    return("Not available")
  }
  
  sprintf(
    paste0("%.", digits, "f"),
    as.numeric(x[1])
  )
}

get_metric <- function(
    df,
    metric_name,
    metric_column = "Metric",
    value_column = "Value"
) {
  
  if (is.null(df)) {
    return(NA_real_)
  }
  
  if (
    !(metric_column %in% names(df)) ||
    !(value_column %in% names(df))
  ) {
    return(NA_real_)
  }
  
  value <- df %>%
    filter(
      .data[[metric_column]] == metric_name
    ) %>%
    pull(
      .data[[value_column]]
    )
  
  if (length(value) == 0) {
    return(NA_real_)
  }
  
  as.numeric(value[1])
}

# ------------------------------------------------------------
# 6. Start Report
# ------------------------------------------------------------

out <- c()

out <- c(
  out,
  "============================================================",
  " FINAL ANALYTICAL REPORT",
  " Student Employability Analytics and Placement Prediction",
  "============================================================"
)

# ============================================================
# 1. PROJECT OVERVIEW
# ============================================================

out <- c(
  out,
  "",
  "1. Project Overview",
  "-------------------",
  "This project analyzes student academic and employability data",
  "to understand placement outcomes and salary patterns.",
  "",
  "The analytical pipeline uses statistical analysis, data",
  "visualization, classification models, and salary regression",
  "to generate data-driven placement insights."
)

# ============================================================
# 2. DATASET SUMMARY
# ============================================================

out <- c(
  out,
  "",
  "2. Dataset Summary",
  "------------------"
)

if (!is.null(df_dataset)) {
  
  total_records <- nrow(df_dataset)
  total_features <- ncol(df_dataset)
  
  out <- c(
    out,
    paste(
      "Total Records:",
      total_records
    ),
    paste(
      "Total Features:",
      total_features
    )
  )
  
  # Check placement column
  if ("placement_status" %in% names(df_dataset)) {
    
    placed_count <- sum(
      df_dataset$placement_status == "Placed",
      na.rm = TRUE
    )
    
    not_placed_count <- sum(
      df_dataset$placement_status == "Not Placed",
      na.rm = TRUE
    )
    
    out <- c(
      out,
      paste(
        "Placed Students:",
        placed_count
      ),
      paste(
        "Not Placed Students:",
        not_placed_count
      )
    )
  }
  
} else {
  
  out <- c(
    out,
    "Dataset information is not available."
  )
}

# ============================================================
# 3. PLACEMENT SUMMARY
# ============================================================

out <- c(
  out,
  "",
  "3. Placement Summary",
  "--------------------"
)

if (
  !is.null(df_dataset) &&
  "placement_status" %in% names(df_dataset)
) {
  
  total_students <- nrow(df_dataset)
  
  placed_students <- sum(
    df_dataset$placement_status == "Placed",
    na.rm = TRUE
  )
  
  not_placed_students <- sum(
    df_dataset$placement_status == "Not Placed",
    na.rm = TRUE
  )
  
  valid_students <- placed_students +
    not_placed_students
  
  if (valid_students > 0) {
    
    placement_rate <-
      (placed_students / valid_students) * 100
    
    out <- c(
      out,
      paste(
        "Total Students Analyzed:",
        valid_students
      ),
      paste(
        "Placed Students:",
        placed_students
      ),
      paste(
        "Not Placed Students:",
        not_placed_students
      ),
      paste(
        "Overall Placement Rate:",
        paste0(
          safe_number(
            placement_rate,
            2
          ),
          "%"
        )
      )
    )
    
  } else {
    
    out <- c(
      out,
      "No valid placement records were available."
    )
  }
  
} else {
  
  out <- c(
    out,
    "Placement information is not available."
  )
}

# ============================================================
# 4. DESCRIPTIVE STATISTICS
# ============================================================

out <- c(
  out,
  "",
  "4. Descriptive Statistics",
  "-------------------------"
)

if (!is.null(df_desc)) {
  
  # Identify expected feature names
  expected_features <- c(
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
    "backlogs"
  )
  
  # Check whether expected structure exists
  if (
    "Feature" %in% names(df_desc) &&
    "Mean" %in% names(df_desc)
  ) {
    
    out <- c(
      out,
      "Mean values of important numerical features:"
    )
    
    for (feature in expected_features) {
      
      value <- df_desc %>%
        filter(
          Feature == feature
        ) %>%
        pull(Mean)
      
      if (length(value) > 0 &&
          !is.na(value[1])) {
        
        out <- c(
          out,
          paste(
            feature,
            ":",
            safe_number(
              value[1],
              2
            )
          )
        )
      }
    }
    
  } else {
    
    out <- c(
      out,
      "Descriptive statistics structure could not be interpreted."
    )
  }
  
} else {
  
  out <- c(
    out,
    "Descriptive statistics are not available."
  )
}

# ============================================================
# 5. PLACEMENT MODEL COMPARISON
# ============================================================

out <- c(
  out,
  "",
  "5. Placement Model Comparison",
  "-----------------------------"
)

if (!is.null(df_comp)) {
  
  required_columns <- c(
    "Model",
    "Accuracy",
    "Precision",
    "Recall",
    "F1_Score",
    "Balanced_Accuracy",
    "ROC_AUC",
    "Rank"
  )
  
  if (
    all(
      required_columns %in%
        names(df_comp)
    )
  ) {
    
    df_comp <- df_comp %>%
      arrange(Rank)
    
    for (i in seq_len(nrow(df_comp))) {
      
      out <- c(
        out,
        sprintf(
          "%d. %s | Accuracy: %.4f | Precision: %.4f | Recall: %.4f | F1: %.4f | Balanced Accuracy: %.4f | ROC-AUC: %.4f",
          df_comp$Rank[i],
          df_comp$Model[i],
          df_comp$Accuracy[i],
          df_comp$Precision[i],
          df_comp$Recall[i],
          df_comp$F1_Score[i],
          df_comp$Balanced_Accuracy[i],
          df_comp$ROC_AUC[i]
        )
      )
    }
    
  } else {
    
    out <- c(
      out,
      "Model comparison file does not contain the required columns."
    )
  }
  
} else {
  
  out <- c(
    out,
    "Model comparison results are not available."
  )
}

# ============================================================
# 6. BEST PLACEMENT MODEL
# ============================================================

out <- c(
  out,
  "",
  "6. Best Placement Model",
  "-----------------------"
)

if (!is.null(df_best)) {
  
  required_best_columns <- c(
    "Best_Model",
    "Best_F1_Score",
    "Best_Balanced_Accuracy",
    "Best_ROC_AUC"
  )
  
  if (
    all(
      required_best_columns %in%
        names(df_best)
    ) &&
    nrow(df_best) > 0
  ) {
    
    best_model_name <- as.character(
      df_best$Best_Model[1]
    )
    
    best_f1 <- as.numeric(
      df_best$Best_F1_Score[1]
    )
    
    best_balanced_accuracy <- as.numeric(
      df_best$Best_Balanced_Accuracy[1]
    )
    
    best_roc_auc <- as.numeric(
      df_best$Best_ROC_AUC[1]
    )
    
    out <- c(
      out,
      sprintf(
        "The best-performing placement model based on F1 Score was %s, with an F1 Score of %.4f.",
        best_model_name,
        best_f1
      ),
      sprintf(
        "Its Balanced Accuracy was %.4f and its ROC-AUC was %.4f.",
        best_balanced_accuracy,
        best_roc_auc
      )
    )
    
  } else {
    
    out <- c(
      out,
      "A valid best-model result was not available."
    )
  }
  
} else {
  
  out <- c(
    out,
    "Best model information is not available."
  )
}

# ============================================================
# 7. SALARY REGRESSION RESULTS
# ============================================================

out <- c(
  out,
  "",
  "7. Salary Regression Results",
  "----------------------------"
)

if (!is.null(df_salary)) {
  
  rsq <- get_metric(
    df_salary,
    "R_Squared"
  )
  
  adjusted_rsq <- get_metric(
    df_salary,
    "Adjusted_R_Squared"
  )
  
  mae <- get_metric(
    df_salary,
    "MAE"
  )
  
  mse <- get_metric(
    df_salary,
    "MSE"
  )
  
  rmse <- get_metric(
    df_salary,
    "RMSE"
  )
  
  if (!is.na(rsq)) {
    
    out <- c(
      out,
      sprintf(
        "The salary regression model achieved an R-squared value of %.4f.",
        rsq
      )
    )
    
  } else {
    
    out <- c(
      out,
      "R-squared value was not available."
    )
  }
  
  if (!is.na(adjusted_rsq)) {
    
    out <- c(
      out,
      sprintf(
        "Adjusted R-squared: %.4f.",
        adjusted_rsq
      )
    )
  }
  
  if (!is.na(mae)) {
    
    out <- c(
      out,
      sprintf(
        "Mean Absolute Error (MAE): %.4f LPA.",
        mae
      )
    )
  }
  
  if (!is.na(mse)) {
    
    out <- c(
      out,
      sprintf(
        "Mean Squared Error (MSE): %.4f.",
        mse
      )
    )
  }
  
  if (!is.na(rmse)) {
    
    out <- c(
      out,
      sprintf(
        "Root Mean Squared Error (RMSE): %.4f LPA.",
        rmse
      )
    )
  }
  
} else {
  
  out <- c(
    out,
    "Salary regression results are not available."
  )
}

# ============================================================
# 8. KEY FINDINGS
# ============================================================

out <- c(
  out,
  "",
  "8. Key Findings",
  "---------------",
  "The following findings are based on calculated statistical",
  "summaries and model outputs from the available dataset.",
  "",
  "Important:",
  "Statistical association does not necessarily imply causation."
)

# ------------------------------------------------------------
# 8.1 CGPA Comparison
# ------------------------------------------------------------

if (
  !is.null(df_place) &&
  "placement_status" %in% names(df_place) &&
  "avg_cgpa" %in% names(df_place)
) {
  
  placed_cgpa <- df_place %>%
    filter(
      placement_status == "Placed"
    ) %>%
    pull(avg_cgpa)
  
  not_placed_cgpa <- df_place %>%
    filter(
      placement_status == "Not Placed"
    ) %>%
    pull(avg_cgpa)
  
  if (
    length(placed_cgpa) > 0 &&
    length(not_placed_cgpa) > 0 &&
    !is.na(placed_cgpa[1]) &&
    !is.na(not_placed_cgpa[1])
  ) {
    
    difference <-
      placed_cgpa[1] -
      not_placed_cgpa[1]
    
    out <- c(
      out,
      sprintf(
        "Average CGPA among placed students: %.2f.",
        placed_cgpa[1]
      ),
      sprintf(
        "Average CGPA among not-placed students: %.2f.",
        not_placed_cgpa[1]
      ),
      sprintf(
        "Difference in average CGPA between the two groups: %.2f.",
        difference
      )
    )
  }
}

# ------------------------------------------------------------
# 8.2 Model-Based Finding
# ------------------------------------------------------------

if (!is.null(df_best)) {
  
  if (
    "Best_Model" %in% names(df_best) &&
    "Best_F1_Score" %in% names(df_best)
  ) {
    
    out <- c(
      out,
      sprintf(
        "The model comparison selected %s as the best-performing model based on the highest F1 Score of %.4f.",
        df_best$Best_Model[1],
        df_best$Best_F1_Score[1]
      )
    )
  }
}

# ------------------------------------------------------------
# 8.3 Salary Finding
# ------------------------------------------------------------

if (!is.null(df_salary)) {
  
  rsq <- get_metric(
    df_salary,
    "R_Squared"
  )
  
  if (!is.na(rsq)) {
    
    out <- c(
      out,
      sprintf(
        "The salary regression model explained approximately %.2f%% of the variance in salary based on its R-squared value.",
        rsq * 100
      )
    )
  }
}

# ============================================================
# 9. RECOMMENDATIONS
# ============================================================

out <- c(
  out,
  "",
  "9. Recommendations",
  "------------------"
)

out <- c(
  out,
  "1. Use the best-performing classification model identified by the actual F1 Score for placement prediction.",
  "2. Monitor academic performance, employability skills, internships, projects, attendance and backlogs as part of student development programs.",
  "3. Provide targeted training based on areas where students show lower performance in the analytical results.",
  "4. Use salary regression results as statistical estimates rather than guaranteed salary outcomes.",
  "5. Periodically update the dataset and retrain the models when new student placement records become available.",
  "6. Use statistical associations as decision-support information rather than as evidence of direct causation."
)

# ============================================================
# 10. CONCLUSION
# ============================================================

out <- c(
  out,
  "",
  "10. Conclusion",
  "--------------"
)

# ------------------------------------------------------------
# Dynamic conclusion
# ------------------------------------------------------------

if (
  !is.null(df_best) &&
  "Best_Model" %in% names(df_best) &&
  "Best_F1_Score" %in% names(df_best)
) {
  
  dynamic_model <- as.character(
    df_best$Best_Model[1]
  )
  
  dynamic_f1 <- as.numeric(
    df_best$Best_F1_Score[1]
  )
  
  conclusion_text <- paste0(
    "Based on the calculated results, ",
    dynamic_model,
    " achieved the highest F1 Score of ",
    sprintf("%.4f", dynamic_f1),
    " among the evaluated placement models."
  )
  
  out <- c(
    out,
    conclusion_text
  )
  
} else {
  
  out <- c(
    out,
    "A complete model-based conclusion could not be generated because the required model comparison results were unavailable."
  )
}

out <- c(
  out,
  "",
  "The analytical workflow integrates data preprocessing,",
  "exploratory analysis, visualization, machine learning",
  "classification and salary regression to support",
  "data-driven student employability analysis.",
  "",
  "Statistical association does not necessarily imply causation."
)

# ============================================================
# 11. Save Final Report
# ============================================================

report_path <- "../results/final_report_summary.txt"

writeLines(
  out,
  report_path
)

# ============================================================
# 12. Console Confirmation
# ============================================================

cat("\n")
cat("============================================================\n")
cat("FINAL REPORT GENERATED SUCCESSFULLY\n")
cat("============================================================\n")
cat(
  "Report saved to:\n",
  report_path,
  "\n"
)
cat(
  "Total report lines:",
  length(out),
  "\n"
)
cat("============================================================\n")