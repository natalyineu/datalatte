import { Lightbulb, AlertTriangle, Coffee, Zap, BookOpen, HelpCircle } from "lucide-react";
import { ReactNode } from "react";

type CalloutType = "tip" | "warning" | "stat" | "example" | "coffee" | "faq";

const CONFIG: Record<CalloutType, {
  icon: ReactNode;
  bg: string; border: string;
  label: string; labelColor: string; textColor: string;
}> = {
  tip:     { icon: <Lightbulb size={15} />,     bg: "bg-amber-50 dark:bg-amber-950/30",   border: "border-amber-300 dark:border-amber-700",  label: "Pro Tip",          labelColor: "text-amber-700 dark:text-amber-400",  textColor: "text-amber-900 dark:text-amber-200"  },
  warning: { icon: <AlertTriangle size={15} />, bg: "bg-red-50 dark:bg-red-950/30",     border: "border-red-300 dark:border-red-700",    label: "Watch Out",        labelColor: "text-red-700 dark:text-red-400",    textColor: "text-red-900 dark:text-red-200"    },
  stat:    { icon: <Zap size={15} />,           bg: "bg-coffee-50 dark:bg-coffee-900/20",  border: "border-coffee-400 dark:border-coffee-700", label: "Key Stat",         labelColor: "text-coffee-700 dark:text-coffee-400", textColor: "text-coffee-900 dark:text-coffee-200" },
  example: { icon: <BookOpen size={15} />,      bg: "bg-gray-50 dark:bg-gray-800/60",    border: "border-gray-300 dark:border-gray-600",   label: "Real Example",     labelColor: "text-gray-600 dark:text-gray-400",   textColor: "text-gray-800 dark:text-gray-200"   },
  coffee:  { icon: <Coffee size={15} />,        bg: "bg-coffee-50 dark:bg-coffee-900/20",  border: "border-coffee-300 dark:border-coffee-700", label: "DataLatte Take",   labelColor: "text-coffee-700 dark:text-coffee-400", textColor: "text-coffee-900 dark:text-coffee-200" },
  faq:     { icon: <HelpCircle size={15} />,    bg: "bg-blue-50 dark:bg-blue-950/30",    border: "border-blue-300 dark:border-blue-700",   label: "FAQ",              labelColor: "text-blue-700 dark:text-blue-400",   textColor: "text-blue-900 dark:text-blue-200"   },
};

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

export default function Callout({ type = "tip", title, children }: CalloutProps) {
  const c = CONFIG[type] ?? CONFIG.tip;
  return (
    <div className={`my-6 rounded-xl border-l-4 ${c.border} ${c.bg} px-5 py-4 mdx-fade-left`}>
      <div className={`flex items-center gap-2 font-semibold text-sm mb-1.5 ${c.labelColor}`}>
        {c.icon}
        {title ?? c.label}
      </div>
      <div className={`text-sm leading-relaxed ${c.textColor} [&_strong]:font-semibold [&_a]:underline`}>
        {children}
      </div>
    </div>
  );
}
