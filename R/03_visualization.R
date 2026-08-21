# 03_visualization.R
library(readr)
library(ggplot2)
library(corrplot)
library(dplyr)

# Load dataset
data <- read_csv("../results/tables/cleaned_dataset.csv", show_col_types = FALSE)
data$placement_status <- as.factor(data$placement_status)

# Create output directory
dir.create("../results/figures", showWarnings = FALSE, recursive = TRUE)

save_plot <- function(filename, plot_obj) {
  ggsave(paste0("../results/figures/", filename), plot = plot_obj, width = 8, height = 6)
}

# ==========================================
# ACADEMIC VISUALIZATIONS
# ==========================================
save_plot("ssc_distribution.png", ggplot(data, aes(x=ssc_percentage)) + geom_histogram(bins=30, fill="steelblue", color="black", alpha=0.7) + labs(title="SSC Percentage Distribution", x="SSC %", y="Count") + theme_minimal())
save_plot("hsc_distribution.png", ggplot(data, aes(x=hsc_percentage)) + geom_histogram(bins=30, fill="steelblue", color="black", alpha=0.7) + labs(title="HSC Percentage Distribution", x="HSC %", y="Count") + theme_minimal())
save_plot("degree_distribution.png", ggplot(data, aes(x=degree_percentage)) + geom_histogram(bins=30, fill="steelblue", color="black", alpha=0.7) + labs(title="Degree Percentage Distribution", x="Degree %", y="Count") + theme_minimal())
save_plot("cgpa_distribution.png", ggplot(data, aes(x=cgpa)) + geom_histogram(bins=30, fill="steelblue", color="black", alpha=0.7) + labs(title="CGPA Distribution", x="CGPA", y="Count") + theme_minimal())
save_plot("entrance_exam_distribution.png", ggplot(data, aes(x=entrance_exam_score)) + geom_histogram(bins=30, fill="steelblue", color="black", alpha=0.7) + labs(title="Entrance Exam Score Distribution", x="Score", y="Count") + theme_minimal())

# ==========================================
# EMPLOYABILITY VISUALIZATIONS
# ==========================================
save_plot("technical_skill_distribution.png", ggplot(data, aes(x=technical_skill_score)) + geom_histogram(bins=30, fill="darkgreen", color="black", alpha=0.7) + labs(title="Technical Skill Distribution", x="Score", y="Count") + theme_minimal())
save_plot("soft_skill_distribution.png", ggplot(data, aes(x=soft_skill_score)) + geom_histogram(bins=30, fill="darkgreen", color="black", alpha=0.7) + labs(title="Soft Skill Distribution", x="Score", y="Count") + theme_minimal())
save_plot("internship_distribution.png", ggplot(data, aes(x=internship_count)) + geom_bar(fill="darkgreen", color="black", alpha=0.7) + labs(title="Internship Count Distribution", x="Count", y="Frequency") + theme_minimal())
save_plot("live_projects_distribution.png", ggplot(data, aes(x=live_projects)) + geom_bar(fill="darkgreen", color="black", alpha=0.7) + labs(title="Live Projects Distribution", x="Count", y="Frequency") + theme_minimal())
save_plot("work_experience_distribution.png", ggplot(data, aes(x=work_experience_months)) + geom_histogram(bins=30, fill="darkgreen", color="black", alpha=0.7) + labs(title="Work Experience Distribution", x="Months", y="Count") + theme_minimal())
save_plot("certifications_distribution.png", ggplot(data, aes(x=certifications)) + geom_bar(fill="darkgreen", color="black", alpha=0.7) + labs(title="Certifications Distribution", x="Count", y="Frequency") + theme_minimal())
save_plot("attendance_distribution.png", ggplot(data, aes(x=attendance_percentage)) + geom_histogram(bins=30, fill="darkgreen", color="black", alpha=0.7) + labs(title="Attendance Distribution", x="%", y="Count") + theme_minimal())
save_plot("backlog_distribution.png", ggplot(data, aes(x=backlogs)) + geom_bar(fill="darkgreen", color="black", alpha=0.7) + labs(title="Backlog Distribution", x="Count", y="Frequency") + theme_minimal())
save_plot("extracurricular_distribution.png", ggplot(data, aes(x=as.factor(extracurricular_activities)))) + geom_bar(fill="darkgreen", color="black", alpha=0.7) + labs(title="Extracurricular Activities Distribution", x="Activities", y="Frequency") + theme_minimal())

# ==========================================
# OUTCOME VISUALIZATIONS
# ==========================================
save_plot("placement_distribution.png", ggplot(data, aes(x=placement_status, fill=placement_status)) + geom_bar(color="black", alpha=0.8) + labs(title="Placement Status Distribution", x="Status", y="Count") + theme_minimal())
save_plot("salary_distribution.png", ggplot(data %>% filter(salary_package_lpa > 0), aes(x=salary_package_lpa)) + geom_histogram(bins=30, fill="purple", color="black", alpha=0.7) + labs(title="Salary Package Distribution", x="LPA", y="Count") + theme_minimal())

# ==========================================
# PLACEMENT ANALYSIS (RATE = Placed / Total)
# ==========================================
plot_pr <- function(df, x_var, title, filename) {
  p <- ggplot(df, aes_string(x=x_var, y="Placement_Rate")) +
    geom_bar(stat="identity", fill="coral", color="black", alpha=0.8) +
    geom_text(aes(label=sprintf("%.1f%%", Placement_Rate)), vjust=-0.5, size=3.5) +
    labs(title=title, x=x_var, y="Placement Rate (%)") +
    theme_minimal() +
    theme(axis.text.x = element_text(angle=45, hjust=1))
  save_plot(filename, p)
}

# 17. CGPA
pr_cgpa <- data %>%
  mutate(grp = cut(cgpa, breaks=c(-Inf, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, Inf), labels=c("<6.0", "6.0-6.5", "6.5-7.0", "7.0-7.5", "7.5-8.0", "8.0-8.5", "8.5-9.0", "9.0+"))) %>%
  group_by(grp) %>% summarise(Placement_Rate = mean(placement_status == "Placed") * 100, .groups="drop")
plot_pr(pr_cgpa, "grp", "Placement Rate by CGPA Range", "placement_rate_cgpa.png")

# 18. Internship Count
pr_int <- data %>% mutate(grp = as.factor(internship_count)) %>%
  group_by(grp) %>% summarise(Placement_Rate = mean(placement_status == "Placed") * 100, .groups="drop")
plot_pr(pr_int, "grp", "Placement Rate by Internship Count", "placement_rate_internships.png")

# 19. Technical Skill Range
pr_tech <- data %>% mutate(grp = cut(technical_skill_score, breaks=5)) %>%
  group_by(grp) %>% summarise(Placement_Rate = mean(placement_status == "Placed") * 100, .groups="drop")
plot_pr(pr_tech, "grp", "Placement Rate by Technical Skill Range", "placement_rate_technical_skill.png")

# 20. Soft Skill Range
pr_soft <- data %>% mutate(grp = cut(soft_skill_score, breaks=5)) %>%
  group_by(grp) %>% summarise(Placement_Rate = mean(placement_status == "Placed") * 100, .groups="drop")
plot_pr(pr_soft, "grp", "Placement Rate by Soft Skill Range", "placement_rate_soft_skill.png")

# 21. Attendance Range
pr_att <- data %>% mutate(grp = cut(attendance_percentage, breaks=c(-Inf, 60, 70, 80, 90, 100), labels=c("<60", "60-70", "70-80", "80-90", "90-100"))) %>%
  group_by(grp) %>% summarise(Placement_Rate = mean(placement_status == "Placed") * 100, .groups="drop")
plot_pr(pr_att, "grp", "Placement Rate by Attendance Range", "placement_rate_attendance.png")

# 22. Backlog Range
pr_back <- data %>% mutate(grp = as.factor(backlogs)) %>%
  group_by(grp) %>% summarise(Placement_Rate = mean(placement_status == "Placed") * 100, .groups="drop")
plot_pr(pr_back, "grp", "Placement Rate by Backlog Range", "placement_rate_backlogs.png")

# 23. Live Projects
pr_proj <- data %>% mutate(grp = as.factor(live_projects)) %>%
  group_by(grp) %>% summarise(Placement_Rate = mean(placement_status == "Placed") * 100, .groups="drop")
plot_pr(pr_proj, "grp", "Placement Rate by Live Projects", "placement_rate_projects.png")

# 24. Work Experience
pr_exp <- data %>% mutate(grp = cut(work_experience_months, breaks=4)) %>%
  group_by(grp) %>% summarise(Placement_Rate = mean(placement_status == "Placed") * 100, .groups="drop")
plot_pr(pr_exp, "grp", "Placement Rate by Work Experience", "placement_rate_experience.png")

# ==========================================
# CORRELATION
# ==========================================
numeric_data <- data %>% select(where(is.numeric))
cor_matrix <- cor(numeric_data, use = "complete.obs")
png("../results/figures/correlation_heatmap.png", width = 800, height = 800)
corrplot(cor_matrix, method = "color", type = "upper", order = "hclust", tl.col = "black", tl.srt = 45, addCoef.col = "black", number.cex = 0.7)
invisible(dev.off())

cat("All 25 visualizations generated and saved to results/figures/\n")
