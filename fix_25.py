import re

with open("R/03_visualization.R", "r") as f:
    text = f.read()

addition = """pr_cert <- data %>% filter(!is.na(certifications)) %>% mutate(grp = case_when(certifications == 0 ~ "0", certifications == 1 ~ "1", certifications == 2 ~ "2", certifications >= 3 ~ "3+", TRUE ~ NA_character_)) %>% filter(!is.na(grp)) %>% mutate(grp = factor(grp, levels = c("0", "1", "2", "3+"))) %>% group_by(grp) %>% summarise(Placement_Rate = mean(placement_status == "Placed", na.rm = TRUE) * 100, .groups = "drop")
plot_pr(pr_cert, "grp", "Placement Rate by Certifications", "placement_rate_certifications.png")

# ============================================================"""

text = text.replace("# ============================================================\n# E. CORRELATION ANALYSIS", addition + "\n# E. CORRELATION ANALYSIS")
text = text.replace("24 visualizations generated.", "25 visualizations generated.\\n")

# Fixing the newlines on the cat statements since they were lost
text = text.replace('cat("")', 'cat("\\n")')
text = text.replace('cat("====================================================")', 'cat("====================================================\\n")')
text = text.replace('cat("VISUALIZATION ANALYSIS COMPLETED SUCCESSFULLY")', 'cat("VISUALIZATION ANALYSIS COMPLETED SUCCESSFULLY\\n")')
text = text.replace('cat("Total records used:", nrow(data), "")', 'cat("Total records used:", nrow(data), "\\n")')
text = text.replace('cat("Total variables:", ncol(data), "")', 'cat("Total variables:", ncol(data), "\\n")')
text = text.replace('cat("All figures saved to: results/figures/")', 'cat("All figures saved to: results/figures/\\n")')
text = text.replace('cat("Correlation matrix saved to: results/tables/")', 'cat("Correlation matrix saved to: results/tables/\\n")')

with open("R/03_visualization.R", "w") as f:
    f.write(text)
