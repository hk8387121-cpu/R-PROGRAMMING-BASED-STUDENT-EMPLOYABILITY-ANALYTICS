with open("src/context/DatasetContext.tsx", "r") as f:
    text = f.read()
text = text.replace("import.meta.env.BASE_URL", "(import.meta as any).env.BASE_URL")
with open("src/context/DatasetContext.tsx", "w") as f:
    f.write(text)
