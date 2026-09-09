path = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src\pages\DashboardPage.jsx"
with open(path, "r", encoding="utf-8") as f:
    code = f.read()

# Add constituencyWorks state
code = code.replace("const [loading, setLoading] = useState(true);", "const [loading, setLoading] = useState(true);\n  const [constituencyWorks, setConstituencyWorks] = useState([]);")

# Fetch projects live in loadData
fetch_block = """        const res = await api.getDashboardSummary();
        setSummary(res);
        try {
          const pRes = await api.getProjects({ district: 'Pune', size: 10, sortBy: 'riskScore', sortDirection: 'desc' });
          if (pRes && pRes.content && pRes.content.length > 0) {
            setConstituencyWorks(pRes.content);
          }
        } catch (errProjects) {
          console.warn('Could not fetch constituency works live:', errProjects);
        }"""

code = code.replace("        const res = await api.getDashboardSummary();\n        setSummary(res);", fetch_block)

# Update displayWorks mapping
target_mapping = """  const s = summary || {};

  // Works recommended by the MP in Pune Parliamentary Constituency
  const mpAssignedWorks = ["""

replacement_mapping = """  const s = summary || {};

  // Display constituency works live from database if available, else fallback
  const displayWorks = constituencyWorks.length > 0 ? constituencyWorks : ["""

code = code.replace(target_mapping, replacement_mapping)

code = code.replace("                  {mpAssignedWorks.map((work) => (", "                  {displayWorks.map((work) => (")
code = code.replace("{mpAssignedWorks.length} Active Portfolio Works", "{displayWorks.length} Active Portfolio Works")

with open(path, "w", encoding="utf-8") as f:
    f.write(code)

print("DashboardPage updated to show live imported works for MP.")