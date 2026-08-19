# 03_visualization.R

library(readr)
library(ggplot2)
library(corrplot)
library(dplyr)

# Load dataset
data <- read_csv("../results/tables/cleaned_dataset.csv")
data$placement_status <- as.factor(data$placement_status)

# Create output directory if it doesn't exist
dir.create("../results/figures", showWarnings = FALSE, recursive = TRUE)

save_plot <- function(filename, plot_obj) {
  ggsave(paste0("../results/figures/", filename), plot = plot_obj, width = 8, height = 6)
}

# 1. Placement status distribution
p1 <- ggplot(data, aes(x = placement_status, fill = placement_status)) +
  geom_bar() +
  labs(title = "Placement Status Distribution", x = "Placement Status", y = "Count") +
  theme_minimal()
save_plot("01_placement_distribution.png", p1)

# 5. CGPA distribution
p5 <- ggplot(data, aes(x = cgpa)) +
  geom_histogram(bins = 30, fill = "blue", alpha = 0.7) +
  labs(title = "CGPA Distribution", x = "CGPA", y = "Count") +
  theme_minimal()
save_plot("05_cgpa_distribution.png", p5)

# 16. CGPA vs placement
p16 <- ggplot(data, aes(x = placement_status, y = cgpa, fill = placement_status)) +
  geom_boxplot() +
  labs(title = "CGPA by Placement Status", x = "Placement Status", y = "CGPA") +
  theme_minimal()
save_plot("16_cgpa_vs_placement.png", p16)

# 17. Technical skill vs placement
p17 <- ggplot(data, aes(x = placement_status, y = technical_skill_score, fill = placement_status)) +
  geom_boxplot() +
  labs(title = "Technical Skill by Placement Status", x = "Placement Status", y = "Technical Skill Score") +
  theme_minimal()
save_plot("17_tech_skill_vs_placement.png", p17)

# 23. Correlation heatmap
numeric_data <- data %>% select(where(is.numeric))
cor_matrix <- cor(numeric_data, use = "complete.obs")
png("../results/figures/23_correlation_heatmap.png", width = 800, height = 800)
corrplot(cor_matrix, method = "color", type = "upper", order = "hclust",
         tl.col = "black", tl.srt = 45, addCoef.col = "black", number.cex = 0.7)
dev.off()

cat("Visualizations generated and saved to results/figures/\n")
