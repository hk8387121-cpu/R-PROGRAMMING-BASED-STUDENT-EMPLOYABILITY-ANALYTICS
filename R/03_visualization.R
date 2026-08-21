# ============================================================
# 03_visualization.R
# Student Employability Analytics and Placement Prediction
# ============================================================

# ------------------------------------------------------------
# 1. Load Required Libraries
# ------------------------------------------------------------

library(readr)
library(ggplot2)
library(corrplot)
library(dplyr)

# ------------------------------------------------------------
# 2. Load Cleaned Dataset
# ------------------------------------------------------------

data <- read_csv(
  "../results/tables/cleaned_dataset.csv",
  show_col_types = FALSE
)

# Convert placement status to factor
data$placement_status <- as.factor(data$placement_status)

# ------------------------------------------------------------
# 3. Create Output Directory
# ------------------------------------------------------------

dir.create(
  "../results/figures",
  showWarnings = FALSE,
  recursive = TRUE
)

# ------------------------------------------------------------
# 4. Function to Save Plots
# ------------------------------------------------------------

save_plot <- function(filename, plot_obj) {
  
  ggsave(
    filename = paste0("../results/figures/", filename),
    plot = plot_obj,
    width = 8,
    height = 6,
    dpi = 300
  )
}

# ============================================================
# A. ACADEMIC VISUALIZATIONS
# ============================================================

# ------------------------------------------------------------
# 1. SSC Percentage Distribution
# ------------------------------------------------------------

save_plot(
  "ssc_distribution.png",
  
  ggplot(data, aes(x = ssc_percentage)) +
    geom_histogram(
      bins = 30,
      fill = "steelblue",
      color = "black",
      alpha = 0.7
    ) +
    labs(
      title = "SSC Percentage Distribution",
      x = "SSC Percentage",
      y = "Number of Students"
    ) +
    theme_minimal()
)

# ------------------------------------------------------------
# 2. HSC Percentage Distribution
# ------------------------------------------------------------

save_plot(
  "hsc_distribution.png",
  
  ggplot(data, aes(x = hsc_percentage)) +
    geom_histogram(
      bins = 30,
      fill = "steelblue",
      color = "black",
      alpha = 0.7
    ) +
    labs(
      title = "HSC Percentage Distribution",
      x = "HSC Percentage",
      y = "Number of Students"
    ) +
    theme_minimal()
)

# ------------------------------------------------------------
# 3. Degree Percentage Distribution
# ------------------------------------------------------------

save_plot(
  "degree_distribution.png",
  
  ggplot(data, aes(x = degree_percentage)) +
    geom_histogram(
      bins = 30,
      fill = "steelblue",
      color = "black",
      alpha = 0.7
    ) +
    labs(
      title = "Degree Percentage Distribution",
      x = "Degree Percentage",
      y = "Number of Students"
    ) +
    theme_minimal()
)

# ------------------------------------------------------------
# 4. CGPA Distribution
# ------------------------------------------------------------

save_plot(
  "cgpa_distribution.png",
  
  ggplot(data, aes(x = cgpa)) +
    geom_histogram(
      bins = 30,
      fill = "steelblue",
      color = "black",
      alpha = 0.7
    ) +
    labs(
      title = "CGPA Distribution",
      x = "CGPA",
      y = "Number of Students"
    ) +
    theme_minimal()
)

# ------------------------------------------------------------
# 5. Entrance Exam Score Distribution
# ------------------------------------------------------------

save_plot(
  "entrance_exam_distribution.png",
  
  ggplot(data, aes(x = entrance_exam_score)) +
    geom_histogram(
      bins = 30,
      fill = "steelblue",
      color = "black",
      alpha = 0.7
    ) +
    labs(
      title = "Entrance Exam Score Distribution",
      x = "Entrance Exam Score",
      y = "Number of Students"
    ) +
    theme_minimal()
)

# ============================================================
# B. EMPLOYABILITY VISUALIZATIONS
# ============================================================

# ------------------------------------------------------------
# 6. Technical Skill Distribution
# ------------------------------------------------------------

save_plot(
  "technical_skill_distribution.png",
  
  ggplot(data, aes(x = technical_skill_score)) +
    geom_histogram(
      bins = 30,
      fill = "darkgreen",
      color = "black",
      alpha = 0.7
    ) +
    labs(
      title = "Technical Skill Score Distribution",
      x = "Technical Skill Score",
      y = "Number of Students"
    ) +
    theme_minimal()
)

# ------------------------------------------------------------
# 7. Soft Skill Distribution
# ------------------------------------------------------------

save_plot(
  "soft_skill_distribution.png",
  
  ggplot(data, aes(x = soft_skill_score)) +
    geom_histogram(
      bins = 30,
      fill = "darkgreen",
      color = "black",
      alpha = 0.7
    ) +
    labs(
      title = "Soft Skill Score Distribution",
      x = "Soft Skill Score",
      y = "Number of Students"
    ) +
    theme_minimal()
)

# ------------------------------------------------------------
# 8. Internship Count Distribution
# ------------------------------------------------------------

save_plot(
  "internship_distribution.png",
  
  ggplot(data, aes(x = as.factor(internship_count))) +
    geom_bar(
      fill = "darkgreen",
      color = "black",
      alpha = 0.7
    ) +
    labs(
      title = "Internship Count Distribution",
      x = "Number of Internships",
      y = "Number of Students"
    ) +
    theme_minimal()
)

# ------------------------------------------------------------
# 9. Live Projects Distribution
# ------------------------------------------------------------

save_plot(
  "live_projects_distribution.png",
  
  ggplot(data, aes(x = as.factor(live_projects))) +
    geom_bar(
      fill = "darkgreen",
      color = "black",
      alpha = 0.7
    ) +
    labs(
      title = "Live Projects Distribution",
      x = "Number of Live Projects",
      y = "Number of Students"
    ) +
    theme_minimal()
)

# ------------------------------------------------------------
# 10. Work Experience Distribution
# ------------------------------------------------------------

save_plot(
  "work_experience_distribution.png",
  
  ggplot(data, aes(x = work_experience_months)) +
    geom_histogram(
      bins = 30,
      fill = "darkgreen",
      color = "black",
      alpha = 0.7
    ) +
    labs(
      title = "Work Experience Distribution",
      x = "Work Experience (Months)",
      y = "Number of Students"
    ) +
    theme_minimal()
)

# ------------------------------------------------------------
# 11. Certifications Distribution
# ------------------------------------------------------------

save_plot(
  "certifications_distribution.png",
  
  ggplot(data, aes(x = as.factor(certifications))) +
    geom_bar(
      fill = "darkgreen",
      color = "black",
      alpha = 0.7
    ) +
    labs(
      title = "Certifications Distribution",
      x = "Number of Certifications",
      y = "Number of Students"
    ) +
    theme_minimal()
)

# ------------------------------------------------------------
# 12. Attendance Distribution
# ------------------------------------------------------------

save_plot(
  "attendance_distribution.png",
  
  ggplot(data, aes(x = attendance_percentage)) +
    geom_histogram(
      bins = 30,
      fill = "darkgreen",
      color = "black",
      alpha = 0.7
    ) +
    labs(
      title = "Attendance Percentage Distribution",
      x = "Attendance Percentage",
      y = "Number of Students"
    ) +
    theme_minimal()
)

# ------------------------------------------------------------
# 13. Backlog Distribution
# ------------------------------------------------------------

save_plot(
  "backlog_distribution.png",
  
  ggplot(data, aes(x = as.factor(backlogs))) +
    geom_bar(
      fill = "darkgreen",
      color = "black",
      alpha = 0.7
    ) +
    labs(
      title = "Backlog Distribution",
      x = "Number of Backlogs",
      y = "Number of Students"
    ) +
    theme_minimal()
)

# ------------------------------------------------------------
# 14. Extracurricular Activities Distribution
# ------------------------------------------------------------

save_plot(
  "extracurricular_distribution.png",
  
  ggplot(
    data,
    aes(x = as.factor(extracurricular_activities))
  ) +
    geom_bar(
      fill = "darkgreen",
      color = "black",
      alpha = 0.7
    ) +
    labs(
      title = "Extracurricular Activities Distribution",
      x = "Extracurricular Activities",
      y = "Number of Students"
    ) +
    theme_minimal()
)

# ============================================================
# C. OUTCOME VISUALIZATIONS
# ============================================================

# ------------------------------------------------------------
# 15. Placement Status Distribution
# ------------------------------------------------------------

save_plot(
  "placement_distribution.png",
  
  ggplot(
    data,
    aes(
      x = placement_status,
      fill = placement_status
    )
  ) +
    geom_bar(
      color = "black",
      alpha = 0.8
    ) +
    labs(
      title = "Placement Status Distribution",
      x = "Placement Status",
      y = "Number of Students"
    ) +
    theme_minimal() +
    guides(fill = "none")
)

# ------------------------------------------------------------
# 16. Salary Package Distribution
# Only valid salary values are included
# ------------------------------------------------------------

salary_data <- data %>%
  filter(
    !is.na(salary_package_lpa),
    salary_package_lpa > 0
  )

save_plot(
  "salary_distribution.png",
  
  ggplot(
    salary_data,
    aes(x = salary_package_lpa)
  ) +
    geom_histogram(
      bins = 30,
      fill = "purple",
      color = "black",
      alpha = 0.7
    ) +
    labs(
      title = "Salary Package Distribution",
      x = "Salary Package (LPA)",
      y = "Number of Students"
    ) +
    theme_minimal()
)

# ============================================================
# D. PLACEMENT RATE ANALYSIS
# ============================================================

# Placement Rate Formula:
#
# Number of Placed Students
# ------------------------- × 100
# Total Students in Group
#
# All calculations use the complete dataset.

# ------------------------------------------------------------
# General Placement Rate Plot Function
# ------------------------------------------------------------

plot_pr <- function(
    df,
    x_var,
    title,
    filename
) {
  
  p <- ggplot(
    df,
    aes(
      x = .data[[x_var]],
      y = Placement_Rate
    )
  ) +
    geom_col(
      fill = "coral",
      color = "black",
      alpha = 0.8
    ) +
    geom_text(
      aes(
        label = sprintf(
          "%.1f%%",
          Placement_Rate
        )
      ),
      vjust = -0.5,
      size = 3.5
    ) +
    labs(
      title = title,
      x = x_var,
      y = "Placement Rate (%)"
    ) +
    theme_minimal() +
    theme(
      axis.text.x = element_text(
        angle = 45,
        hjust = 1
      )
    ) +
    scale_y_continuous(
      limits = c(
        0,
        max(df$Placement_Rate, na.rm = TRUE) * 1.15
      )
    )
  
  save_plot(
    filename,
    p
  )
}

# ------------------------------------------------------------
# 17. Placement Rate by CGPA Range
# ------------------------------------------------------------

pr_cgpa <- data %>%
  filter(!is.na(cgpa)) %>%
  mutate(
    grp = cut(
      cgpa,
      breaks = c(
        -Inf,
        6.0,
        6.5,
        7.0,
        7.5,
        8.0,
        8.5,
        9.0,
        Inf
      ),
      labels = c(
        "<6.0",
        "6.0-6.5",
        "6.5-7.0",
        "7.0-7.5",
        "7.5-8.0",
        "8.0-8.5",
        "8.5-9.0",
        "9.0+"
      ),
      include.lowest = TRUE
    )
  ) %>%
  group_by(grp) %>%
  summarise(
    Placement_Rate = mean(
      placement_status == "Placed",
      na.rm = TRUE
    ) * 100,
    .groups = "drop"
  )

plot_pr(
  pr_cgpa,
  "grp",
  "Placement Rate by CGPA Range",
  "placement_rate_cgpa.png"
)

# ------------------------------------------------------------
# 18. Placement Rate by Internship Count
# ------------------------------------------------------------

pr_int <- data %>%
  filter(!is.na(internship_count)) %>%
  mutate(
    grp = case_when(
      internship_count == 0 ~ "0",
      internship_count == 1 ~ "1",
      internship_count == 2 ~ "2",
      internship_count >= 3 ~ "3+",
      TRUE ~ NA_character_
    )
  ) %>%
  filter(!is.na(grp)) %>%
  mutate(
    grp = factor(
      grp,
      levels = c("0", "1", "2", "3+")
    )
  ) %>%
  group_by(grp) %>%
  summarise(
    Placement_Rate = mean(
      placement_status == "Placed",
      na.rm = TRUE
    ) * 100,
    .groups = "drop"
  )

plot_pr(
  pr_int,
  "grp",
  "Placement Rate by Internship Count",
  "placement_rate_internships.png"
)

# ------------------------------------------------------------
# 19. Placement Rate by Technical Skill Range
# ------------------------------------------------------------

pr_tech <- data %>%
  filter(!is.na(technical_skill_score)) %>%
  mutate(
    grp = cut(
      technical_skill_score,
      breaks = 5,
      include.lowest = TRUE
    )
  ) %>%
  group_by(grp) %>%
  summarise(
    Placement_Rate = mean(
      placement_status == "Placed",
      na.rm = TRUE
    ) * 100,
    .groups = "drop"
  )

plot_pr(
  pr_tech,
  "grp",
  "Placement Rate by Technical Skill Range",
  "placement_rate_technical_skill.png"
)

# ------------------------------------------------------------
# 20. Placement Rate by Soft Skill Range
# ------------------------------------------------------------

pr_soft <- data %>%
  filter(!is.na(soft_skill_score)) %>%
  mutate(
    grp = cut(
      soft_skill_score,
      breaks = 5,
      include.lowest = TRUE
    )
  ) %>%
  group_by(grp) %>%
  summarise(
    Placement_Rate = mean(
      placement_status == "Placed",
      na.rm = TRUE
    ) * 100,
    .groups = "drop"
  )

plot_pr(
  pr_soft,
  "grp",
  "Placement Rate by Soft Skill Range",
  "placement_rate_soft_skill.png"
)

# ------------------------------------------------------------
# 21. Placement Rate by Attendance Range
# ------------------------------------------------------------

pr_att <- data %>%
  filter(!is.na(attendance_percentage)) %>%
  mutate(
    grp = cut(
      attendance_percentage,
      breaks = c(
        -Inf,
        60,
        70,
        80,
        90,
        100,
        Inf
      ),
      labels = c(
        "<60",
        "60-70",
        "70-80",
        "80-90",
        "90-100",
        "100+"
      ),
      include.lowest = TRUE
    )
  ) %>%
  group_by(grp) %>%
  summarise(
    Placement_Rate = mean(
      placement_status == "Placed",
      na.rm = TRUE
    ) * 100,
    .groups = "drop"
  )

plot_pr(
  pr_att,
  "grp",
  "Placement Rate by Attendance Range",
  "placement_rate_attendance.png"
)

# ------------------------------------------------------------
# 22. Placement Rate by Backlog Range
# ------------------------------------------------------------

pr_back <- data %>%
  filter(!is.na(backlogs)) %>%
  mutate(
    grp = cut(
      backlogs,
      breaks = c(
        -Inf,
        0,
        2,
        4,
        Inf
      ),
      labels = c(
        "0",
        "1-2",
        "3-4",
        "5+"
      ),
      include.lowest = TRUE
    )
  ) %>%
  group_by(grp) %>%
  summarise(
    Placement_Rate = mean(
      placement_status == "Placed",
      na.rm = TRUE
    ) * 100,
    .groups = "drop"
  )

plot_pr(
  pr_back,
  "grp",
  "Placement Rate by Backlog Range",
  "placement_rate_backlogs.png"
)

# ------------------------------------------------------------
# 23. Placement Rate by Live Projects
# ------------------------------------------------------------

pr_proj <- data %>%
  filter(!is.na(live_projects)) %>%
  mutate(
    grp = case_when(
      live_projects == 0 ~ "0",
      live_projects == 1 ~ "1",
      live_projects == 2 ~ "2",
      live_projects >= 3 ~ "3+",
      TRUE ~ NA_character_
    )
  ) %>%
  filter(!is.na(grp)) %>%
  mutate(
    grp = factor(
      grp,
      levels = c(
        "0",
        "1",
        "2",
        "3+"
      )
    )
  ) %>%
  group_by(grp) %>%
  summarise(
    Placement_Rate = mean(
      placement_status == "Placed",
      na.rm = TRUE
    ) * 100,
    .groups = "drop"
  )

plot_pr(
  pr_proj,
  "grp",
  "Placement Rate by Live Projects",
  "placement_rate_projects.png"
)

# ------------------------------------------------------------
# 24. Placement Rate by Work Experience
# ------------------------------------------------------------

pr_exp <- data %>%
  filter(!is.na(work_experience_months)) %>%
  mutate(
    grp = cut(
      work_experience_months,
      breaks = 4,
      include.lowest = TRUE
    )
  ) %>%
  group_by(grp) %>%
  summarise(
    Placement_Rate = mean(
      placement_status == "Placed",
      na.rm = TRUE
    ) * 100,
    .groups = "drop"
  )

plot_pr(
  pr_exp,
  "grp",
  "Placement Rate by Work Experience",
  "placement_rate_experience.png"
)

# ============================================================
# E. CORRELATION ANALYSIS
# ============================================================

# Select numerical variables only.
# Student ID is removed because it has no analytical meaning.

numeric_data <- data %>%
  select(where(is.numeric)) %>%
  select(
    -any_of("student_id")
  )

# Calculate correlation matrix

cor_matrix <- cor(
  numeric_data,
  use = "pairwise.complete.obs"
)

# Save correlation matrix as CSV

write.csv(
  cor_matrix,
  "../results/tables/correlation_matrix.csv",
  row.names = TRUE
)

# Generate correlation heatmap

png(
  "../results/figures/correlation_heatmap.png",
  width = 1000,
  height = 1000,
  res = 120
)

corrplot(
  cor_matrix,
  method = "color",
  type = "upper",
  order = "hclust",
  tl.col = "black",
  tl.srt = 45,
  addCoef.col = "black",
  number.cex = 0.7
)

dev.off()

# ============================================================
# F. FINAL MESSAGE
# ============================================================

cat("\n")
cat("====================================================\n")
cat("VISUALIZATION ANALYSIS COMPLETED SUCCESSFULLY\n")
cat("====================================================\n")
cat("Total records used:", nrow(data), "\n")
cat("Total variables:", ncol(data), "\n")
cat("25 visualizations generated.\n")
cat("All figures saved to: results/figures/\n")
cat("Correlation matrix saved to: results/tables/\n")
cat("====================================================\n")