"use client";
import { useState } from "react";

interface Step {
  title: string;
  description: string;
  result: string;
  timeframe?: string;
}

interface StepPlanProps {
  steps: Step[] | string;
  title?: string;
}

export default function StepPlan({ steps: stepsProp, title }: StepPlanProps) {
  const steps: Step[] = typeof stepsProp === "string" ? JSON.parse(stepsProp) : (stepsProp ?? []);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const markDone = (e: React.MouseEvent, i: number) => {
    e.stopPropagation();
    setCompletedSteps(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <div className="my-8 rounded-2xl border border-coffee-200 bg-coffee-50 overflow-hidden">
      {title && (
        <div className="px-6 py-4 bg-coffee-700 text-white">
          <h3 className="text-lg font-bold m-0">{title}</h3>
          <p className="text-coffee-200 text-sm mt-1">
            {completedSteps.size}/{steps.length} steps completed
          </p>
        </div>
      )}

      {/* Progress bar */}
      <div className="h-1.5 bg-coffee-200">
        <div
          className="h-full bg-coffee-500 transition-all duration-500"
          style={{ width: `${(completedSteps.size / steps.length) * 100}%` }}
        />
      </div>

      <div className="divide-y divide-coffee-200">
        {steps.map((step, i) => {
          const isOpen = openIndex === i;
          const isDone = completedSteps.has(i);

          return (
            <div
              key={i}
              className={`transition-colors duration-200 ${isDone ? "bg-green-50" : "bg-white"}`}
            >
              {/* Step header — clickable */}
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-coffee-50 transition-colors"
              >
                {/* Step number / done indicator */}
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isDone
                      ? "bg-green-500 text-white"
                      : isOpen
                      ? "bg-coffee-700 text-white"
                      : "bg-coffee-100 text-coffee-700"
                  }`}
                >
                  {isDone ? "✓" : i + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${isDone ? "line-through text-gray-400" : "text-gray-800"}`}>
                    {step.title}
                  </p>
                  {step.timeframe && !isOpen && (
                    <p className="text-xs text-coffee-500 mt-0.5">{step.timeframe}</p>
                  )}
                </div>

                {/* Chevron */}
                <svg
                  className={`w-4 h-4 text-coffee-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded content */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-5 ml-13">
                  <div className="ml-13 pl-[52px]">
                    {step.timeframe && (
                      <span className="inline-block text-xs font-medium text-coffee-600 bg-coffee-100 px-2.5 py-0.5 rounded-full mb-3">
                        ⏱ {step.timeframe}
                      </span>
                    )}

                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Result box */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                        📈 Expected Result
                      </p>
                      <p className="text-sm text-green-800">{step.result}</p>
                    </div>

                    <button
                      onClick={(e) => markDone(e, i)}
                      className={`mt-4 text-xs font-medium px-4 py-2 rounded-full transition-colors ${
                        isDone
                          ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          : "bg-coffee-700 text-white hover:bg-coffee-800"
                      }`}
                    >
                      {isDone ? "Mark as incomplete" : "Mark as done ✓"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
