import re
with open("R/03_visualization.R", "r") as f:
    text = f.read()

# Let's cleanly rewrite the bottom section F. FINAL MESSAGE
# I will just replace the whole section to be safe

final_msg = """# ============================================================
# F. FINAL MESSAGE
# ============================================================

cat("\\n")
cat("====================================================\\n")
cat("VISUALIZATION ANALYSIS COMPLETED SUCCESSFULLY\\n")
cat("====================================================\\n")
cat("Total records used:", nrow(data), "\\n")
cat("Total variables:", ncol(data), "\\n")
cat("25 visualizations generated.\\n")
cat("All figures saved to: results/figures/\\n")
cat("Correlation matrix saved to: results/tables/\\n")
cat("====================================================\\n")
"""

text = re.sub(r'# ============================================================# F\. FINAL MESSAGE.*', final_msg, text, flags=re.DOTALL)
# Also fix the weird inline stuff if it happened
text = text.replace('cat("")cat("====================================================")cat("VISUALIZATION ANALYSIS COMPLETED SUCCESSFULLY")cat("====================================================")cat("Total records used:", nrow(data), "")cat("Total variables:", ncol(data), "")cat("25 visualizations generated.\\n")cat("All figures saved to: results/figures/")cat("Correlation matrix saved to: results/tables/")cat("====================================================")', final_msg)

with open("R/03_visualization.R", "w") as f:
    f.write(text)
