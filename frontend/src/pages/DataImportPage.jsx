import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Download, 
  Play, 
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import RiskBadge from '../components/RiskBadge';

const SAMPLE_CSV = `projectId,projectName,projectType,state,district,constituency,location,latitude,longitude,sanctionedAmount,estimatedCost,expenditureAmount,progressPercentage,expectedProgressPercentage,delayDays,status,sanctionDate,expectedCompletionDate,implementingAgency,contractorName,description
MPL-REAL-201,Sub-District Trauma Center ICU Ward,Health,Maharashtra,Pune,Pune Parliamentary Constituency,Ward 12 Bibwewadi Pune,18.4720,73.8640,4500000,4500000,4200000,32.0,85.0,165,DELAYED,2023-11-15,2024-09-30,State Health Engineering Division,Apex Infrastructure Works,Emergency medical trauma wing construction with specialized pediatric beds
MPL-REAL-202,Solar High-Mast Lighting and CCTV Grid,Public Amenities,Maharashtra,Pune,Pune Parliamentary Constituency,Kothrud Sector 4,18.5074,73.8077,1500000,1500000,1480000,95.0,100.0,10,COMPLETED,2024-01-10,2024-06-30,Pune Municipal Smart Cell,SunGrid Systems Pvt Ltd,Energy-efficient community solar lighting and public safety surveillance
MPL-REAL-203,Community Multipurpose Vocational Hall,Community Infrastructure,Maharashtra,Pune,Pune Parliamentary Constituency,Hadapsar Industrial Belt,18.5089,73.9259,3200000,3200000,2900000,42.0,90.0,140,DELAYED,2023-12-01,2024-08-15,Zilla Parishad Construction Wing,Sai Builders & Contractors,Vocational skill training center and women self-help group assembly shed
MPL-REAL-204,Drinking Water RO Plant & ATM Dispenser,Drinking Water,Maharashtra,Pune,Pune Parliamentary Constituency,Warje Malwadi,18.4850,73.7990,1800000,1800000,1200000,68.0,75.0,20,IN_PROGRESS,2024-02-20,2024-11-30,Maharashtra Jeevan Pradhikaran,CleanAqua Tech Solutions,Commercial-grade 2000 LPH solar RO purification system with automated card dispensers
MPL-REAL-205,All-Weather Concrete Link Road and Culvert,Roads & Pathways,Maharashtra,Pune,Pune Parliamentary Constituency,Ambegaon Khurd,18.4480,73.8400,2800000,2800000,2750000,35.0,90.0,155,DELAYED,2023-10-05,2024-07-31,Public Works Department (PWD),Rathore Earthmovers & Civils,Cement concrete road connectivity to tribal hamlet with cross-drainage culvert`;

export default function DataImportPage() {
  const navigate = useNavigate();
  const [csvContent, setCsvContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvContent(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    setCsvContent(SAMPLE_CSV.trim());
    setFileName('mospi_real_mplads_pune_sample.csv');
    setError(null);
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV.trim()], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mospi_esakshi_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRunImport = async () => {
    if (!csvContent.trim()) {
      setError('Please select a CSV file or click "Load Sample Real Dataset".');
      return;
    }

    setImporting(true);
    setError(null);

    try {
      const res = await api.importCSV(csvContent);
      setImportResult(res);
    } catch (err) {
      setError(err.message || 'Failed to process CSV file.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-slate-800" />
            Official Dataset Ingestion & CSV Import
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ingest real MPLADS / e-SAKSHI data files to run automated AI anomaly detection and risk scoring
          </p>
        </div>

        <button
          onClick={handleDownloadTemplate}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Standard Template</span>
        </button>
      </div>

      {/* Upload Zone & Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Upload Dataset File (.csv)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Matches official MoSPI / e-SAKSHI data fields</p>
          </div>
          <button
            onClick={handleLoadSample}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
            <span>Load Sample Real Dataset (5 Works)</span>
          </button>
        </div>

        {/* Drag and drop input */}
        <div className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-6 text-center transition-colors bg-slate-50/50">
          <input
            type="file"
            id="csv-file-input"
            accept=".csv,text/csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label htmlFor="csv-file-input" className="cursor-pointer block space-y-2">
            <div className="w-10 h-10 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 hover:underline">Click to browse your CSV</span>
              <span className="text-xs text-slate-500"> or drag and drop here</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {fileName ? `Selected: ${fileName}` : 'Supports UTF-8 CSV exports from MoSPI / State Portals'}
            </p>
          </label>
        </div>

        {/* Text preview box */}
        {csvContent && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">File Contents Preview:</span>
              <span className="font-mono text-slate-400 text-[11px]">{csvContent.split('\n').length - 1} rows detected</span>
            </div>
            <textarea
              rows={6}
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              className="w-full font-mono text-[11px] p-3 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:border-slate-800 text-slate-800 leading-relaxed"
            />
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleRunImport}
            disabled={importing || !csvContent.trim()}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            {importing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Extraction & AI Anomaly Analysis...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Import Dataset & Run AI Anomaly Detection</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INGESTION & EXTRACTION RESULTS                                            */}
      {/* ========================================================================= */}
      {importResult && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Extraction & AI Analysis Complete
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                All uploaded records parsed, ingested into database, and scored across 5 AI/ML anomaly models
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
              {importResult.totalImported} Works Ingested
            </span>
          </div>

          {/* 3 Summary Metric Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Total Imported</span>
              <div className="text-lg font-bold font-mono text-slate-900">{importResult.totalImported} Works</div>
              <span className="text-[10px] text-slate-400">Added to live database</span>
            </div>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <span className="text-[11px] text-red-600 block font-medium">Critical Risk Identified</span>
              <div className="text-lg font-bold font-mono text-red-700">{importResult.criticalRiskCount} Cases</div>
              <span className="text-[10px] text-red-500">Immediate officer audit required</span>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <span className="text-[11px] text-orange-600 block font-medium">High Attention</span>
              <div className="text-lg font-bold font-mono text-orange-700">{importResult.highRiskCount} Cases</div>
              <span className="text-[10px] text-orange-500">Timeline & expenditure variance</span>
            </div>
          </div>

          {/* Table of Ingested Projects */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="px-3.5 py-2.5">Project ID</th>
                  <th className="px-3.5 py-2.5">Title & Sector</th>
                  <th className="px-3.5 py-2.5">District</th>
                  <th className="px-3.5 py-2.5">Sanctioned (₹)</th>
                  <th className="px-3.5 py-2.5">Disbursed (₹)</th>
                  <th className="px-3.5 py-2.5">Progress</th>
                  <th className="px-3.5 py-2.5">AI Risk Score</th>
                  <th className="px-3.5 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(importResult.importedProjects || []).map((p) => (
                  <tr key={p.projectId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-3.5 py-2.5 font-mono font-semibold text-slate-900">{p.projectId}</td>
                    <td className="px-3.5 py-2.5 max-w-xs">
                      <div className="font-medium text-slate-900 truncate">{p.projectName}</div>
                      <div className="text-[10px] text-slate-400">{p.projectType}</div>
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-600">{p.district}</td>
                    <td className="px-3.5 py-2.5 font-mono">₹{(p.sanctionedAmount || 0).toLocaleString('en-IN')}</td>
                    <td className="px-3.5 py-2.5 font-mono text-slate-600">₹{(p.expenditureAmount || 0).toLocaleString('en-IN')}</td>
                    <td className="px-3.5 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] font-semibold">{p.progressPercentage}%</span>
                        {p.delayDays > 0 && <span className="text-[10px] text-red-600">({p.delayDays}d delay)</span>}
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5">
                      <RiskBadge level={p.riskLevel} score={p.riskScore} />
                    </td>
                    <td className="px-3.5 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/projects/${p.projectId}`)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded transition-colors cursor-pointer"
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() => navigate(`/reports/${p.projectId}`)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded transition-colors cursor-pointer"
                        >
                          Dossier
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-slate-500">All imported projects are now permanently accessible across the registry and map.</span>
            <button
              onClick={() => navigate('/projects')}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <span>View in Project Registry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}