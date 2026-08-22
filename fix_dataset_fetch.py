with open("src/context/DatasetContext.tsx", "r") as f:
    text = f.read()

import re
text = text.replace(
    "const response = await fetch('/student_academic_placement_performance_dataset(1).csv');",
    "const response = await fetch(`${import.meta.env.BASE_URL}student_academic_placement_performance_dataset(1).csv`);"
)

with open("src/context/DatasetContext.tsx", "w") as f:
    f.write(text)
