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

# Correlation heatmap
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
