import glob
import re

files = glob.glob(r"c:\Users\gczop\Desktop\APLIKACJE\fiszki-system\src\content\notatki\jira\*.md")
for f in files:
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    
    new_content = re.sub(r"category: 'Narzędzia i Procesy'", "category: 'Jira'", content)
    
    with open(f, "w", encoding="utf-8") as file:
        file.write(new_content)
    print(f"Updated {f}")
