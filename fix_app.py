with open("src/App.tsx", "r") as f:
    text = f.read()

text = text.replace("<BrowserRouter>", '<BrowserRouter basename="/R-PROGRAMMING-BASED-STUDENT-EMPLOYABILITY-ANALYTICS/">')

with open("src/App.tsx", "w") as f:
    f.write(text)
