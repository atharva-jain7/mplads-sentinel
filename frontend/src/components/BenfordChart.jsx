import React from 'react';

export default function BenfordChart({ distribution, isAnomaly, deviationScore }) {
  const defaultDist = [
    { digit: 1, expected: 30.1, observed: 8.3 },
    { digit: 2, expected: 17.6, observed: 58.3 },
    { digit: 3, expected: 12.5, observed: 0.0 },
    { digit: 4, expected: 9.7, observed: 0.0 },
    { digit: 5, expected: 7.9, observed: 16.7 },
    { digit: 6, expected: 6.7, observed: 0.0 },
    { digit: 7, expected: 5.8, observed: 0.0 },
    { digit: 8, expected: 5.1, observed: 8.3 },
    { digit: 9, expected: 4.6, observed: 8.3 }
  ];

  const digits = distribution || defaultDist;

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Financial Digit Pattern Anomaly (Benford's Law Screening)</h4>
          <p className="text-xs text-slate-500">Payment values show an unusual first-digit distribution relative to the reference dataset. This is a screening signal requiring financial verification.</p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs text-slate-400">Signal Deviation:</span>
          <span className="ml-1 font-mono font-bold text-slate-800">{deviationScore || 72}/100</span>
        </div>
      </div>

      <div className="h-40 flex items-end gap-2 pt-4 pb-2 px-1 border-b border-slate-100">
        {digits.map((item) => (
          <div key={item.digit} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
            <div className="w-full flex items-end justify-center gap-1 h-28">
              <div
                style={{ height: `${Math.min(100, item.expected * 2.2)}px` }}
                className="w-3 bg-slate-300 rounded-t"
                title={`Expected: ${item.expected}%`}
              />
              <div
                style={{ height: `${Math.min(100, item.observed * 2.2)}px` }}
                className={`w-3 rounded-t ${
                  Math.abs(item.observed - item.expected) > 15
                    ? 'bg-amber-500'
                    : 'bg-slate-700'
                }`}
                title={`Observed: ${item.observed}%`}
              />
            </div>
            <span className="text-xs font-mono font-semibold text-slate-700">{item.digit}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 mt-2.5">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2 bg-slate-300 rounded-xs" /> Expected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2 bg-slate-700 rounded-xs" /> Observed
          </span>
        </div>
        <span className="text-slate-600 text-[11px]">
          Screening signal requiring financial verification. Benford's Law is presented as an anomaly signal, NOT proof of fraud.
        </span>
      </div>
    </div>
  );
}