import React from "react";
import Callout from "@/components/mdx/Callout";
import BarChart from "@/components/mdx/BarChart";
import StatRow from "@/components/mdx/StatRow";
import { ColumnChart, AreaChart, StackedBar, Heatmap, RadarChart, ScoreBreakdown, ProjectionChart, BubbleChart, BigStat } from "@/components/mdx/Charts";
import Funnel from "@/components/mdx/Funnel";
import DonutChart from "@/components/mdx/DonutChart";
import LineChart from "@/components/mdx/LineChart";
import CompareBar from "@/components/mdx/CompareBar";
import StepPlan from "@/components/mdx/StepPlan";

function headingId(text: string): string {
  return String(text).toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export const mdxComponents = {
  StepPlan,
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = headingId(String(children));
    return (
      <h2 id={id} className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-10 mb-4 scroll-mt-24" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = headingId(String(children));
    return (
      <h3 id={id} className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-3 scroll-mt-24" {...props}>
        {children}
      </h3>
    );
  },
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <div className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside mb-5 space-y-2 text-gray-600 dark:text-gray-300" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside mb-5 space-y-2 text-gray-600 dark:text-gray-300" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-gray-600 dark:text-gray-300 mb-1" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-gray-800 dark:text-gray-100" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-coffee-700 dark:text-coffee-400 underline hover:text-coffee-900 dark:hover:text-coffee-200" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-4 border-coffee-300 dark:border-coffee-700 pl-4 italic text-gray-500 dark:text-gray-400 my-6" {...props} />
  ),
  hr: () => <hr className="my-8 border-gray-200 dark:border-gray-700" />,
  Callout,
  BarChart,
  StatRow,
  Funnel,
  DonutChart,
  LineChart,
  CompareBar,
  ColumnChart,
  AreaChart,
  StackedBar,
  Heatmap,
  RadarChart,
  ScoreBreakdown,
  ProjectionChart,
  BubbleChart,
  BigStat,
  // Aliases for shorthand component names the AI sometimes generates
  Tip: ({ children }: { children: React.ReactNode }) => <Callout type="tip">{children}</Callout>,
  Warning: ({ children }: { children: React.ReactNode }) => <Callout type="warning">{children}</Callout>,
  Coffee: ({ children }: { children: React.ReactNode }) => <Callout type="coffee">{children}</Callout>,
  Example: ({ children }: { children: React.ReactNode }) => <Callout type="example">{children}</Callout>,
  Stat: ({ children }: { children: React.ReactNode }) => <Callout type="stat">{children}</Callout>,
  Faq: ({ children }: { children: React.ReactNode }) => <Callout type="faq">{children}</Callout>,
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-coffee-50 dark:bg-gray-800 text-coffee-800 dark:text-coffee-300 text-xs font-mono px-1.5 py-0.5 rounded" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="bg-gray-900 text-gray-100 text-sm font-mono rounded-xl p-5 overflow-x-auto my-6" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <table className="w-full text-sm text-left border-collapse" {...props} />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-coffee-50 dark:bg-gray-800 text-coffee-900 dark:text-coffee-200" {...props} />
  ),
  tbody: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className="divide-y divide-gray-100 dark:divide-gray-700" {...props} />
  ),
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors" {...props} />
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-4 py-3 font-semibold text-coffee-800 dark:text-coffee-200 text-xs uppercase tracking-wide border-b border-coffee-100 dark:border-gray-700 whitespace-nowrap" {...props} />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 align-top" {...props} />
  ),
};
