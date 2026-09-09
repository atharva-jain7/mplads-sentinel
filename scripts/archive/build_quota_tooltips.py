path = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend\src\pages\DashboardPage.jsx"
with open(path, "r", encoding="utf-8") as f:
    code = f.read()

# Add Tooltip import if not present
if "import Tooltip from '../components/Tooltip';" not in code:
    code = code.replace("import KPICard from '../components/KPICard';", "import KPICard from '../components/KPICard';\nimport Tooltip from '../components/Tooltip';")

# Wrap Quota components with Tooltips
quota_block_old = """            {/* Quota Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-700 font-medium">
                <span>Sanctioned Allocation: <b>₹3.80 Cr (76.0%)</b></span>
                <span className="text-slate-500 font-mono">Disbursed on Site: ₹2.95 Cr (59.0%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                <div style={{ width: '59%' }} className="bg-emerald-600 h-full" title="Disbursed: ₹2.95 Cr" />
                <div style={{ width: '17%' }} className="bg-blue-600 h-full" title="Sanctioned Balance: ₹0.85 Cr" />
                <div style={{ width: '10%' }} className="bg-amber-500 h-full" title="Recommended: ₹0.50 Cr" />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                <span>₹2.95 Cr Disbursed</span>
                <span>₹3.80 Cr Sanctioned</span>
                <span>₹4.30 Cr Recommended</span>
                <span>₹5.00 Cr Quota</span>
              </div>
            </div>"""

quota_block_new = """            {/* Quota Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-700 font-medium">
                <Tooltip title="SANCTIONED ALLOCATION" content="Approved by District Magistrate after technical feasibility appraisal." position="top">
                  <span className="cursor-help flex items-center gap-1">
                    Sanctioned Allocation: <b>₹3.80 Cr (76.0%)</b>
                  </span>
                </Tooltip>
                <Tooltip title="DISBURSED ON SITE" content="Released in tranches against verified Measurement Book milestone entries." position="top">
                  <span className="text-slate-500 font-mono cursor-help">Disbursed on Site: ₹2.95 Cr (59.0%)</span>
                </Tooltip>
              </div>

              <Tooltip title="ANNUAL QUOTA BREAKDOWN" content="Rule 2.1: ₹5.00 Cr annual entitlement under MPLADS scheme guidelines." position="top" className="w-full">
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex cursor-help shadow-inner border border-slate-200">
                  <div style={{ width: '59%' }} className="bg-emerald-600 h-full transition-all" title="Disbursed: ₹2.95 Cr" />
                  <div style={{ width: '17%' }} className="bg-blue-600 h-full transition-all" title="Sanctioned Balance: ₹0.85 Cr" />
                  <div style={{ width: '10%' }} className="bg-amber-500 h-full transition-all" title="Recommended: ₹0.50 Cr" />
                </div>
              </Tooltip>

              <div className="flex justify-between text-[11px] text-slate-400 pt-0.5 font-mono">
                <Tooltip title="DISBURSED" content="Actual funds transferred to Implementing Agencies.">
                  <span className="cursor-help hover:text-slate-700">₹2.95 Cr Disbursed</span>
                </Tooltip>
                <Tooltip title="SANCTIONED" content="Formally sanctioned by District Collector.">
                  <span className="cursor-help hover:text-slate-700">₹3.80 Cr Sanctioned</span>
                </Tooltip>
                <Tooltip title="RECOMMENDED" content="Projects recommended by Hon'ble MP awaiting scrutiny.">
                  <span className="cursor-help hover:text-slate-700">₹4.30 Cr Recommended</span>
                </Tooltip>
                <Tooltip title="ANNUAL QUOTA" content="Maximum annual entitlement under MoSPI guidelines.">
                  <span className="cursor-help hover:text-slate-700">₹5.00 Cr Quota</span>
                </Tooltip>
              </div>
            </div>"""

code = code.replace(quota_block_old, quota_block_new)

with open(path, "w", encoding="utf-8") as f:
    f.write(code)

print("DashboardPage updated with Quota tooltips.")