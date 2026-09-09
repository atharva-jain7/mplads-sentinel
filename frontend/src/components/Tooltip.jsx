import React, { useState } from 'react';

export default function Tooltip({ title, content, children, position = 'top', className = '' }) {
  const [visible, setVisible] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-full mt-2 left-1/2 -translate-x-1/2';
      case 'left':
        return 'right-full mr-2 top-1/2 -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 -translate-y-1/2';
      case 'top':
      default:
        return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
    }
  };

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <div
          className={`absolute z-50 pointer-events-none w-64 p-3 bg-slate-900/95 text-white rounded-xl shadow-2xl border border-slate-700/80 backdrop-blur-sm tooltip-popover text-left ${getPositionClasses()}`}
        >
          {title && (
            <div className="font-bold text-amber-400 mb-1 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {title}
            </div>
          )}
          <div className="text-[11px] text-slate-200 leading-relaxed font-normal">
            {content}
          </div>
          <div
            className={`absolute w-2 h-2 bg-slate-900 border-slate-700 rotate-45 ${
              position === 'bottom'
                ? '-top-1 left-1/2 -translate-x-1/2 border-t border-l'
                : 'left-1/2 -translate-x-1/2 -bottom-1 border-b border-r'
            }`}
          />
        </div>
      )}
    </div>
  );
}