path = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\backend\src\main\java\com\sih26102\sentinel\service\ProjectService.java"
with open(path, "r", encoding="utf-8") as f:
    code = f.read()

target = """            String[] tokens = line.split(",(?=(?:[^"]*"[^"]*")*[^"]*$)");
            for (int t = 0; t < tokens.length; t++) {
                tokens[t] = tokens[t].trim().replaceAll("^"|"$", "");
            }"""

replacement = """            String[] tokens = line.split(",");
            for (int t = 0; t < tokens.length; t++) {
                String val = tokens[t].trim();
                if (val.startsWith("\\"") && val.endsWith("\\"") && val.length() >= 2) {
                    val = val.substring(1, val.length() - 1).trim();
                }
                tokens[t] = val;
            }"""

if target in code:
    code = code.replace(target, replacement)
    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Replaced cleanly!")
else:
    print("Target not found, inspecting...")