import React, { useState } from 'react';
import { EventData } from '../types/event';
import { runEventStressTest, StressTestReport } from '../services/stressTestEngine';
import { Brain, AlertCircle, AlertTriangle, CheckCircle2, RefreshCw, ShieldCheck, ArrowRight } from 'lucide-react';

interface StressTestViewProps {
  event: EventData;
  onNavigateTab: (tab: string) => void;
}

export const StressTestView: React.FC<StressTestViewProps> = ({ event, onNavigateTab }) => {
  const [report, setReport] = useState<StressTestReport>(() => runEventStressTest(event));
  const [running, setRunning] = useState<boolean>(false);

  const handleRunTest = () => {
    setRunning(true);
    setTimeout(() => {
      const updated = runEventStressTest(event);
      setReport(updated);
      setRunning(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-stone-900 to-purple-950 text-white rounded-2xl p-6 shadow-md border border-purple-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">
              <Brain className="w-4 h-4" />
              Full System Diagnostic
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">
              Event Stress Test 🧠
            </h2>
            <p className="text-xs text-purple-200 mt-1 max-w-2xl">
              Inspects your complete event architecture—checking seating capacity, RSVP gaps, dietary cross-contamination, budget leaks, and timeline bottlenecks.
            </p>
          </div>

          <button
            onClick={handleRunTest}
            disabled={running}
            className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer self-start sm:self-center"
          >
            <RefreshCw className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
            <span>Stress Test My Event</span>
          </button>
        </div>

        {/* Counter Pills */}
        <div className="mt-5 pt-4 border-t border-purple-800/60 flex items-center gap-4 text-xs flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <strong className="text-white">{report.criticalCount} Critical</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <strong className="text-white">{report.attentionCount} Needs Attention</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <strong className="text-white">{report.goodCount} Looking Good</strong>
          </div>
          <span className="text-stone-400 ml-auto">
            Last tested at {report.timestamp}
          </span>
        </div>
      </div>

      {/* Diagnostic Summary Callout */}
      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 font-medium">
        <strong>Coordinator Diagnostic Assessment:</strong> {report.overallSummary}
      </div>

      {/* 1. CRITICAL CATEGORY (🔴) */}
      {report.critical.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-rose-700 font-serif font-bold text-base">
            <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping inline-block" />
            <h3>🔴 Critical Issues ({report.critical.length})</h3>
          </div>

          <div className="space-y-3">
            {report.critical.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border-l-4 border-l-rose-500 border border-stone-200 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-sm text-stone-900 mt-1">{item.title}</h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{item.description}</p>
                    {item.recommendation && (
                      <div className="mt-3 p-2.5 bg-rose-50/60 rounded-xl text-xs text-rose-900 border border-rose-100 font-medium">
                        <strong>Recommended Fix:</strong> {item.recommendation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. NEEDS ATTENTION CATEGORY (🟠) */}
      {report.attention.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-serif font-bold text-base">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <h3>🟠 Needs Attention ({report.attention.length})</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {report.attention.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border-l-4 border-l-amber-500 border border-stone-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <h4 className="font-bold text-xs text-stone-900 mt-1">{item.title}</h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">{item.description}</p>
                </div>
                {item.recommendation && (
                  <div className="mt-3 pt-2 border-t border-stone-100 text-[11px] text-amber-900 font-medium">
                    {item.recommendation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. LOOKING GOOD CATEGORY (🟢) */}
      {report.good.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-serif font-bold text-base">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <h3>🟢 Looking Good ({report.good.length})</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {report.good.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border-l-4 border-l-emerald-500 border border-stone-200 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-emerald-700">{item.category}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <h4 className="font-bold text-xs text-stone-900 mt-1">{item.title}</h4>
                <p className="text-xs text-stone-500 mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
