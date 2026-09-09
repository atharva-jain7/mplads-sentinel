path = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\backend\src\main\java\com\sih26102\sentinel\service\ProjectService.java"
with open(path, "r", encoding="utf-8") as f:
    code = f.read()

# Add import java.time.LocalDate if not present
if "import java.time.LocalDate;" not in code:
    code = code.replace("import java.time.LocalDateTime;", "import java.time.LocalDate;\nimport java.time.LocalDateTime;")

# Replace setSanctionDate
code = code.replace("p.setSanctionDate(sanctionDate);", "p.setSanctionDate(parseDate(sanctionDate, LocalDate.of(2024, 1, 15)));")
code = code.replace("p.setExpectedCompletionDate(completionDate);", "p.setExpectedCompletionDate(parseDate(completionDate, LocalDate.of(2025, 6, 30)));")

# Add parseDate helper
parse_date_helper = """
    private LocalDate parseDate(String s, LocalDate defaultVal) {
        try {
            return LocalDate.parse(s.trim());
        } catch (Exception e) {
            return defaultVal;
        }
    }
"""
if "private LocalDate parseDate" not in code:
    code = code.replace("    private int parseInt(String s, int defaultVal) {", parse_date_helper + "    private int parseInt(String s, int defaultVal) {")

with open(path, "w", encoding="utf-8") as f:
    f.write(code)
print("Updated LocalDate parsing in ProjectService.java")