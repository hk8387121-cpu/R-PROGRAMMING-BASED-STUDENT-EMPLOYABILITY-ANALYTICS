# 03_visualization.R
library(readr)
library(ggplot2)
library(corrplot)
library(dplyr)

# Load dataset
data <- read_csv("../results/tables/cleaned_dataset.csv", show_col_types = FALSE)
data$placement_status <- as.factor(data$placement_status)

# Create output directory if it doesn't exist
dir.create("../results/figures", showWarnings = FALSE, recursive = TRUE)

save_plot <- function(filename, plot_obj) {
  ggsave(paste0("../results/figures/", filename), plot = plot_obj, width = 8, height = 6)
}

# --- Original Visualizations ---

# 1. Placement status distribution
p1 <- ggplot(data, aes(x = placement_status, fill = placement_status)) +
  geom_bar() +
  labs(title = "Placement Status Distribution", x = "Placement Status", y = "Count") +
  theme_minimal()
save_plot("placement_distribution.png", p1)

# 2. Academic performance (using CGPA as proxy)
p2 <- ggplot(data, aes(x = cgpa)) +
  geom_histogram(bins = 30, fill = "blue", alpha = 0.7) +
  labs(title = "Academic Performance (CGPA)", x = "CGPA", y = "Count") +
  theme_minimal()
save_plot("academic_performance.png", p2)

# 3. CGPA vs placement
p3 <- ggplot(data, aes(x = placement_status, y = cgpa, fill = placement_status)) +
  geom_boxplot() +
  labs(title = "CGPA by Placement Status", x = "Placement Status", y = "CGPA") +
  theme_minimal()
save_plot("cgpa_placement.png", p3)

# 4. Technical skill vs placement
p4 <- ggplot(data, aes(x = placement_status, y = technical_skill_score, fill = placement_status)) +
  geom_boxplot() +
  labs(title = "Technical Skill by Placement Status", x = "Placement Status", y = "Technical Skill Score") +
  theme_minimal()
save_plot("skill_analysis.png", p4)

# --- Additional Distributions ---

# Helper function for histogram
plot_dist <- function(col_name, title, binwidth = NULL) {
  p <- ggplot(data, aes_string(x = col_name)) +
    geom_histogram(fill = "steelblue", color = "black", alpha = 0.7, binwidth = binwidth, bins = ifelse(is.null(binwidth), 30, NULL)) +
    labs(title = title, x = col_name, y = "Count") +
    theme_minimal()
  save_plot(paste0(col_name, "_distribution.png"), p)
}

# 1-4. Percentages & Scores
plot_dist("ssc_percentage", "SSC Percentage Distribution")
plot_dist("hsc_percentage", "HSC Percentage Distribution")
plot_dist("degree_percentage", "Degree Percentage Distribution")
plot_dist("entrance_exam_score", "Entrance Exam Score Distribution")

# 5-6. Skills
plot_dist("technical_skill_score", "Technical Skill Distribution")
plot_dist("soft_skill_score", "Soft Skill Distribution")

# 7-10. Counts (discreteish, but treat as continuous for hist)
plot_dist("internship_count", "Internship Count Distribution", binwidth = 1)
plot_dist("live_projects", "Live Projects Distribution", binwidth = 1)
plot_dist("work_experience_months", "Work Experience Distribution", binwidth = 6)
plot_dist("certifications", "Certifications Distribution", binwidth = 1)

# 11-12. Academic factors
plot_dist("attendance_percentage", "Attendance Distribution")
plot_dist("backlogs", "Backlog Distribution", binwidth = 1)

# 13. Salary Package Distribution (Exclude 0s if they mean unplaced, but dataset may already have 0s)
p_salary <- ggplot(data %>% filter(salary_package_lpa > 0), aes(x = salary_package_lpa)) +
  geom_histogram(bins = 30, fill = "seagreen", color = "black", alpha = 0.7) +
  labs(title = "Salary Package Distribution (Placed Students)", x = "Salary (LPA)", y = "Count") +
  theme_minimal()
save_plot("salary_package_lpa_distribution.png", p_salary)


# --- Placement Rate Charts ---

# Helper function to plot placement rate by categorical/binned feature
plot_placement_rate <- function(binned_data, x_col, title, filename) {
  p <- ggplot(binned_data, aes_string(x = x_col, y = "Placement_Rate")) +
    geom_bar(stat = "identity", fill = "coral", color = "black", alpha = 0.8) +
    geom_text(aes(label = sprintf("%.1f%%", Placement_Rate)), vjust = -0.5, size = 3) +
    labs(title = title, x = x_col, y = "Placement Rate (%)") +
    theme_minimal() +
    theme(axis.text.x = element_text(angle = 45, hjust = 1))
  save_plot(filename, p)
}

# 14. Placement Rate by CGPA Range
data <- data %>%
  mutate(cgpa_bin = cut(cgpa, breaks = c(-Inf, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, Inf),
                        labels = c("<6.0", "6.0-6.5", "6.5-7.0", "7.0-7.5", "7.5-8.0", "8.0-8.5", "8.5-9.0", "9.0+")))

cgpa_pr <- data %>% group_by(cgpa_bin) %>%
  summarise(Placement_Rate = mean(placement_status == "Placed") * 100, count = n(), .groups = 'drop')
plot_placement_rate(cgpa_pr, "cgpa_bin", "Placement Rate by CGPA Range", "pr_cgpa.png")

# 15. Placement Rate by Internship Count
intern_pr <- data %>% group_by(internship_count) %>%
  summarise(Placement_Rate = mean(placement_status == "Placed") * 100, count = n(), .groups = 'drop') %>%
  mutate(internship_count = as.factor(internship_count))
plot_placement_rate(intern_pr, "internship_count", "Placement Rate by Internship Count", "pr_internship.png")

# 16. Placement Rate by Technical Skill Range
data <- data %>%
  mutate(tech_bin = cut(technical_skill_score, breaks = 5))
tech_pr <- data %>% group_by(tech_bin) %>%
  summarise(Placement_Rate = mean(placement_status == "Placed") * 100, count = n(), .groups = 'drop')
plot_placement_rate(tech_pr, "tech_bin", "Placement Rate by Technical Skill Range", "pr_tech_skill.png")

# 17. Placement Rate by Soft Skill Range
data <- data %>%
  mutate(soft_bin = cut(soft_skill_score, breaks = 5))
soft_pr <- data %>% group_by(soft_bin) %>%
  summarise(Placement_Rate = mean(placement_status == "Placed") * 100, count = n(), .groups = 'drop')
plot_placement_rate(soft_pr, "soft_bin", "Placement Rate by Soft Skill Range", "pr_soft_skill.png")

# 18. Placement Rate by Attendance Range
data <- data %>%
  mutate(att_bin = cut(attendance_percentage, breaks = c(-Inf, 60, 70, 80, 90, 100),
                       labels = c("<60", "60-70", "70-80", "80-90", "90-100")))
att_pr <- data %>% group_by(att_bin) %>%
  summarise(Placement_Rate = mean(placement_status == "Placed") * 100, count = n(), .groups = 'drop')
plot_placement_rate(att_pr, "att_bin", "Placement Rate by Attendance Range", "pr_attendance.png")

# 19. Placement Rate by Backlog Range
backlog_pr <- data %>% group_by(backlogs) %>%
  summarise(Placement_Rate = mean(placement_status == "Placed") * 100, count = n(), .groups = 'drop') %>%
  mutate(backlogs = as.factor(backlogs))
plot_placement_rate(backlog_pr, "backlogs", "Placement Rate by Backlog Range", "pr_backlogs.png")


# --- Correlation Heatmap ---
numeric_data <- data %>% select(where(is.numeric))
cor_matrix <- cor(numeric_data, use = "complete.obs")

# Save correlation matrix to CSV
cor_df <- as.data.frame(cor_matrix)
cor_df$Feature <- rownames(cor_matrix)
cor_df <- cor_df %>% select(Feature, everything())
write_csv(cor_df, "../results/tables/correlation_matrix.csv")

png("../results/figures/correlation_heatmap.png", width = 800, height = 800)
corrplot(cor_matrix, method = "color", type = "upper", order = "hclust",
         tl.col = "black", tl.srt = 45, addCoef.col = "black", number.cex = 0.7)
dev.off()

cat("Visualizations generated and saved to results/figures/\n")
cat("Correlation matrix saved to results/tables/correlation_matrix.csv\n")
